from flask import Blueprint, request, jsonify
from app.models.assignment import Assignment
from app.models.attempt import Attempt
from app.models.class_member import ClassMember
from app.models.enums import AttemptStatus
from app.models.question import Question
from app.models.user import User
from datetime import datetime
from app import db


assignments_bp = Blueprint("assignments", __name__)


def serialize_attempt_status(status):
    return status.value if hasattr(status, "value") else status


# Get all assignment
@assignments_bp.route("/", methods=["GET"])
def get_assignments():
    class_id = request.args.get("class_id")
    student_id = request.args.get("student_id")

    if not class_id:
        return jsonify({"error": "class id required"}), 400

    assignments = Assignment.query.filter_by(class_id=class_id).all()

    result = []

    class_member = None
    if student_id:
        class_member = ClassMember.query.filter_by(
            student_id=student_id, class_id=class_id
        ).first()

    for a in assignments:
        item = {
            "id": a.id,
            "title": a.title,
            "class_id": a.class_id,
            "due_date": a.due_date,
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
def create_assignment():

    data = request.json

    title = data.get("title")
    class_id = data.get("class_id")
    due_date_str = data.get("due_date")

    if not title:
        return jsonify({"error": "title is required"}), 400

    if not class_id:
        return jsonify({"error": "class_id is required"}), 400

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
def get_assignment_by_id():

    assignment_id = request.args.get("id")

    if not assignment_id:
        return jsonify({"error": "id required"}), 400

    assignment = Assignment.query.get(assignment_id)

    if not assignment:
        return jsonify({"error": "assignment not found"}), 404

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
def get_assignment_attempts(assignment_id):
    assignment = Assignment.query.get(assignment_id)

    if not assignment:
        return jsonify({"error": "assignment not found"}), 404

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

        if attempt:
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
