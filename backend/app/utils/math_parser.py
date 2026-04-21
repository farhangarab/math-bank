from sympy.parsing.sympy_parser import (
    convert_xor,
    implicit_multiplication_application,
    parse_expr,
    standard_transformations,
)


MATH_TRANSFORMATIONS = standard_transformations + (
    implicit_multiplication_application,
    convert_xor,
)


def normalize_math_text(answer_text):
    cleaned_answer = (answer_text or "")

    replacements = {
        "−": "-",
        "–": "-",
        "—": "-",
        "﹣": "-",
        "＊": "*",
        "×": "*",
        "·": "*",
        "÷": "/",
    }

    for old_value, new_value in replacements.items():
        cleaned_answer = cleaned_answer.replace(old_value, new_value)

    return "".join(cleaned_answer.split())


def parse_math_expression(answer_text, evaluate=True):
    cleaned_answer = normalize_math_text(answer_text)

    if not cleaned_answer:
        raise ValueError("Answer is empty")

    return parse_expr(
        cleaned_answer,
        evaluate=evaluate,
        transformations=MATH_TRANSFORMATIONS,
    )
