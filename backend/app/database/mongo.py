"""MongoDB connection management, indexing, and seed data initialization."""

import os
from flask import current_app
from pymongo import ASCENDING, DESCENDING, MongoClient
from pymongo.errors import ConnectionFailure, PyMongoError
from werkzeug.security import generate_password_hash

from app.demo_data import (
    PARCELS,
    RECOMMENDATION_TEXT,
    REPORTS,
    VILLAGES,
)

_mongo_client = None
_db = None


def get_mongo_client(uri=None):
    """Obtain or initialize a MongoClient singleton instance."""
    global _mongo_client
    if _mongo_client is None:
        target_uri = uri or os.getenv("MONGO_URI", "mongodb://localhost:27017")
        _mongo_client = MongoClient(target_uri, serverSelectionTimeoutMS=4000)
    return _mongo_client


def get_db(app=None):
    """Retrieve the pymongo Database instance."""
    global _db

    uri = None
    db_name = None
    if app is not None:
        uri = app.config.get("MONGO_URI")
        db_name = app.config.get("MONGO_DB_NAME")
    elif current_app:
        uri = current_app.config.get("MONGO_URI")
        db_name = current_app.config.get("MONGO_DB_NAME")

    uri = uri or os.getenv("MONGO_URI", "mongodb://localhost:27017")
    db_name = db_name or os.getenv("MONGO_DB_NAME", "gis_village")

    if _db is not None and _db.name == db_name:
        return _db

    client = get_mongo_client(uri)
    _db = client[db_name]
    return _db


def close_mongo_connection():
    """Close the client connection if initialized."""
    global _mongo_client, _db
    if _mongo_client is not None:
        _mongo_client.close()
        _mongo_client = None
        _db = None


def clean_doc(doc):
    """Prepare a Mongo document for JSON serialization by omitting _id."""
    if doc is None:
        return None
    d = dict(doc)
    d.pop("_id", None)
    return d


def clean_docs(cursor):
    """Prepare a Mongo cursor / list of documents for JSON serialization."""
    return [clean_doc(doc) for doc in cursor]


def ping_db(db=None):
    """Check if the database connection is responsive."""
    try:
        database = get_db() if db is None else db
        database.client.admin.command("ping")
        return True, "Database connection active"
    except (ConnectionFailure, PyMongoError) as exc:
        return False, str(exc)


def create_indexes(db):
    """Ensure indexes exist on primary and query fields."""
    db.villages.create_index([("id", ASCENDING)], unique=True)
    db.villages.create_index([("name", ASCENDING)])

    db.land_parcels.create_index([("id", ASCENDING)], unique=True)
    db.land_parcels.create_index([("villageId", ASCENDING)])
    db.land_parcels.create_index([("status", ASCENDING)])

    db.assessments.create_index([("parcelId", ASCENDING)], unique=True)
    db.assessments.create_index([("villageId", ASCENDING)])

    db.recommendations.create_index([("id", ASCENDING)], unique=True)
    db.recommendations.create_index([("parcelId", ASCENDING)])
    db.recommendations.create_index([("villageId", ASCENDING)])

    db.reports.create_index([("id", ASCENDING)], unique=True)
    db.reports.create_index([("generatedAt", DESCENDING)])

    db.users.create_index([("email", ASCENDING)], unique=True)


def seed_database(db, force=False):
    """Populate database with real Baloda Bazar district villages, parcels, and assessments."""
    from app.services.baloda_bazar_data import generate_baloda_bazar_datasets

    villages_data, parcels_data = generate_baloda_bazar_datasets()

    if force:
        db.villages.delete_many({})
        db.land_parcels.delete_many({})
        db.assessments.delete_many({})
        db.recommendations.delete_many({})
        db.reports.delete_many({})
        db.users.delete_many({})

    # Seed villages
    if db.villages.count_documents({}) == 0:
        db.villages.insert_many([dict(v) for v in villages_data])

    # Seed land parcels
    if db.land_parcels.count_documents({}) == 0:
        db.land_parcels.insert_many([dict(p) for p in parcels_data])

    # Seed assessments
    if db.assessments.count_documents({}) == 0:
        assessments = [
            {
                "parcelId": parcel["id"],
                "villageId": parcel["villageId"],
                "villageName": parcel.get("villageName"),
                "tehsil": parcel.get("tehsil"),
                "status": parcel["status"],
                "statusLabel": parcel["statusLabel"],
                "verification": parcel["verification"],
                "legalStatus": parcel.get("legalStatus"),
                "isLegallyVerified": parcel.get("isLegallyVerified", False),
                "score": parcel["score"],
                "ndvi": parcel.get("ndvi"),
                "slopeDeg": parcel.get("slopeDeg"),
                "soilPH": parcel.get("soilPH"),
                "soilType": parcel.get("soilType"),
                "confidenceScore": parcel.get("confidenceScore"),
                "updated": parcel["updated"],
            }
            for parcel in parcels_data
        ]
        db.assessments.insert_many(assessments)

    # Seed recommendations
    if db.recommendations.count_documents({}) == 0:
        recommendations = [
            {
                "id": f"recommendation-{index + 1}",
                "parcelId": parcel["id"],
                "villageId": parcel["villageId"],
                "villageName": parcel.get("villageName"),
                "title": parcel["suggestedUse"],
                "category": parcel["suggestedUse"],
                "summary": parcel.get("explanation", f"Assess parcel {parcel['id']} using local field checks."),
                "priority": "High" if parcel["status"] == "suitable" else "Medium",
                "suitabilityScore": parcel["score"],
                "confidenceScore": parcel.get("confidenceScore", 85),
                "legalStatus": parcel.get("legalStatus"),
            }
            for index, parcel in enumerate(parcels_data)
            if parcel.get("suggestedUse")
        ]
        if recommendations:
            db.recommendations.insert_many(recommendations)

    # Seed reports for Baloda Bazar
    if db.reports.count_documents({}) == 0:
        baloda_reports = [
            {
                "id": "report-001",
                "title": "Baloda Bazar District Land Suitability Snapshot",
                "type": "District Assessment",
                "generatedAt": "2026-10-24",
                "status": "Ready",
                "summary": "Satellite NDVI and terrain analysis across 9 tehsils in Baloda Bazar district (DILRMP Code 674), identifying 215+ acres of candidate uncultivated wasteland.",
            },
            {
                "id": "report-002",
                "title": "Mahanadi & Sheonath River Catchment Drainage Review",
                "type": "Environmental & Hydrology",
                "generatedAt": "2026-10-20",
                "status": "Ready",
                "summary": "Drainage buffers and seasonal flood risk assessment for candidate solar and agroforestry parcels near Simga and Kasdol blocks.",
            },
            {
                "id": "report-003",
                "title": "Chhattisgarh BhuNaksha Cadastral Availability Reconciliation",
                "type": "Legal & Revenue Audit",
                "generatedAt": "2026-10-18",
                "status": "Ready",
                "summary": "Distinguishing biophysically potentially unused scrub from legally verified Government Nazul/Gothan commons vs private fallow land.",
            },
        ]
        db.reports.insert_many(baloda_reports)

    # Seed demo administrator user
    if db.users.count_documents({}) == 0:
        db.users.insert_one({
            "email": "admin@village.local",
            "password_hash": generate_password_hash("admin"),
            "role": "administrator",
        })


def initialize_database(app=None, force=False):
    """Initialize MongoDB connection, build indexes, and seed if needed."""
    db = get_db(app)
    create_indexes(db)
    seed_database(db, force=force)
    return db
