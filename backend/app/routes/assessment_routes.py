"""Land assessment endpoints."""

from flask import Blueprint, jsonify, request
from sqlalchemy import select

from app.database.db import get_session
from app.models.assessment import Assessment
from app.models.land_parcel import LandParcel


assessment_bp = Blueprint("assessments", __name__)


@assessment_bp.route("/assessments", methods=["GET"])
def list_assessments():
    village_id = request.args.get("village_id")
    with get_session() as session:
        query = (
            select(Assessment, LandParcel.village_id)
            .join(LandParcel, LandParcel.id == Assessment.parcel_id)
            .order_by(Assessment.parcel_id)
        )
        if village_id:
            query = query.where(LandParcel.village_id == village_id)
        results = session.execute(query)
        return jsonify([assessment.to_dict(village_id) for assessment, village_id in results])


@assessment_bp.route("/assessments/<parcel_id>", methods=["GET"])
def parcel_assessment(parcel_id):
    with get_session() as session:
        result = session.execute(
            select(Assessment, LandParcel.village_id)
            .join(LandParcel, LandParcel.id == Assessment.parcel_id)
            .where(Assessment.parcel_id == parcel_id)
        ).first()
        if result is None:
            return jsonify({"message": "Assessment not found"}), 404
        assessment, village_id = result
        return jsonify(assessment.to_dict(village_id))
