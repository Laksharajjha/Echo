from sqlalchemy import String, Text, Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base
from typing import Optional

class Location(Base):
    __tablename__ = "locations"
    
    world_id: Mapped[str] = mapped_column(String(36), ForeignKey("worlds.id"))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    location_type: Mapped[str] = mapped_column(String(100), default='building')
    capacity: Mapped[int] = mapped_column(Integer, default=50)
    x_pos: Mapped[float] = mapped_column(Float, default=0.0)
    y_pos: Mapped[float] = mapped_column(Float, default=0.0)

class LocationConnection(Base):
    __tablename__ = "location_connections"
    
    from_location_id: Mapped[str] = mapped_column(String(36), ForeignKey("locations.id"))
    to_location_id: Mapped[str] = mapped_column(String(36), ForeignKey("locations.id"))
    travel_time_minutes: Mapped[int] = mapped_column(Integer, default=5)
    bidirectional: Mapped[bool] = mapped_column(Boolean, default=True)
