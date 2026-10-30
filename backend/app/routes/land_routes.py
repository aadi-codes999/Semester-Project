"""Land parcel endpoints backed by MongoDB."""

from flask import Blueprint, jsonify, request
from pymongo import ASCENDING

from app.database.mongo import clean_doc, clean_docs, get_db

land_bp = Blueprint("land", __name__)


@land_bp.route("/land/parcels", methods=["GET"])
def list_parcels():
    db = get_db()
    filter_query = {}
    village_id = request.args.get("village_id")
    status = request.args.get("status")

    if village_id:
        filter_query["villageId"] = village_id
    if status:
        filter_query["status"] = status

    cursor = db.land_parcels.find(filter_query).sort("id", ASCENDING)
    return jsonify(clean_docs(cursor))


@land_bp.route("/land/parcels/<parcel_id>", methods=["GET"])
def parcel_detail(parcel_id):
    db = get_db()
    parcel = db.land_parcels.find_one({"id": parcel_id})
    if parcel is None:
        return jsonify({"message": "Parcel not found"}), 404
    return jsonify(clean_doc(parcel))
