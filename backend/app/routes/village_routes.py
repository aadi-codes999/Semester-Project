"""Village endpoints backed by MongoDB."""

from flask import Blueprint, jsonify, request
from pymongo import ASCENDING

from app.database.mongo import clean_docs, get_db

village_bp = Blueprint("villages", __name__)


@village_bp.route("/villages", methods=["GET"])
def list_villages():
    db = get_db()
    filter_query = {}
    village_id = request.args.get("village_id")
    if village_id:
        filter_query["id"] = village_id

    cursor = db.villages.find(filter_query).sort("name", ASCENDING)
    return jsonify(clean_docs(cursor))
