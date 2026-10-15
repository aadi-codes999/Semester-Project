"""Report endpoints."""

from flask import Blueprint, jsonify
from sqlalchemy import select

from app.database.db import get_session
from app.models.report import Report


report_bp = Blueprint("reports", __name__)


@report_bp.route("/reports", methods=["GET"])
def list_reports():
    with get_session() as session:
        query = select(Report).order_by(Report.generated_at.desc(), Report.id)
        return jsonify([report.to_dict() for report in session.scalars(query)])
