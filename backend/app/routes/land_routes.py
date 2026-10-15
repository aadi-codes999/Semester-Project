"""Land parcel endpoints."""

from flask import Blueprint, jsonify, request
from sqlalchemy import select

from app.database.db import get_session
from app.models.land_parcel import LandParcel


land_bp = Blueprint("land", __name__)


@land_bp.route("/land/parcels", methods=["GET"])
def list_parcels():
    village_id = request.args.get("village_id")
    status = request.args.get("status")
    with get_session() as session:
        query = select(LandParcel).order_by(LandParcel.id)
        if village_id:
            query = query.where(LandParcel.village_id == village_id)
        if status:
            query = query.where(LandParcel.status == status)
        return jsonify([parcel.to_dict() for parcel in session.scalars(query)])


@land_bp.route("/land/parcels/<parcel_id>", methods=["GET"])
def parcel_detail(parcel_id):
    with get_session() as session:
        parcel = session.get(LandParcel, parcel_id)
        if parcel is None:
            return jsonify({"message": "Parcel not found"}), 404
        return jsonify(parcel.to_dict())
