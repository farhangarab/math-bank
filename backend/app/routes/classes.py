from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from sqlalchemy.exc import IntegrityError
from app import db
from app.models.class_model import Class
from app.models.enums import UserRole
from app.models.class_member import ClassMember
from app.models.assignment import Assignment
from app.models.attempt import Attempt
from app.models.attempt_answer import AttemptAnswer
from app.models.question import Question
from app.models.user import User
from app.auth_utils import role_required
from app.response_utils import error_response, field_error, success_response

from app.utils.code_generator import generate_unique_class_code


classes_bp = Blueprint("classes", __name__)


def validate_class_name(data):
    class_name = data.get("class_name")

    if not class_name or not class_name.strip():
        return None, field_error("class_name", "Class name is required.")

    return class_name.strip(), None


# create class
@classes_bp.route("/create", methods=["POST"])
@login_required
@role_required(UserRole.TEACHER)
def create_class():

    data = request.get_json() or {}

    class_name, error = validate_class_name(data)
    if error:
        return error

    try:
        class_code = generate_unique_class_code()
    except ValueError as error:
        return error_response(str(error), 500)

    new_class = Class(
        class_name=class_name,
        class_code=class_code,
        teacher_id=current_user.id,
    )

    try:
        db.session.add(new_class)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return error_response(
            "Could not create class with a unique class code. Please try again.",
            500,
        )

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


@classes_bp.route("/<int:class_id>", methods=["PUT"])
@login_required
@role_required(UserRole.TEACHER)
def update_class(class_id):
    class_obj = db.session.get(Class, class_id)

    if not class_obj:
        return error_response("Class was not found.", 404)

    if class_obj.teacher_id != current_user.id:
        return error_response("You do not have permission to update this class.", 403)

    data = request.get_json() or {}
    class_name, error = validate_class_name(data)
    if error:
        return error

    class_obj.class_name = class_name
    db.session.commit()

    return success_response("Class updated successfully.")


@classes_bp.route("/<int:class_id>", methods=["DELETE"])
@login_required
@role_required(UserRole.TEACHER)
def delete_class(class_id):
    class_obj = db.session.get(Class, class_id)

    if not class_obj:
        return error_response("Class was not found.", 404)

    if class_obj.teacher_id != current_user.id:
        return error_response("You do not have permission to delete this class.", 403)

    try:
        assignments = Assignment.query.filter_by(class_id=class_obj.id).all()
        class_members = ClassMember.query.filter_by(class_id=class_obj.id).all()

        assignment_ids = [assignment.id for assignment in assignments]
        member_ids = [member.id for member in class_members]

        questions = []
        attempts = []

        if assignment_ids:
            questions = Question.query.filter(
                Question.assignment_id.in_(assignment_ids)
            ).all()
            attempts = Attempt.query.filter(
                Attempt.assignment_id.in_(assignment_ids)
            ).all()

        if member_ids:
            member_attempts = Attempt.query.filter(
                Attempt.class_member_id.in_(member_ids)
            ).all()
            existing_attempt_ids = {attempt.id for attempt in attempts}
            attempts.extend(
                attempt
                for attempt in member_attempts
                if attempt.id not in existing_attempt_ids
            )

        for attempt in attempts:
            AttemptAnswer.query.filter_by(attempt_id=attempt.id).delete()

        for question in questions:
            AttemptAnswer.query.filter_by(question_id=question.id).delete()

        for attempt in attempts:
            db.session.delete(attempt)

        for question in questions:
            db.session.delete(question)

        for assignment in assignments:
            db.session.delete(assignment)

        for member in class_members:
            db.session.delete(member)

        db.session.delete(class_obj)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return error_response("Failed to delete class.", 500)

    return success_response("Class deleted successfully.")


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
