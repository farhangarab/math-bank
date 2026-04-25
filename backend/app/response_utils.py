from flask import jsonify


def success_response(message, data=None, status=200):
    payload = {
        "success": True,
        "message": message,
    }

    if data is not None:
        payload["data"] = data

    return jsonify(payload), status


def error_response(message, status=400, errors=None):
    payload = {
        "success": False,
        "message": message,
        "errors": errors or {"general": message},
    }

    return jsonify(payload), status


def field_error(field, message, status=400):
    return error_response(message, status, {field: message})
