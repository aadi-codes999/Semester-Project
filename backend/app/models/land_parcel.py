"""Land parcel database model."""

from sqlalchemy import Float, ForeignKey, JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.db import Base


ASSESSMENT_LABELS = {
    "suitable": "Potentially suitable",
    "assessment": "Needs assessment",
    "water": "Water-related",
    "insufficient": "Insufficient data",
    "constraints": "Review constraints",
}


class LandParcel(Base):
    __tablename__ = "land_parcels"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    village_id: Mapped[str] = mapped_column(ForeignKey("villages.id"), nullable=False, index=True)
    area: Mapped[float] = mapped_column(Float, nullable=False)
    cover: Mapped[str] = mapped_column(String(160), nullable=False)
    status: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    verification: Mapped[str] = mapped_column(String(40), nullable=False)
    score: Mapped[float | None] = mapped_column(Float)
    suggested_use: Mapped[str | None] = mapped_column(String(160))
    road_access: Mapped[str] = mapped_column(String(160), nullable=False)
    water_proximity: Mapped[str] = mapped_column(String(160), nullable=False)
    updated: Mapped[str] = mapped_column(String(10), nullable=False)
    center: Mapped[list[float]] = mapped_column(JSON, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "villageId": self.village_id,
            "area": self.area,
            "cover": self.cover,
            "status": self.status,
            "statusLabel": ASSESSMENT_LABELS.get(self.status, self.status),
            "verification": self.verification,
            "score": self.score,
            "suggestedUse": self.suggested_use,
            "roadAccess": self.road_access,
            "waterProximity": self.water_proximity,
            "updated": self.updated,
            "center": self.center,
        }
