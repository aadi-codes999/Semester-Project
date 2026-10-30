"""Standalone CLI script to initialize and seed the MongoDB database."""

import argparse
import os
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv

load_dotenv(backend_dir / ".env")

from app.database.mongo import get_db, initialize_database, ping_db


def main():
    parser = argparse.ArgumentParser(description="Seed MongoDB for GIS Village project.")
    parser.add_argument("--reset", action="store_true", help="Clear and re-seed all collections")
    args = parser.parse_args()

    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    db_name = os.getenv("MONGO_DB_NAME", "gis_village")

    print(f"Connecting to MongoDB at: {mongo_uri}")
    print(f"Target Database: {db_name}")

    db = get_db()
    is_alive, msg = ping_db(db)
    if not is_alive:
        print(f"Error: Unable to connect to MongoDB: {msg}")
        sys.exit(1)

    print("MongoDB connection successful!")
    print(f"Initializing database (reset={args.reset})...")
    initialize_database(force=args.reset)

    print("\n--- Collection Summary ---")
    collections = ["villages", "land_parcels", "assessments", "recommendations", "reports", "users"]
    for col_name in collections:
        count = db[col_name].count_documents({})
        sample = db[col_name].find_one({}, {"_id": 0})
        sample_str = str(sample)[:70] + "..." if sample else "Empty"
        print(f"  • {col_name:<16}: {count:>3} documents | Sample: {sample_str}")

    print("\nDatabase initialization complete!\n")


if __name__ == "__main__":
    main()
