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
