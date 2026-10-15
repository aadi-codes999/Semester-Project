"""Village endpoints."""

from flask import Blueprint, jsonify, request
from sqlalchemy import select

from app.database.db import get_session
from app.models.village import Village


village_bp = Blueprint("villages", __name__)


@village_bp.route("/villages", methods=["GET"])
def list_villages():
    with get_session() as session:
        query = select(Village).order_by(Village.name)
        if request.args.get("village_id"):
            query = query.where(Village.id == request.args["village_id"])
        return jsonify([village.to_dict() for village in session.scalars(query)])
