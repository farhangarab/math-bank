from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config import Config
from app.extensions import db, bcrypt
from .routes.auth import auth_bp
from .routes.classes import classes_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)

    bcrypt.init_app(app)

    from app.models import (
        Class,
        User,
        ClassMember,
        Assignment,
        Question,
        Attempt,
        AttemptAnswer,
    )

    # register routes
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(classes_bp, url_prefix="/classes")

    return app
