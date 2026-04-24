from functools import wraps

from flask import jsonify
from flask_login import current_user

from app.models.enums import UserRole


def serialize_user(user):
    return {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "role": user.role.value,
    }


def role_required(*roles):
    allowed_roles = set()

    for role in roles:
        if isinstance(role, UserRole):
            allowed_roles.add(role)
        else:
            allowed_roles.add(UserRole(role))

    def decorator(view_func):
        @wraps(view_func)
        def wrapped(*args, **kwargs):
            if not current_user.is_authenticated:
                return jsonify({"error": "Authentication required"}), 401

            if current_user.role not in allowed_roles:
                return jsonify({"error": "Forbidden"}), 403

            return view_func(*args, **kwargs)

        return wrapped

    return decorator
