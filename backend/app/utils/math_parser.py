import re

from sympy import Abs, E, Float, Integer, Rational, Symbol, cos, exp, log, pi, sin, sqrt, tan
from sympy.parsing.sympy_parser import (
    convert_xor,
    implicit_multiplication_application,
    parse_expr,
    standard_transformations,
)


MAX_MATH_INPUT_LENGTH = 200
SAFE_MATH_PATTERN = re.compile(r"^[A-Za-z0-9+\-*/^().,\s]+$")
SAFE_IDENTIFIER_PATTERN = re.compile(r"[A-Za-z]+")
ALLOWED_FUNCTIONS = {
    "Abs",
    "abs",
    "cos",
    "exp",
    "ln",
    "log",
    "sin",
    "sqrt",
    "tan",
}
ALLOWED_CONSTANTS = {"E", "e", "pi"}
SAFE_GLOBALS = {
    "__builtins__": {},
    "Abs": Abs,
    "Float": Float,
    "Integer": Integer,
    "Rational": Rational,
    "Symbol": Symbol,
}
SAFE_LOCALS = {
    "Abs": Abs,
    "abs": Abs,
    "cos": cos,
    "E": E,
    "e": E,
    "exp": exp,
    "ln": log,
    "log": log,
    "pi": pi,
    "sin": sin,
    "sqrt": sqrt,
    "tan": tan,
}
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

    validate_safe_math_input(cleaned_answer)

    return parse_expr(
        cleaned_answer,
        evaluate=evaluate,
        global_dict=SAFE_GLOBALS,
        local_dict=dict(SAFE_LOCALS),
        transformations=MATH_TRANSFORMATIONS,
    )


def validate_safe_math_input(cleaned_answer):
    if len(cleaned_answer) > MAX_MATH_INPUT_LENGTH:
        raise ValueError("Answer is too long")

    if not SAFE_MATH_PATTERN.fullmatch(cleaned_answer):
        raise ValueError("Answer contains unsupported characters")

    for identifier in SAFE_IDENTIFIER_PATTERN.findall(cleaned_answer):
        if len(identifier) == 1:
            continue

        if identifier in ALLOWED_FUNCTIONS or identifier in ALLOWED_CONSTANTS:
            continue

        raise ValueError("Answer contains unsupported names")
