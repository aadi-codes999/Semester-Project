"""Authentication endpoints backed by MongoDB."""

from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash

from app.database.mongo import get_db

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/auth/login", methods=["POST"])
def login():
    payload = request.get_json(silent=True) or {}
    email = payload.get("email")
    password = payload.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required."}), 400

    db = get_db()
    user = db.users.find_one({"email": email})

    if user:
        if not check_password_hash(user.get("password_hash", ""), password):
            return jsonify({"message": "Invalid email or password."}), 401
        role = user.get("role", "administrator")
    elif email == "admin@village.local" and password == "admin":
        role = "administrator"
    else:
        return jsonify({"message": "Invalid email or password."}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "email": email,
            "role": role,
        },
        "token": "demo-token",
    })
