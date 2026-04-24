from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app.models.assignment import Assignment
from app.models.attempt import Attempt
from app.models.class_member import ClassMember
from app.models.class_model import Class
from app.models.enums import AttemptStatus, UserRole
from app.models.question import Question
from app.models.user import User
from datetime import datetime
from app import db
from app.auth_utils import role_required


assignments_bp = Blueprint("assignments", __name__)


def serialize_attempt_status(status):
    return status.value if hasattr(status, "value") else status


# Get all assignment
@assignments_bp.route("/", methods=["GET"])
@login_required
def get_assignments():
    class_id = request.args.get("class_id")

    if not class_id:
        return jsonify({"error": "class id required"}), 400

    class_obj = db.session.get(Class, class_id)
    if not class_obj:
        return jsonify({"error": "class not found"}), 404

    assignments = Assignment.query.filter_by(class_id=class_id).all()

    result = []

    class_member = None
    if current_user.role == UserRole.STUDENT:
        class_member = ClassMember.query.filter_by(
            student_id=current_user.id, class_id=class_id
        ).first()
        if not class_member:
            return jsonify({"error": "Forbidden"}), 403
    elif (
        current_user.role == UserRole.TEACHER
        and class_obj.teacher_id != current_user.id
    ):
        return jsonify({"error": "Forbidden"}), 403

    assignment_ids = [a.id for a in assignments]
    max_scores = {}

    if assignment_ids:
        max_scores = {
            assignment_id: float(max_score or 0)
            for assignment_id, max_score in (
                db.session.query(
                    Question.assignment_id,
                    db.func.coalesce(db.func.sum(Question.points), 0),
                )
                .filter(Question.assignment_id.in_(assignment_ids))
                .group_by(Question.assignment_id)
                .all()
            )
        }

    for a in assignments:
        item = {
            "id": a.id,
            "title": a.title,
            "class_id": a.class_id,
            "due_date": a.due_date,
            "max_score": max_scores.get(a.id, 0),
        }

        if class_member:
            attempt = (
                Attempt.query.filter_by(
                    assignment_id=a.id, class_member_id=class_member.id
                )
                .order_by(Attempt.id.desc())
                .first()
            )

            if attempt:
                item["attempt_id"] = attempt.id
                item["status"] = serialize_attempt_status(attempt.status)
                item["score"] = (
                    attempt.total_score
                    if serialize_attempt_status(attempt.status)
                    == AttemptStatus.SUBMITTED.value
                    else None
                )
            else:
                item["attempt_id"] = None
                item["status"] = AttemptStatus.NOT_STARTED.value
                item["score"] = None

        result.append(item)

    return jsonify(result), 200


# create an assignment
@assignments_bp.route("/create", methods=["POST"])
@login_required
@role_required(UserRole.TEACHER)
def create_assignment():

    data = request.json

    title = data.get("title")
    class_id = data.get("class_id")
    due_date_str = data.get("due_date")

    if not title:
        return jsonify({"error": "title is required"}), 400

    if not class_id:
        return jsonify({"error": "class_id is required"}), 400

    class_obj = db.session.get(Class, class_id)
    if not class_obj:
        return jsonify({"error": "class not found"}), 404

    if class_obj.teacher_id != current_user.id:
        return jsonify({"error": "Forbidden"}), 403

    due_date = None

    if due_date_str:
        try:
            due_date = datetime.strptime(due_date_str, "%Y-%m-%dT%H:%M")
        except ValueError:
            return jsonify({"error": "date must be YYYY-MM-DDTHH:MM"}), 400

    assignment = Assignment(
        title=title,
        class_id=class_id,
        due_date=due_date,
    )

    db.session.add(assignment)
    db.session.commit()

    return jsonify({"message": "Assignment created"})


# Get assignment by id
@assignments_bp.route("/one", methods=["GET"])
@login_required
def get_assignment_by_id():

    assignment_id = request.args.get("id")

    if not assignment_id:
        return jsonify({"error": "id required"}), 400

    assignment = Assignment.query.get(assignment_id)

    if not assignment:
        return jsonify({"error": "assignment not found"}), 404

    class_obj = assignment.class_obj
    is_teacher = class_obj.teacher_id == current_user.id
    is_student = (
        ClassMember.query.filter_by(
            class_id=class_obj.id, student_id=current_user.id
        ).first()
        is not None
    )

    if not is_teacher and not is_student:
        return jsonify({"error": "Forbidden"}), 403

    return jsonify(
        {
            "id": assignment.id,
            "title": assignment.title,
            "due_date": assignment.due_date,
            "class_id": assignment.class_id,
        }
    )


# Get submission for each student
@assignments_bp.route("/<int:assignment_id>/attempts", methods=["GET"])
@login_required
@role_required(UserRole.TEACHER)
def get_assignment_attempts(assignment_id):
    assignment = Assignment.query.get(assignment_id)

    if not assignment:
        return jsonify({"error": "assignment not found"}), 404

    if assignment.class_obj.teacher_id != current_user.id:
        return jsonify({"error": "Forbidden"}), 403

    max_score = (
        db.session.query(db.func.coalesce(db.func.sum(Question.points), 0))
        .filter_by(assignment_id=assignment_id)
        .scalar()
    )
    max_score = float(max_score or 0)

    members = (
        ClassMember.query.filter_by(class_id=assignment.class_id)
        .join(User, ClassMember.student_id == User.id)
        .order_by(db.func.lower(User.full_name))
        .all()
    )

    result = []

    for member in members:
        student = member.student
        attempt = (
            Attempt.query.filter_by(
                assignment_id=assignment_id,
                class_member_id=member.id,
            )
            .order_by(Attempt.id.desc())
            .first()
        )

        status = (
            serialize_attempt_status(attempt.status)
            if attempt
            else AttemptStatus.NOT_STARTED.value
        )
        total_score = (
            attempt.total_score
            if attempt and status == AttemptStatus.SUBMITTED.value
            else None
        )
        if total_score is not None:
            total_score = float(total_score)

        attemptId = None

        if attempt and status == AttemptStatus.SUBMITTED.value:
            attemptId = attempt.id

        result.append(
            {
                "attempt_id": attemptId,
                "student_id": student.id,
                "student_name": student.full_name,
                "score": total_score,
                "max_score": max_score,
                "status": status,
            }
        )

    return jsonify(result), 200
