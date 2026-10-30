"""Recommendation endpoints backed by MongoDB."""

from flask import Blueprint, jsonify, request
from pymongo import ASCENDING

from app.database.mongo import clean_doc, clean_docs, get_db

recommendation_bp = Blueprint("recommendations", __name__)


@recommendation_bp.route("/recommendations", methods=["GET"])
def list_recommendations():
    db = get_db()
    filter_query = {}
    village_id = request.args.get("village_id")
    if village_id:
        filter_query["villageId"] = village_id

    cursor = db.recommendations.find(filter_query).sort("id", ASCENDING)
    return jsonify(clean_docs(cursor))


@recommendation_bp.route("/recommendations/<parcel_id>", methods=["GET"])
def parcel_recommendations(parcel_id):
    db = get_db()
    recommendation = db.recommendations.find_one({"parcelId": parcel_id})
    if recommendation is None:
        return jsonify({"message": "Recommendation not found"}), 404
    return jsonify(clean_doc(recommendation))
