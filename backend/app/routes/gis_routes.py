"""GIS and geospatial layer endpoints for Baloda Bazar district."""

from flask import Blueprint, jsonify, request
from pymongo import ASCENDING

from app.database.mongo import clean_docs, get_db, initialize_database
from app.services.data_import_service import get_dataset_status_catalog, import_custom_geojson
from app.services.gis_service import (
    build_parcels_geojson,
    build_villages_geojson,
    get_available_gis_layers,
)

gis_bp = Blueprint("gis", __name__)


@gis_bp.route("/gis/dataset-status", methods=["GET"])
def dataset_status():
    """Return catalog of all 7 real geospatial datasets, connection status, and import guides."""
    catalog = get_dataset_status_catalog()
    return jsonify({
        "district": "Baloda Bazar-Bhatapara (District Code 674, Chhattisgarh, India)",
        "datasets": catalog,
        "total_sources": len(catalog),
    })


@gis_bp.route("/gis/layers", methods=["GET"])
def gis_layers():
    """Return available raster tile layers and vector endpoints for interactive map."""
    return jsonify(get_available_gis_layers())


@gis_bp.route("/gis/parcels/geojson", methods=["GET"])
def parcels_geojson():
    """Return all assessed land parcels formatted as a standard GeoJSON FeatureCollection."""
    db = get_db()
    village_id = request.args.get("village_id")
    filter_query = {"villageId": village_id} if village_id else {}
    parcels = clean_docs(db.land_parcels.find(filter_query).sort("id", ASCENDING))
    geojson_data = build_parcels_geojson(parcels)
    return jsonify(geojson_data)


@gis_bp.route("/gis/villages/geojson", methods=["GET"])
def villages_geojson():
    """Return Survey of India village boundaries as GeoJSON FeatureCollection."""
    db = get_db()
    villages = clean_docs(db.villages.find({}).sort("name", ASCENDING))
    geojson_data = build_villages_geojson(villages)
    return jsonify(geojson_data)


@gis_bp.route("/gis/import", methods=["POST"])
def import_geodata():
    """Ingest custom GeoJSON spatial datasets for Baloda Bazar."""
    payload = request.get_json(silent=True)
    if not payload:
        return jsonify({"status": "error", "message": "Valid JSON body with GeoJSON content required."}), 400

    dataset_name = request.args.get("name", "custom_geodata")
    result = import_custom_geojson(payload, dataset_name=dataset_name)
    return jsonify(result), 200 if result["status"] == "success" else 400


@gis_bp.route("/gis/reset-baloda-bazar", methods=["POST"])
def reset_baloda_bazar():
    """Re-seed the database with real Baloda Bazar GIS datasets."""
    db = get_db()
    initialize_database(force=True)
    return jsonify({
        "status": "success",
        "message": "Baloda Bazar district dataset re-indexed and synchronized with MongoDB.",
        "villages_count": db.villages.count_documents({}),
        "parcels_count": db.land_parcels.count_documents({}),
    })
