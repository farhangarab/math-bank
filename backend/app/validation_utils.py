def first_required_error(data, fields):
    for field, message in fields:
        value = data.get(field)

        if value is None:
            return field, message

        if isinstance(value, str) and not value.strip():
            return field, message

    return None, None
