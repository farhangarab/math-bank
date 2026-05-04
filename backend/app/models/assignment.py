from app import db


class Assignment(db.Model):

    __tablename__ = "assignments"
    __table_args__ = (
        db.UniqueConstraint("class_id", "title", name="uq_assignment_class_title"),
    )

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(150), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    due_date = db.Column(db.DateTime, nullable=True)

    class_id = db.Column(db.Integer, db.ForeignKey("classes.id"), nullable=False)

    class_obj = db.relationship("Class", backref="assignmentss")
