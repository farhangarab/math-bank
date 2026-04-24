from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app import db
from app.models.class_model import Class
from app.models.enums import UserRole
from app.models.class_member import ClassMember
from app.auth_utils import role_required

from app.utils.code_generator import generate_class_code


classes_bp = Blueprint("classes", __name__)


# create class
@classes_bp.route("/create", methods=["POST"])
@login_required
@role_required(UserRole.TEACHER)
def create_class():

    data = request.json

    class_name = data.get("class_name")
    if not class_name or not class_name.strip():
        return jsonify({"error": "class_name required"}), 400

    class_name = class_name.strip()

    class_code = generate_class_code()

    new_class = Class(
        class_name=class_name,
        class_code=class_code,
        teacher_id=current_user.id,
    )

    db.session.add(new_class)
    db.session.commit()

    return jsonify({"message": "Class created", "class_code": class_code}), 201


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
        return jsonify({"error": "class_id required"}), 400

    c = Class.query.get(class_id)

    if not c:
        return jsonify({"error": "class not found"}), 404

    is_teacher = c.teacher_id == current_user.id
    is_student = (
        ClassMember.query.filter_by(class_id=c.id, student_id=current_user.id).first()
        is not None
    )

    if not is_teacher and not is_student:
        return jsonify({"error": "Forbidden"}), 403

    return jsonify(
        {
            "id": c.id,
            "class_name": c.class_name,
            "class_code": c.class_code,
            "teacher_id": c.teacher_id,
        }
    )
