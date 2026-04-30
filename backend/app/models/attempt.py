from app import db
from sqlalchemy import Enum


class Attempt(db.Model):

    __tablename__ = "attempts"
    __table_args__ = (
        db.UniqueConstraint(
            "assignment_id",
            "class_member_id",
            name="uq_attempt_assignment_class_member",
        ),
    )

    id = db.Column(db.Integer, primary_key=True)

    status = db.Column(
        Enum("NOT_STARTED", "IN_PROGRESS", "SUBMITTED", name="attempt_status"),
        default="NOT_STARTED",
        nullable=False,
    )

    started_At = db.Column(db.DateTime, server_default=db.func.now())

    submitted_At = db.Column(db.DateTime, nullable=True)

    total_score = db.Column(db.Float, default=0)

    assignment_id = db.Column(
        db.Integer, db.ForeignKey("assignments.id"), nullable=False
    )

    class_member_id = db.Column(
        db.Integer, db.ForeignKey("class_members.id"), nullable=False
    )

    assignment = db.relationship("Assignment", backref="attempts")

    class_member = db.relationship(
        "ClassMember",
        backref=db.backref("attempts", cascade="all, delete-orphan"),
    )
