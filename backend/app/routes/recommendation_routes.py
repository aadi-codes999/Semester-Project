"""Recommendation endpoints."""

from flask import Blueprint, jsonify, request
from sqlalchemy import select

from app.database.db import get_session
from app.models.land_parcel import LandParcel
from app.models.recommendation import Recommendation


recommendation_bp = Blueprint("recommendations", __name__)


@recommendation_bp.route("/recommendations", methods=["GET"])
def list_recommendations():
    village_id = request.args.get("village_id")
    with get_session() as session:
        query = select(Recommendation).order_by(Recommendation.id)
        if village_id:
            query = query.join(LandParcel, LandParcel.id == Recommendation.parcel_id).where(
                LandParcel.village_id == village_id
            )
        return jsonify([item.to_dict() for item in session.scalars(query)])


@recommendation_bp.route("/recommendations/<parcel_id>", methods=["GET"])
def parcel_recommendations(parcel_id):
    with get_session() as session:
        query = select(Recommendation).where(Recommendation.parcel_id == parcel_id)
        recommendation = session.scalars(query).first()
        if recommendation is None:
            return jsonify({"message": "Recommendation not found"}), 404
        return jsonify(recommendation.to_dict())
