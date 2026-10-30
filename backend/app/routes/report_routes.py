"""Report endpoints backed by MongoDB."""

from flask import Blueprint, jsonify
from pymongo import DESCENDING

from app.database.mongo import clean_docs, get_db

report_bp = Blueprint("reports", __name__)


@report_bp.route("/reports", methods=["GET"])
def list_reports():
    db = get_db()
    cursor = db.reports.find({}).sort("generatedAt", DESCENDING)
    return jsonify(clean_docs(cursor))
