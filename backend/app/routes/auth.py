from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required, login_user, logout_user
from app import db
from app.models.user import User
from app.models.enums import UserRole
from app.extensions import bcrypt
from app.auth_utils import serialize_user

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

    if not username or not password or not email or not role:
        return jsonify({"error": "Missing fields"}), 400

    if not role in ["STUDENT", "TEACHER"]:
        return jsonify({"error": "Invalid role"}), 400

    if role == "TEACHER":
        if teacher_code != TEACHER_CODE:
            return jsonify({"error": "Invalid teacher code"}), 400

    # valid email
    email_pattern = r"^[^@]+@[^@]+\.[^@]+$"

    import re

    if not re.match(email_pattern, email):
        return jsonify({"error": "Invalid email"}), 400

    if len(password) < 8:
        return jsonify({"error": "Password too short"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username exists"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email exists"}), 400

    hashed = bcrypt.generate_password_hash(password).decode("utf-8")

    user = User(
        username=username,
        full_name=full_name,
        email=email,
        password_hash=hashed,
        role=UserRole(role),
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    identifier = (data.get("username") or data.get("email") or "").strip()
    password = data.get("password")
    remember = bool(data.get("remember"))

    if not identifier:
        return jsonify({"error": "Username or email is missing"}), 400

    if not password:
        return jsonify({"error": "Password is missing"}), 400

    # Allow either username or email while keeping the existing route shape.
    user = User.query.filter(
        (User.username == identifier) | (User.email == identifier)
    ).first()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    login_user(user, remember=remember)

    return (
        jsonify(
            {
                "message": "Login successful",
                "user": serialize_user(user),
            }
        ),
        200,
    )


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200


@auth_bp.route("/me", methods=["GET"])
def me():
    if not current_user.is_authenticated:
        return jsonify({"error": "Not logged in"}), 401

    return jsonify({"user": serialize_user(current_user)}), 200
