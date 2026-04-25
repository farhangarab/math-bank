from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app import db
from app.models.attempt import Attempt
from app.models.class_member import ClassMember
from app.models.question import Question
from app.models.attempt_answer import AttemptAnswer
from app.models.assignment import Assignment
from app.models.enums import AttemptStatus, GradingType, UserRole
from sympy import simplify
from app.utils.math_parser import normalize_math_text, parse_math_expression
from app.auth_utils import role_required
from app.response_utils import error_response, field_error, success_response


attempt_bp = Blueprint("attempts", __name__)
NUMERIC_TOLERANCE = 1e-9


def serialize_attempt_status(status):
    return status.value if hasattr(status, "value") else status


def _normalize_exact_answer(answer_text):
    return normalize_math_text(answer_text)


def _are_symbolically_equivalent(student_expr, correct_expr):
    try:
        return simplify(student_expr - correct_expr) == 0
    except Exception:
        return student_expr.equals(correct_expr) is True


def _is_simplified_expression(answer_text):
    parsed_expr = parse_math_expression(answer_text, evaluate=False)
    simplified_expr = simplify(parsed_expr)
    return str(parsed_expr) == str(simplified_expr)


def _is_numeric_match(student_expr, correct_expr):
    if student_expr.free_symbols or correct_expr.free_symbols:
        return False

    student_value = student_expr.evalf()
    correct_value = correct_expr.evalf()

    return abs(float(student_value - correct_value)) <= NUMERIC_TOLERANCE


def _grade_answer(student_answer, question):
    grading_type = question.grading_type
    if not isinstance(grading_type, GradingType):
        grading_type = GradingType(grading_type)

    if not _normalize_exact_answer(student_answer):
        return False

    if grading_type == GradingType.EXACT:
        return _normalize_exact_answer(student_answer) == _normalize_exact_answer(
            question.correct_answer
        )

    student_expr = parse_math_expression(student_answer)
    correct_expr = parse_math_expression(question.correct_answer)

    if grading_type == GradingType.NUMERIC:
        return _is_numeric_match(student_expr, correct_expr)

    if not _are_symbolically_equivalent(student_expr, correct_expr):
        return False

    if question.require_simplified:
        return _is_simplified_expression(student_answer)

    return True


# start the assignment
@attempt_bp.route("/start", methods=["POST"])
@login_required
@role_required(UserRole.STUDENT)
def start_attempt():
    data = request.get_json() or {}

    assignment_id = data.get("assignment_id")

    if not assignment_id:
        return field_error("assignment_id", "Assignment ID is required.")

    assignment = Assignment.query.get(assignment_id)
    if not assignment:
        return error_response("Assignment was not found.", 404)

    class_member = ClassMember.query.filter_by(
        student_id=current_user.id, class_id=assignment.class_id
    ).first()

    if not class_member:
        return error_response("You are not in this class.", 404)

    existing_attempt = (
        Attempt.query.filter_by(
            assignment_id=assignment_id,
            class_member_id=class_member.id,
        )
        .order_by(Attempt.id.desc())
        .first()
    )

    if existing_attempt:
        return success_response(
            "Existing attempt found.",
            {
                "attempt_id": existing_attempt.id,
                "status": serialize_attempt_status(existing_attempt.status),
            },
        )

    attempt = Attempt(
        assignment_id=assignment_id,
        class_member_id=class_member.id,
        status=AttemptStatus.IN_PROGRESS.value,
    )

    db.session.add(attempt)
    db.session.commit()

    return success_response(
        "Attempt started.",
        {
            "attempt_id": attempt.id,
            "status": serialize_attempt_status(attempt.status),
        },
        201,
    )


