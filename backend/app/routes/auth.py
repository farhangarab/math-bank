from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
import bcrypt

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.json

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not username or not password:
        return jsonify({"error": "Missing fields"}), 400

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    user = User(
        username=username,
        email=email,
        password_hash=hashed.decode(),
        role=role,
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created"})
