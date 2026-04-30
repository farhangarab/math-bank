from app import db


class ClassMember(db.Model):

    __tablename__ = "class_members"
    __table_args__ = (
        db.UniqueConstraint("student_id", "class_id", name="uq_student_class"),
    )

    id = db.Column(db.Integer, primary_key=True)

    joined_at = db.Column(db.DateTime, server_default=db.func.now())

    class_id = db.Column(db.Integer, db.ForeignKey("classes.id"), nullable=False)

    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    class_obj = db.relationship("Class", backref="members")

    student = db.relationship("User", backref="class_memberships")
