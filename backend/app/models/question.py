from app import db
from .enums import GradingType


class Question(db.Model):

    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)

    question_text = db.Column(db.Text, nullable=False)

    correct_answer = db.Column(db.String(255), nullable=False)

    points = db.Column(db.Integer, default=1)

    order_index = db.Column(db.Integer, nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    grading_type = db.Column(db.Enum(GradingType), nullable=False)

    require_simplified = db.Column(db.Boolean, nullable=False)

    assignment_id = db.Column(
        db.Integer, db.ForeignKey("assignments.id"), nullable=False
    )

    assignment = db.relationship("Assignment", backref="questions")
