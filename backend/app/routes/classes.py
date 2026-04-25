from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app import db
from app.models.class_model import Class
from app.models.enums import UserRole
from app.models.class_member import ClassMember
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
            {"id": c.id, "class_name": c.class_name, "class_code": c.class_code}
        )

    return jsonify(result), 200


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
