from flask import Flask
from flask_cors import CORS
from .config import Config
from app.extensions import db, bcrypt, login_manager
from .routes.auth import auth_bp
from .routes.classes import classes_bp
from .routes.student import student_bp
from .routes.assignment import assignments_bp
from .routes.questions import questions_bp
from .routes.attempt import attempt_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        supports_credentials=True,
        origins=app.config["FRONTEND_ORIGINS"],
    )

    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "auth.login"
    login_manager.session_protection = "basic"

    @login_manager.user_loader
    def load_user(user_id):
        from app.models.user import User

        return db.session.get(User, int(user_id))

    @login_manager.unauthorized_handler
    def unauthorized():
        return {"error": "Authentication required"}, 401

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
    app.register_blueprint(classes_bp, url_prefix="/api/classes")
    app.register_blueprint(student_bp, url_prefix="/api/student")
    app.register_blueprint(assignments_bp, url_prefix="/api/assignments")
    app.register_blueprint(questions_bp, url_prefix="/api/questions")
    app.register_blueprint(attempt_bp, url_prefix="/api/attempts")

    return app
