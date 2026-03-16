from app import db


class Class(db.Model):

    __tablename__ = "classes"

    id = db.Column(db.Integer, primary_key=True)

    class_name = db.Column(db.String(150), nullable=False)

    class_code = db.Column(db.String(50), unique=True, nullable=False)

    teacher_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)

    teacher = db.relationship("User", backref="classes_taught")
