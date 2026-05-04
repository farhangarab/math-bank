from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from sqlalchemy.exc import IntegrityError
from app.models.question import Question, GradingType
from app.models.assignment import Assignment
from app import db
from app.models.enums import UserRole
from app.auth_utils import role_required
from app.response_utils import error_response, field_error, success_response
from app.services.grading import validate_numeric_answer
from app.services.serializers import serialize_question


questions_bp = Blueprint("questions", __name__)


# Get all questions by assignment
@questions_bp.route("/", methods=["GET"])
@login_required
@role_required(UserRole.TEACHER)
def get_questions():
    assignment_id = request.args.get("assignment_id")

    if not assignment_id:
        return field_error("assignment_id", "Assignment ID is required.")

    assignment = db.session.get(Assignment, assignment_id)
    if not assignment:
        return error_response("Assignment was not found.", 404)

    if assignment.class_obj.teacher_id != current_user.id:
        return error_response("You do not have permission to view these questions.", 403)

    questions = (
        Question.query.filter_by(assignment_id=assignment_id)
        .order_by(Question.order_index)
        .all()
    )

    return jsonify([serialize_question(q) for q in questions])


# Create Questions
@questions_bp.route("/create", methods=["POST"])
@login_required
@role_required(UserRole.TEACHER)
def create_question():

    data = request.get_json() or {}

    question_text = data.get("question_text")
    correct_answer = data.get("correct_answer")
    points = data.get("points")
    order_index = data.get("order_index")
    assignment_id = data.get("assignment_id")
    grading_type = data.get("grading_type")
    require_simplified = data.get("require_simplified")

    if not question_text or not question_text.strip():
        return field_error("question_text", "Question is required.")

    if not correct_answer or not correct_answer.strip():
        return field_error("correct_answer", "Correct answer is required.")

    if assignment_id is None:
        return field_error("assignment_id", "Assignment ID is required.")

    if order_index is None:
        return field_error("order_index", "Question order is required.")

    assignment = db.session.get(Assignment, assignment_id)
    if not assignment:
        return error_response("Assignment was not found.", 404)

    if assignment.class_obj.teacher_id != current_user.id:
        return error_response("You do not have permission to add questions here.", 403)

    existing_question = Question.query.filter_by(
        assignment_id=assignment_id,
        order_index=order_index,
    ).first()

    if existing_question:
        return field_error(
            "order_index",
            "A question already exists at this position in the assignment.",
        )

    try:
        grading_type_enum = GradingType(grading_type)
    except ValueError:
        return field_error(
            "grading_type",
            "Grading type must be exact, symbolic, or numeric.",
        )

    if grading_type_enum == GradingType.NUMERIC:
        try:
            is_numeric_answer = validate_numeric_answer(correct_answer)
        except Exception:
            return field_error(
                "correct_answer",
                "Numeric grading requires a valid numeric answer.",
            )

        if not is_numeric_answer:
            return field_error(
                "correct_answer",
                "Numeric grading cannot be used when the correct answer contains variables.",
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

    try:
        db.session.add(q)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return field_error(
            "order_index",
            "A question already exists at this position in the assignment.",
        )

    return success_response(
        "Question created successfully.",
        {"question": serialize_question(q)},
        201,
    )
