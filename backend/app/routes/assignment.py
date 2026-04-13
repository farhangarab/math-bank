from flask import Blueprint, request, jsonify
from app.models.assignment import Assignment
from app.models.attempt import Attempt
from datetime import datetime
from app import db


assignments_bp = Blueprint("assignments", __name__)


# Get all assignment
@assignments_bp.route("/", methods=["GET"])
def get_assignments():
    class_id = request.args.get("class_id")

    if not class_id:
        return jsonify({"error": "class id required"}), 400

    assignments = Assignment.query.filter_by(class_id=class_id).all()

    result = []

    for a in assignments:
        result.append(
            {
                "id": a.id,
                "title": a.title,
                "class_id": a.class_id,
                "due_date": a.due_date,
            }
        )

    return jsonify(result)


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
    attempts = Attempt.query.filter_by(assignment_id=assignment_id).all()

    result = []

    for attempt in attempts:
        student = attempt.class_member.student

        result.append(
            {
                "attempt_id": attempt.id,
                "student_name": student.full_name,
                "score": attempt.total_score,
                "status": attempt.status,
            }
        )

    return jsonify(result), 200
