from flask import Blueprint, request, jsonify
from app.models.question import Question, GradingType
from app import db


questions_bp = Blueprint("questions", __name__)


# Get all questions by assignment
@questions_bp.route("/", methods=["GET"])
def get_questions():
    assignment_id = request.args.get("assignment_id")

    if not assignment_id:
        return jsonify({"error": "assignment_id required"}), 400

    questions = (
        Question.query.filter_by(assignment_id=assignment_id)
        .order_by(Question.order_index)
        .all()
    )

    result = []

    for q in questions:
        result.append(
            {
                "id": q.id,
                "question_text": q.question_text,
                "correct_answer": q.correct_answer,
                "points": q.points,
                "order_index": q.order_index,
                "assignment_id": q.assignment_id,
                "grading_type": q.grading_type.value,
                "require_simplified": q.require_simplified,
            }
        )
    return jsonify(result)


# Create Questions
@questions_bp.route("/create", methods=["POST"])
def create_question():

    data = request.json

    question_text = data.get("question_text")
    correct_answer = data.get("correct_answer")
    points = data.get("points")
    order_index = data.get("order_index")
    assignment_id = data.get("assignment_id")
    grading_type = data.get("grading_type")
    require_simplified = data.get("require_simplified")

    if not question_text:
        return jsonify({"error": "question_text required"}), 400

    if not correct_answer:
        return jsonify({"error": "correct_answer required"}), 400

    if assignment_id is None:
        return jsonify({"error": "assignment_id required"}), 400

    if order_index is None:
        return jsonify({"error": "order_index required"}), 400

    try:
        grading_type_enum = GradingType(grading_type)
    except ValueError:
        return (
            jsonify({"error": "invalid grading_type (exact, symbolic, numeric)"}),
            400,
        )

    q = Question(
        question_text=question_text,
        correct_answer=correct_answer,
        points=points,
        order_index=order_index,
        assignment_id=assignment_id,
        grading_type=grading_type_enum,
        require_simplified=require_simplified,
    )

    db.session.add(q)
    db.session.commit()

    return jsonify({"message": "question created"})
