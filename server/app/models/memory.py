from sqlalchemy import String, Text, Integer, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base
from typing import Optional

class AgentMemory(Base):
    __tablename__ = "agent_memories"
    
    agent_id: Mapped[str] = mapped_column(String(36), ForeignKey("agents.id"))
    memory_type: Mapped[str] = mapped_column(String(20))
    content: Mapped[str] = mapped_column(Text)
    importance: Mapped[float] = mapped_column(Float)
    emotional_valence: Mapped[float] = mapped_column(Float, default=0.0)
    participants: Mapped[list] = mapped_column(JSON, default=list)
    location_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("locations.id"), nullable=True)
    tick_created: Mapped[int] = mapped_column(Integer)
    last_accessed_tick: Mapped[int] = mapped_column(Integer)
    access_count: Mapped[int] = mapped_column(Integer, default=0)
    is_decayed: Mapped[bool] = mapped_column(Boolean, default=False)
