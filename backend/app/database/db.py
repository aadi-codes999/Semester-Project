"""Database connection, schema initialization, and sample-data seeding."""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


class Base(DeclarativeBase):
    pass


_engine = None
_session_factory = None


def initialize_database(app):
    """Create tables and seed the configured database when it is empty."""
    global _engine, _session_factory

    from app import models
    from app.demo_data import PARCELS, REPORTS, RECOMMENDATION_TEXT, VILLAGES

    database_url = app.config["DATABASE_URL"]
    engine_options = {"pool_pre_ping": True}
    if database_url.startswith("sqlite"):
        engine_options["connect_args"] = {"check_same_thread": False}

    _engine = create_engine(database_url, **engine_options)
    _session_factory = sessionmaker(bind=_engine, expire_on_commit=False)
    Base.metadata.create_all(_engine)

    with _session_factory.begin() as session:
        if session.query(models.Village).first() is not None:
            return

        session.add_all([
            models.Village(
                id=village["id"],
                name=village["name"],
                district=village["district"],
                center=village["center"],
            )
            for village in VILLAGES
        ])
        session.add_all([
            models.LandParcel(
                id=parcel["id"],
                village_id=parcel["villageId"],
                area=parcel["area"],
                cover=parcel["cover"],
                status=parcel["status"],
                verification=parcel["verification"],
                score=parcel["score"],
                suggested_use=parcel["suggestedUse"],
                road_access=parcel["roadAccess"],
                water_proximity=parcel["waterProximity"],
                updated=parcel["updated"],
                center=parcel["center"],
            )
            for parcel in PARCELS
        ])
        session.add_all([
            models.Assessment(
                parcel_id=parcel["id"],
                status=parcel["status"],
                verification=parcel["verification"],
                score=parcel["score"],
                updated=parcel["updated"],
            )
            for parcel in PARCELS
        ])
        session.add_all([
            models.Recommendation(
                id=f"recommendation-{index + 1}",
                parcel_id=parcel["id"],
                title=parcel["suggestedUse"],
                category=parcel["suggestedUse"],
                summary=RECOMMENDATION_TEXT.get(
                    parcel["suggestedUse"],
                    "Assess the parcel using local field checks.",
                ),
                priority="High" if parcel["status"] == "suitable" else "Medium",
            )
            for index, parcel in enumerate(PARCELS)
            if parcel["suggestedUse"]
        ])
        session.add_all([
            models.Report(
                id=report["id"],
                title=report["title"],
                type=report["type"],
                generated_at=report["generatedAt"],
                status=report["status"],
                summary=report["summary"],
            )
            for report in REPORTS
        ])


def get_session():
    if _session_factory is None:
        raise RuntimeError("Database has not been initialized.")
    return _session_factory()
