import random
import string


def generate_class_code():
    letters = string.ascii_uppercase
    numbers = string.digits

    all_chars = letters + numbers

    code = ""

    for i in range(6):
        code += random.choice(all_chars)

    return code


def generate_unique_class_code(max_attempts=20):
    from app.models.class_model import Class

    for attempt in range(max_attempts):
        code = generate_class_code()
        existing_class = Class.query.filter_by(class_code=code).first()

        if existing_class is None:
            return code

    raise ValueError("Could not generate a unique class code. Please try again.")
