from sympy import simplify

from app.models.enums import GradingType
from app.utils.math_parser import normalize_math_text, parse_math_expression


NUMERIC_TOLERANCE = 1e-9


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


def grade_answer(student_answer, question):
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


def validate_numeric_answer(correct_answer):
    parsed_answer = parse_math_expression(correct_answer)
    return not parsed_answer.free_symbols
