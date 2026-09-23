from sqlalchemy import String, Text, Integer, Float, Boolean, ForeignKey, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base
from datetime import datetime
from typing import Optional

class Event(Base):
    __tablename__ = "events"
    
    world_id: Mapped[str] = mapped_column(String(36), ForeignKey("worlds.id"))
    event_type: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text)
    importance: Mapped[float] = mapped_column(Float, default=0.5)
    location_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("locations.id"), nullable=True)
    tick: Mapped[int] = mapped_column(Integer)
    simulation_time: Mapped[datetime] = mapped_column(DateTime)
    source_agent_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("agents.id"), nullable=True)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
