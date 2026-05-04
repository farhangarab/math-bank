from flask import Blueprint, current_app, request
from flask_login import current_user, login_required, login_user, logout_user
from sqlalchemy.exc import IntegrityError
from app import db
from app.models.user import User
from app.models.enums import UserRole
from app.extensions import bcrypt
from app.auth_utils import serialize_user
from app.response_utils import error_response, field_error, success_response
from app.validation_utils import first_required_error

auth_bp = Blueprint("auth", __name__)


def normalize_full_name(value):
    words = (value or "").strip().split()
    return " ".join(word.capitalize() for word in words)


def normalize_lower_text(value):
    return (value or "").strip().lower()


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json() or {}

    username = normalize_lower_text(data.get("username"))
    full_name = normalize_full_name(data.get("full_name"))
    email = normalize_lower_text(data.get("email"))
    password = data.get("password")
    role = data.get("role")
    teacher_code = data.get("teacher_code")

    field, message = first_required_error(
        data,
        [
            ("full_name", "Full name is required."),
            ("username", "Username is required."),
            ("email", "Email is required."),
            ("password", "Password is required."),
            ("role", "Role is required."),
        ],
    )
    if field:
        return field_error(field, message)

    if not role in ["STUDENT", "TEACHER"]:
        return field_error("role", "Role must be student or teacher.")

    if role == "TEACHER":
        if not teacher_code or not teacher_code.strip():
            return field_error("teacher_code", "Teacher access code is required.")

        if teacher_code != current_app.config["TEACHER_ACCESS_CODE"]:
            return field_error("teacher_code", "Teacher access code is invalid.")

    # valid email
    email_pattern = r"^[^@]+@[^@]+\.[^@]+$"

    import re

    if not re.match(email_pattern, email):
        return field_error("email", "Email format is invalid.")

    if len(password) < 8:
        return field_error("password", "Password must be at least 8 characters.")

    if User.query.filter_by(username=username).first():
        return field_error("username", "Username is already taken.")

    if User.query.filter_by(email=email).first():
        return field_error("email", "Email is already registered.")

    hashed = bcrypt.generate_password_hash(password).decode("utf-8")

    user = User(
        username=username,
        full_name=full_name,
        email=email,
        password_hash=hashed,
        role=UserRole(role),
    )

    try:
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return error_response(
            "Username or email is already registered.",
            400,
            {"general": "Username or email is already registered."},
        )

    return success_response(
        "Account created successfully.",
        {"user": serialize_user(user)},
        201,
    )


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json() or {}

    identifier = normalize_lower_text(data.get("username") or data.get("email"))
    password = data.get("password")
    remember = bool(data.get("remember"))

    if not identifier:
        return field_error("identifier", "Username or email is required.")

    if not password:
        return field_error("password", "Password is required.")

    # Allow either username or email while keeping the existing route shape.
    user = User.query.filter(
        (User.username == identifier) | (User.email == identifier)
    ).first()

    if not user:
        return error_response("Username/email or password is incorrect.", 401)

    if not bcrypt.check_password_hash(user.password_hash, password):
        return error_response("Username/email or password is incorrect.", 401)

    login_user(user, remember=remember)

    return success_response("Login successful.", {"user": serialize_user(user)})


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return success_response("Logout successful.")


@auth_bp.route("/me", methods=["GET"])
def me():
    if not current_user.is_authenticated:
        return error_response("Not logged in.", 401)

    return success_response("Current user loaded.", {"user": serialize_user(current_user)})
