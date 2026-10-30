"""Dashboard and system health endpoints backed by MongoDB."""

from flask import Blueprint, jsonify, request

from app.database.mongo import get_db, ping_db

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/health", methods=["GET"])
def health():
    db = get_db()
    is_alive, msg = ping_db(db)
    return jsonify({
        "status": "ok" if is_alive else "degraded",
        "database": "mongodb",
        "district": "Baloda Bazar-Bhatapara, Chhattisgarh",
        "connected": is_alive,
        "detail": msg,
    }), 200 if is_alive else 503


@dashboard_bp.route("/dashboard/stats", methods=["GET"])
def dashboard_stats():
    village_id = request.args.get("village_id")
    filter_query = {"villageId": village_id} if village_id else {}
    db = get_db()

    parcels = list(db.land_parcels.find(filter_query))
    total = len(parcels)
    total_area = round(sum(p.get("area", 0) for p in parcels), 1)

    potentially_unused_parcels = [p for p in parcels if p.get("status") == "suitable"]
    potentially_unused = len(potentially_unused_parcels)
    potentially_unused_area = round(sum(p.get("area", 0) for p in potentially_unused_parcels), 1)

    flagged_parcels = [p for p in parcels if p.get("status") in {"assessment", "constraints"}]
    flagged = len(flagged_parcels)

    legally_verified_parcels = [p for p in parcels if p.get("isLegallyVerified") is True]
    legally_verified_count = len(legally_verified_parcels)
    legally_verified_area = round(sum(p.get("area", 0) for p in legally_verified_parcels), 1)

    assessed_query = dict(filter_query)
    assessed_query["verification"] = "Verified"
    assessed = db.assessments.count_documents(assessed_query)

    solar_count = sum(1 for p in parcels if p.get("suggestedUse") == "Solar Energy")
    agri_count = sum(1 for p in parcels if p.get("suggestedUse") == "Agriculture")
    agro_count = sum(1 for p in parcels if p.get("suggestedUse") == "Agroforestry")

    return jsonify({
        "totalParcels": total,
        "totalAreaAcres": total_area,
        "potentiallyUnused": potentially_unused,
        "potentiallyUnusedArea": potentially_unused_area,
        "flaggedForAssessment": flagged,
        "assessedParcels": assessed,
        "legallyVerifiedCount": legally_verified_count,
        "legallyVerifiedArea": legally_verified_area,
        "solarSuitableCount": solar_count,
        "agricultureSuitableCount": agri_count,
        "agroforestrySuitableCount": agro_count,
        "district": "Baloda Bazar-Bhatapara, Chhattisgarh",
    })
