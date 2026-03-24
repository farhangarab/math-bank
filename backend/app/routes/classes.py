from flask import Blueprint, request, jsonify
from app import db
from app.models.class_model import Class
from app.models.user import User
from app.models.enums import UserRole

from app.utils.code_generator import generate_class_code


classes_bp = Blueprint("classes", __name__)


# create class
@classes_bp.route("/create", methods=["POST"])
def create_class():

    data = request.json

    class_name = data.get("class_name")
    teacher_id = data.get("teacher_id")

    if not class_name:
        return jsonify({"error": "class_name required"}), 400

    if not teacher_id:
        return jsonify({"error": "teacher_id required"}), 400

    teacher = User.query.get(teacher_id)
    if not teacher:
        return jsonify({"error": "Teacher not found"}), 404

    if teacher.role != UserRole.TEACHER:
        return jsonify({"error": "Only teacher can create class"}), 403

    class_code = generate_class_code()

    new_class = Class(
        class_name=class_name, class_code=class_code, teacher_id=teacher_id
    )

    db.session.add(new_class)
    db.session.commit()

    return jsonify({"message": "Class created", "class_code": class_code}), 201


# get classes with teacher id
@classes_bp.route("/teacher-classes", methods=["GET"])
def get_my_classes():

    teacher_id = request.args.get("teacher_id")

    if not teacher_id:
        return jsonify({"error": "teacher_id required"}), 400

    teacher = User.query.get(teacher_id)

    if not teacher:
        return jsonify({"error": "Teacher not found"}), 404

    if teacher.role != UserRole.TEACHER:
        return jsonify({"error": "Only teacher allowed"}), 403

    classes = Class.query.filter_by(teacher_id=teacher_id).all()

    result = []

    for c in classes:
        result.append(
            {"id": c.id, "class_name": c.class_name, "class_code": c.class_code}
        )

    return jsonify(result), 200


# Get class by Id
@classes_bp.route("/one", methods=["GET"])
def get_class():

    class_id = request.args.get("class_id")

    if not class_id:
        return jsonify({"error": "class_id required"}), 400

    c = Class.query.get(class_id)

    if not c:
        return jsonify({"error": "class not found"}), 404

    return jsonify(
        {
            "id": c.id,
            "class_name": c.class_name,
            "class_code": c.class_code,
            "teacher_id": c.teacher_id,
        }
    )