#  submit the assignment
@attempt_bp.route("/submit", methods=["POST"])
@login_required
@role_required(UserRole.STUDENT)
def submit_attempt():
    data = request.get_json() or {}

    attempt_id = data.get("attempt_id")
    answers = data.get("answers")

    if not attempt_id or answers is None:
        return error_response(
            "Attempt ID and answers are required.",
            400,
            {
                "attempt_id": "Attempt ID is required.",
                "answers": "Answers are required.",
            },
        )

    attempt = Attempt.query.get(attempt_id)

    if not attempt:
        return error_response("Attempt was not found.", 404)

    if attempt.class_member.student_id != current_user.id:
        return error_response("You do not have permission to submit this attempt.", 403)

    # already submitted
    if attempt.status == AttemptStatus.SUBMITTED.value:
        return error_response("Assignment is already submitted.")

    total_score = 0
    max_score = 0
    results = []

    for ans in answers:
        question_id = ans.get("question_id")
        student_answer = (ans.get("answer_text") or "").strip()

        question = Question.query.get(question_id)
        if not question:
            continue

        points = question.points

        is_correct = False
        score = 0

        try:
            if _grade_answer(student_answer, question):
                is_correct = True
                score = points

        except Exception:
            is_correct = False
            score = 0

        # update existing save progress row or create new row
        existing_answer = AttemptAnswer.query.filter_by(
            attempt_id=attempt_id, question_id=question_id
        ).first()

        if existing_answer:
            existing_answer.answer_text = student_answer
            existing_answer.score = score
            existing_answer.is_correct = is_correct
            existing_answer.saved_at = db.func.now()
        else:
            new_answer = AttemptAnswer(
                attempt_id=attempt_id,
                question_id=question_id,
                answer_text=student_answer,
                score=score,
                is_correct=is_correct,
            )
            db.session.add(new_answer)

        total_score += score
        max_score += points

        results.append(
            {"question_id": question_id, "is_correct": is_correct, "score": score}
        )

    attempt.status = AttemptStatus.SUBMITTED.value
    attempt.total_score = total_score
    attempt.submitted_At = db.func.now()

    db.session.commit()

    return success_response(
        "Assignment submitted successfully.",
        {
            "attempt_id": attempt.id,
            "status": serialize_attempt_status(attempt.status),
            "total_score": total_score,
            "max_score": max_score,
            "results": results,
        },
    )


# Get questions in assignment based with attempt id
@attempt_bp.route("/<int:attempt_id>", methods=["GET"])
@login_required
def get_attempt(attempt_id):

    attempt = Attempt.query.get(attempt_id)

    if attempt is None:
        return error_response("Attempt was not found.", 404)

    class_obj = attempt.assignment.class_obj
    is_owner = attempt.class_member.student_id == current_user.id
    is_teacher = class_obj.teacher_id == current_user.id

    if not is_owner and not is_teacher:
        return error_response("You do not have permission to view this attempt.", 403)

    questions = (
        Question.query.filter_by(assignment_id=attempt.assignment_id)
        .order_by(Question.order_index)
        .all()
    )

    question_list = []
    can_reveal_answers = (
        serialize_attempt_status(attempt.status) == AttemptStatus.SUBMITTED.value
    )

    for question in questions:
        question_data = {
            "id": question.id,
            "question_text": question.question_text,
            "points": question.points,
            "grading_type": question.grading_type.value,
            "require_simplified": question.require_simplified,
        }

        if can_reveal_answers:
            question_data["correct_answer"] = question.correct_answer

        question_list.append(question_data)

    # We need this for saving the progress
    answer_list = []

    for answer in attempt.answers:
        answer_data = {
            "question_id": answer.question_id,
            "answer_text": answer.answer_text,
            "score": answer.score,
            "is_correct": answer.is_correct,
        }

        answer_list.append(answer_data)

    response_data = {
        "attempt_id": attempt.id,
        "assignment_id": attempt.assignment_id,
        "status": serialize_attempt_status(attempt.status),
        "total_score": attempt.total_score,
        "submitted_at": attempt.submitted_At,
        "questions": question_list,
        "answers": answer_list,
    }

    return jsonify(response_data), 200


# save the progress
@attempt_bp.route("/save", methods=["POST"])
@login_required
@role_required(UserRole.STUDENT)
def save_attempt():
    data = request.get_json() or {}

    attempt_id = data.get("attempt_id")
    attempt = Attempt.query.get(attempt_id)

    if not attempt:
        return error_response("Attempt was not found.", 404)

    if attempt.class_member.student_id != current_user.id:
        return error_response("You do not have permission to save this attempt.", 403)

    if attempt.status == AttemptStatus.SUBMITTED.value:
        return error_response("Assignment is already submitted.")

    answers = data.get("answers")

    if not answers:
        return field_error("answers", "At least one answer is required.")

    for ans in answers:
        question_id = ans.get("question_id")
        answer_text = ans.get("answer_text")

        existing = AttemptAnswer.query.filter_by(
            attempt_id=attempt_id, question_id=question_id
        ).first()

        if existing:
            existing.answer_text = answer_text
        else:
            new_answer = AttemptAnswer(
                attempt_id=attempt_id, question_id=question_id, answer_text=answer_text
            )
            db.session.add(new_answer)

    db.session.commit()

    return success_response("Progress saved.")
