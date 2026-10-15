"""Parcel recommendation database model."""

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.db import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    parcel_id: Mapped[str] = mapped_column(ForeignKey("land_parcels.id"), nullable=False, index=True)
    title: Mapped[str | None] = mapped_column(String(160))
    category: Mapped[str | None] = mapped_column(String(160))
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    priority: Mapped[str] = mapped_column(String(40), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "parcelId": self.parcel_id,
            "title": self.title,
            "category": self.category,
            "summary": self.summary,
            "priority": self.priority,
        }
