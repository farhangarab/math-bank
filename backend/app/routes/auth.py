from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from app.models.enums import UserRole
import bcrypt

auth_bp = Blueprint("auth", __name__)

# Mock code
TEACHER_CODE = "ABC123"


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.json

    username = data.get("username")
    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")
    teacher_code = data.get("teacher_code")

    # check all field exist
    if not username or not password or not email or not role:
        return jsonify({"error": "Missing fields"}), 400

    # check the role
    if not role in ["STUDENT", "TEACHER"]:
        return jsonify({"error": "Invalid role"}), 400

    # check teacher code
    if role == "TEACHER":
        if teacher_code != TEACHER_CODE:
            return jsonify({"error": "Invalid teacher code"}), 400

    # check unique username & email
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username exists"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email exists"}), 400

    # hash the password
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    # create the user
    user = User(
        username=username,
        full_name=full_name,
        email=email,
        password_hash=hashed.decode(),
        role=UserRole(role),
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201
