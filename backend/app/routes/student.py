from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required

from app import db

from app.models.class_model import Class
from app.models.class_member import ClassMember
from app.models.enums import UserRole
from app.auth_utils import role_required


student_bp = Blueprint("student_bp", __name__)


# Student join the class
@student_bp.route("/join-class", methods=["POST"])
@login_required
@role_required(UserRole.STUDENT)
def join_class():

    data = request.json

    class_code = data.get("class_code")

    # find the class
    class_obj = Class.query.filter_by(class_code=class_code).first()

    if not class_obj:
        return jsonify({"error": "Invalid class code"}), 404

    # avoid duplicate join
    existing = ClassMember.query.filter_by(
        class_id=class_obj.id, student_id=current_user.id
    ).first()

    if existing:
        return jsonify({"error": "Already joined"}), 400

    member = ClassMember(class_id=class_obj.id, student_id=current_user.id)

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
@student_bp.route("/classes", methods=["GET"])
@login_required
@role_required(UserRole.STUDENT)
def get_my_classes():
    memberships = ClassMember.query.filter_by(student_id=current_user.id).all()

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
