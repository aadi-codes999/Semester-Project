"""Authentication endpoints."""

from flask import Blueprint, jsonify, request


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/auth/login", methods=["POST"])
def login():
    payload = request.get_json(silent=True) or {}
    email = payload.get("email")
    password = payload.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required."}), 400

    return jsonify({
        "message": "Login successful",
        "user": {
            "email": email,
            "role": "administrator",
        },
        "token": "demo-token",
    })
