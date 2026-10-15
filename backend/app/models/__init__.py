"""Application data models."""

from app.models.assessment import Assessment
from app.models.land_parcel import LandParcel
from app.models.recommendation import Recommendation
from app.models.report import Report
from app.models.user import User
from app.models.village import Village

__all__ = [
    "Assessment",
    "LandParcel",
    "Recommendation",
    "Report",
    "User",
    "Village",
]
