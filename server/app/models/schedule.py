from sqlalchemy import String, Integer, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base
from typing import Optional

class AgentScheduleEntry(Base):
    __tablename__ = "agent_schedule_entries"
    
    agent_id: Mapped[str] = mapped_column(String(36), ForeignKey("agents.id"))
    time_of_day: Mapped[str] = mapped_column(String(5))
    activity: Mapped[str] = mapped_column(String(255))
    location_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("locations.id"), nullable=True)
    priority: Mapped[float] = mapped_column(Float, default=0.5)
    day_of_week: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
