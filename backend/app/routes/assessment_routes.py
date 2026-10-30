"""Land assessment endpoints backed by MongoDB."""

from flask import Blueprint, jsonify, request
from pymongo import ASCENDING

from app.database.mongo import clean_doc, clean_docs, get_db

assessment_bp = Blueprint("assessments", __name__)


@assessment_bp.route("/assessments", methods=["GET"])
def list_assessments():
    db = get_db()
    filter_query = {}
    village_id = request.args.get("village_id")
    if village_id:
        filter_query["villageId"] = village_id

    cursor = db.assessments.find(filter_query).sort("parcelId", ASCENDING)
    return jsonify(clean_docs(cursor))


@assessment_bp.route("/assessments/<parcel_id>", methods=["GET"])
def parcel_assessment(parcel_id):
    db = get_db()
    assessment = db.assessments.find_one({"parcelId": parcel_id})
    if assessment is None:
        return jsonify({"message": "Assessment not found"}), 404
    return jsonify(clean_doc(assessment))
