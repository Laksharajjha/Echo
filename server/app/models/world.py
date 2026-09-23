from sqlalchemy import String, Text, Integer, DateTime, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base
from datetime import datetime
from typing import Optional

class World(Base):
    __tablename__ = "worlds"
    
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    simulation_style: Mapped[str] = mapped_column(String(50), default='realistic')
    current_tick: Mapped[int] = mapped_column(Integer, default=0)
    current_time: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    tick_duration_minutes: Mapped[int] = mapped_column(Integer, default=5)
    is_running: Mapped[bool] = mapped_column(Boolean, default=False)
    seed: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    config_json: Mapped[dict] = mapped_column(JSON, default={})
