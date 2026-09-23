from sqlalchemy import String, Text, Integer, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base
from typing import Optional

class AgentKnowledge(Base):
    __tablename__ = "agent_knowledge"
    
    agent_id: Mapped[str] = mapped_column(String(36), ForeignKey("agents.id"))
    fact: Mapped[str] = mapped_column(Text)
    source: Mapped[str] = mapped_column(String(50)) # witnessed/told/rumor/inferred
    source_agent_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("agents.id"), nullable=True)
    confidence: Mapped[float] = mapped_column(Float, default=1.0)
    tick_learned: Mapped[int] = mapped_column(Integer)
