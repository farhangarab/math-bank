from app.models.enums import AttemptStatus


def serialize_attempt_status(status):
    return status.value if hasattr(status, "value") else status


def serialize_due_date(due_date):
    if not due_date:
        return None

    return due_date.strftime("%Y-%m-%dT%H:%M")


def serialize_datetime(date_time):
    if not date_time:
        return None

    return date_time.strftime("%Y-%m-%dT%H:%M")


def serialize_question(question, include_answer=True):
    question_data = {
        "id": question.id,
        "question_text": question.question_text,
        "points": question.points,
        "order_index": question.order_index,
        "assignment_id": question.assignment_id,
        "grading_type": question.grading_type.value,
        "require_simplified": question.require_simplified,
    }

    if include_answer:
        question_data["correct_answer"] = question.correct_answer

    return question_data


def serialize_attempt_question(question, can_reveal_answers):
    return serialize_question(question, include_answer=can_reveal_answers)


def can_reveal_attempt_answers(attempt):
    return serialize_attempt_status(attempt.status) == AttemptStatus.SUBMITTED.value
