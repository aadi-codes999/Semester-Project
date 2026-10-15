"""Parcel assessment database model."""

from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.db import Base
from app.models.land_parcel import ASSESSMENT_LABELS


class Assessment(Base):
    __tablename__ = "assessments"

    parcel_id: Mapped[str] = mapped_column(ForeignKey("land_parcels.id"), primary_key=True)
    status: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    verification: Mapped[str] = mapped_column(String(40), nullable=False)
    score: Mapped[float | None] = mapped_column(Float)
    updated: Mapped[str] = mapped_column(String(10), nullable=False)

    def to_dict(self, village_id):
        return {
            "parcelId": self.parcel_id,
            "villageId": village_id,
            "status": self.status,
            "statusLabel": ASSESSMENT_LABELS.get(self.status, self.status),
            "verification": self.verification,
            "score": self.score,
            "updated": self.updated,
        }
