from flask import Blueprint, request, jsonify

from app import db

from app.models.user import User
from app.models.class_model import Class
from app.models.class_member import ClassMember
from app.models.enums import UserRole


student_bp = Blueprint("student_bp", __name__)


# Student join the class
@student_bp.route("/join-class", methods=["POST"])
def join_class():

    data = request.json

    user_id = data.get("user_id")
    class_code = data.get("class_code")

    # check the user exist
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # check the role
    if user.role != UserRole.STUDENT:
        return jsonify({"error": "Only students can join classes"}), 403

    # find the class
    class_obj = Class.query.filter_by(class_code=class_code).first()

    if not class_obj:
        return jsonify({"error": "Invalid class code"}), 404

    # avoid duplicate join
    existing = ClassMember.query.filter_by(
        class_id=class_obj.id, student_id=user.id
    ).first()

    if existing:
        return jsonify({"error": "Already joined"}), 400

    member = ClassMember(class_id=class_obj.id, student_id=user.id)

    db.session.add(member)
    db.session.commit()

    return (
        jsonify(
            {
                "message": "Joined class successfully",
                "class_id": class_obj.id,
                "class_name": class_obj.class_name,
            }
        ),
        200,
    )


# Get student classes
@student_bp.route("/my-classes", methods=["GET"])
def get_my_classes():

    user_id = request.args.get("user_id")

    # Get the user
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Check the role
    if user.role != UserRole.STUDENT:
        return jsonify({"error": "Only students allowed"}), 403

    # Get the membership
    memberships = ClassMember.query.filter_by(student_id=user.id).all()

    # Create the classes
    result = []

    for m in memberships:

        c = m.class_obj

        result.append(
            {
                "class_id": c.id,
                "class_name": c.class_name,
                "class_code": c.class_code,
                "teacher_id": c.teacher_id,
            }
        )

    return jsonify(result), 200
