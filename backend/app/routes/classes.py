from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app import db
from app.models.class_model import Class
from app.models.enums import UserRole
from app.models.class_member import ClassMember
from app.models.assignment import Assignment
from app.models.attempt import Attempt
from app.models.attempt_answer import AttemptAnswer
from app.models.user import User
from app.auth_utils import role_required
from app.response_utils import error_response, field_error, success_response

from app.utils.code_generator import generate_class_code


classes_bp = Blueprint("classes", __name__)


# create class
@classes_bp.route("/create", methods=["POST"])
@login_required
@role_required(UserRole.TEACHER)
def create_class():

    data = request.get_json() or {}

    class_name = data.get("class_name")
    if not class_name or not class_name.strip():
        return field_error("class_name", "Class name is required.")

    class_name = class_name.strip()

    class_code = generate_class_code()

    new_class = Class(
        class_name=class_name,
        class_code=class_code,
        teacher_id=current_user.id,
    )

    db.session.add(new_class)
    db.session.commit()

    return success_response(
        "Class created successfully.",
        {"class_code": class_code, "class_id": new_class.id},
        201,
    )


# get classes with teacher id
@classes_bp.route("/teacher-classes", methods=["GET"])
@login_required
@role_required(UserRole.TEACHER)
def get_my_classes():
    classes = Class.query.filter_by(teacher_id=current_user.id).all()

    result = []

    for c in classes:
        result.append(
            {
                "id": c.id,
                "class_name": c.class_name,
                "class_code": c.class_code,
                "students_count": ClassMember.query.filter_by(class_id=c.id).count(),
                "assignments_count": Assignment.query.filter_by(class_id=c.id).count(),
                "created_at": c.created_at.isoformat() if c.created_at else None,
            }
        )

    return jsonify(result), 200


# get students in one teacher class
@classes_bp.route("/<int:class_id>/students", methods=["GET"])
@login_required
@role_required(UserRole.TEACHER)
def get_class_students(class_id):
    class_obj = Class.query.get(class_id)

    if not class_obj:
        return error_response("Class was not found.", 404)

    if class_obj.teacher_id != current_user.id:
        return error_response("You do not have permission to view this class.", 403)

    memberships = (
        db.session.query(ClassMember, User)
        .join(User, ClassMember.student_id == User.id)
        .filter(ClassMember.class_id == class_obj.id)
        .order_by(User.full_name)
        .all()
    )

    students = []

    for member, student in memberships:
        students.append(
            {
                "class_member_id": member.id,
                "student_id": student.id,
                "student_name": student.full_name,
                "email": student.email,
                "joined_on": member.joined_at.isoformat() if member.joined_at else None,
            }
        )

    return jsonify(
        {
            "class_id": class_obj.id,
            "class_name": class_obj.class_name,
            "students": students,
        }
    ), 200


# remove one student from a teacher class
@classes_bp.route("/<int:class_id>/students/<int:student_id>", methods=["DELETE"])
@login_required
@role_required(UserRole.TEACHER)
def remove_class_student(class_id, student_id):
    class_obj = Class.query.get(class_id)

    if not class_obj:
        return error_response("Class was not found.", 404)

    if class_obj.teacher_id != current_user.id:
        return error_response("You do not have permission to update this class.", 403)

    member = ClassMember.query.filter_by(
        class_id=class_obj.id, student_id=student_id
    ).first()

    if not member:
        return error_response("Student was not found in this class.", 404)

    try:
        attempts = Attempt.query.filter_by(class_member_id=member.id).all()

        for attempt in attempts:
            AttemptAnswer.query.filter_by(attempt_id=attempt.id).delete()
            db.session.delete(attempt)

        db.session.delete(member)
        db.session.commit()

        return jsonify({"message": "Student removed from class"}), 200
    except Exception:
        db.session.rollback()
        return error_response("Failed to remove student from class.", 500)


# Get class by Id
@classes_bp.route("/one", methods=["GET"])
@login_required
def get_class():

    class_id = request.args.get("class_id")

    if not class_id:
        return field_error("class_id", "Class ID is required.")

    c = Class.query.get(class_id)

    if not c:
        return error_response("Class was not found.", 404)

    is_teacher = c.teacher_id == current_user.id
    is_student = (
        ClassMember.query.filter_by(class_id=c.id, student_id=current_user.id).first()
        is not None
    )

    if not is_teacher and not is_student:
        return error_response("You do not have permission to view this class.", 403)

    return jsonify(
        {
            "id": c.id,
            "class_name": c.class_name,
            "class_code": c.class_code,
            "teacher_id": c.teacher_id,
        }
    )
