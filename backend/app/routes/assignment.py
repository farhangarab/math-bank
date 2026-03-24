from flask import Blueprint, request, jsonify
from app.models.assignment import Assignment
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

    if not title or not class_id:
        return jsonify({"error": "title and class_id required"}), 400

    due_date = None

    if due_date_str:
        try:
            due_date = datetime.strptime(due_date_str, "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "date must be YYYY-MM-DD"}), 400

    assignment = Assignment(
        title=title,
        class_id=class_id,
        due_date=due_date,
    )

    db.session.add(assignment)
    db.session.commit()

    return jsonify({"message": "Assignment created"})
