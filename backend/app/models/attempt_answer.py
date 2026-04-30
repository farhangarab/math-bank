from app import db


class AttemptAnswer(db.Model):

    __tablename__ = "attempt_answers"

    __table_args__ = (
        db.UniqueConstraint("attempt_id", "question_id", name="uq_attempt_question"),
    )

    id = db.Column(db.Integer, primary_key=True)

    answer_text = db.Column(db.Text, nullable=True)

    score = db.Column(db.Float, default=0)

    is_correct = db.Column(db.Boolean, default=False)

    saved_at = db.Column(db.DateTime, server_default=db.func.now())

    attempt_id = db.Column(db.Integer, db.ForeignKey("attempts.id"), nullable=False)

    question_id = db.Column(db.Integer, db.ForeignKey("questions.id"), nullable=False)

    attempt = db.relationship(
        "Attempt",
        backref=db.backref("answers", cascade="all, delete-orphan"),
    )

    question = db.relationship("Question", backref="attempt_answers")
