"""Dashboard endpoints."""

from flask import Blueprint, jsonify, request
from app.database.db import get_session
from app.models.assessment import Assessment
from app.models.land_parcel import LandParcel


dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@dashboard_bp.route("/dashboard/stats", methods=["GET"])
def dashboard_stats():
    village_id = request.args.get("village_id")
    with get_session() as session:
        query = session.query(LandParcel)
        if village_id:
            query = query.filter(LandParcel.village_id == village_id)
        parcels = query.all()
        assessments = session.query(Assessment).join(
            LandParcel, LandParcel.id == Assessment.parcel_id
        )
        if village_id:
            assessments = assessments.filter(LandParcel.village_id == village_id)
        assessed = assessments.filter(Assessment.verification == "Verified").count()
        total = len(parcels)
        potentially_unused = sum(parcel.status == "suitable" for parcel in parcels)
        flagged = sum(parcel.status in {"assessment", "constraints"} for parcel in parcels)
        return jsonify({
            "totalParcels": total,
            "potentiallyUnused": potentially_unused,
            "flaggedForAssessment": flagged,
            "assessedParcels": assessed,
        })
