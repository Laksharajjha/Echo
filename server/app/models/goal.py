from sqlalchemy import String, Text, Integer, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base
from typing import Optional

class AgentGoal(Base):
    __tablename__ = "agent_goals"
    
    agent_id: Mapped[str] = mapped_column(String(36), ForeignKey("agents.id"))
    description: Mapped[str] = mapped_column(Text)
    priority: Mapped[float] = mapped_column(Float)
    progress: Mapped[float] = mapped_column(Float, default=0.0)
    motivation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default='active')
    deadline_tick: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
