"""Village database model."""

from sqlalchemy import JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.db import Base


class Village(Base):
    __tablename__ = "villages"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    district: Mapped[str] = mapped_column(String(160), nullable=False)
    center: Mapped[list[float]] = mapped_column(JSON, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "district": self.district,
            "center": self.center,
        }
