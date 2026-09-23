from sqlalchemy import String, Integer, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base
from datetime import datetime
from typing import Optional

class Snapshot(Base):
    __tablename__ = "snapshots"
    
    world_id: Mapped[str] = mapped_column(String(36), ForeignKey("worlds.id"))
    label: Mapped[str] = mapped_column(String(255))
    tick: Mapped[int] = mapped_column(Integer)
    simulation_time: Mapped[datetime] = mapped_column(DateTime)
    state_json: Mapped[dict] = mapped_column(JSON)
    parent_snapshot_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    is_fork_point: Mapped[bool] = mapped_column(Boolean, default=False)
