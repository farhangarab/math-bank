from flask import Blueprint, request, jsonify
from app import db
from app.models.attempt import Attempt
from app.models.class_member import ClassMember
from app.models.question import Question
from app.models.attempt_answer import AttemptAnswer
from sympy import sympify, simplify


attempt_bp = Blueprint("attempts", __name__)


# start the assignment
@attempt_bp.route("/start", methods=["POST"])
def start_attempt():
    data = request.get_json()

    assignment_id = data.get("assignment_id")
    student_id = data.get("student_id")  # TEMP (later from auth)

    if not assignment_id or not student_id:
        return jsonify({"error": "Missing data"}), 400

    # 1. find class_member
    class_member = ClassMember.query.filter_by(student_id=student_id).first()
    if not class_member:
        return jsonify({"error": "User not in class"}), 404

    # 2. check if already has active attempt
    existing_attempt = Attempt.query.filter_by(
        assignment_id=assignment_id,
        class_member_id=class_member.id,
        status="IN_PROGRESS",
    ).first()

    if existing_attempt:
        return (
            jsonify(
                {"message": "Existing attempt found", "attempt_id": existing_attempt.id}
            ),
            200,
        )

    # 3. create attempt
    attempt = Attempt(
        assignment_id=assignment_id,
        class_member_id=class_member.id,
        status="IN_PROGRESS",
    )

    db.session.add(attempt)
    db.session.commit()

    return jsonify({"message": "Attempt started", "attempt_id": attempt.id}), 201


#  submit the assignment
@attempt_bp.route("/submit", methods=["POST"])
def submit_attempt():
    data = request.get_json()

    attempt_id = data.get("attempt_id")
    answers = data.get("answers")

    if not attempt_id or not answers:
        return jsonify({"error": "Missing data"}), 400

    attempt = Attempt.query.get(attempt_id)

    if not attempt:
        return jsonify({"error": "Attempt not found"}), 404

    total_score = 0
    max_score = 0
    results = []

    for ans in answers:
        question_id = ans.get("question_id")
        student_answer = ans.get("answer_text")

        question = Question.query.get(question_id)

        if not question:
            continue

        correct_answer = question.correct_answer
        points = question.points

        is_correct = False
        score = 0

        try:
            student_expr = sympify(student_answer)
            correct_expr = sympify(correct_answer)

            if simplify(student_expr - correct_expr) == 0:
                is_correct = True
                score = points

        except Exception:
            is_correct = False

        # Save AttemptAnswer
        attempt_answer = AttemptAnswer(
            attempt_id=attempt_id,
            question_id=question_id,
            answer_text=student_answer,
            score=score,
            is_correct=is_correct,
        )

        db.session.add(attempt_answer)

        total_score += score
        max_score += points

        results.append(
            {"question_id": question_id, "is_correct": is_correct, "score": score}
        )

    # Update attempt
    attempt.status = "SUBMITTED"
    attempt.total_score = total_score

    db.session.commit()

    return (
        jsonify(
            {"total_score": total_score, "max_score": max_score, "results": results}
        ),
        200,
    )


# Get questions in assignment based with attempt id
@attempt_bp.route("/<int:attempt_id>", methods=["GET"])
def get_attempt(attempt_id):
    attempt = Attempt.query.get(attempt_id)

    if not attempt:
        return jsonify({"error": "Attempt not found"}), 404

    questions = (
        Question.query.filter_by(assignment_id=attempt.assignment_id)
        .order_by(Question.order_index)
        .all()
    )

    return (
        jsonify(
            {
                "attempt_id": attempt.id,
                "assignment_id": attempt.assignment_id,
                "questions": [
                    {"id": q.id, "question_text": q.question_text, "points": q.points}
                    for q in questions
                ],
            }
        ),
        200,
    )
