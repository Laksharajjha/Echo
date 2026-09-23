from sqlalchemy import String, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class Relationship(Base):
    __tablename__ = "relationships"
    
    world_id: Mapped[str] = mapped_column(String(36), ForeignKey("worlds.id"))
    agent_id: Mapped[str] = mapped_column(String(36), ForeignKey("agents.id"))
    target_agent_id: Mapped[str] = mapped_column(String(36), ForeignKey("agents.id"))
    
    trust: Mapped[float] = mapped_column(Float, default=0.5)
    affinity: Mapped[float] = mapped_column(Float, default=0.5)
    respect: Mapped[float] = mapped_column(Float, default=0.5)
    familiarity: Mapped[float] = mapped_column(Float, default=0.1)
    conflict: Mapped[float] = mapped_column(Float, default=0.0)
    professional_dependency: Mapped[float] = mapped_column(Float, default=0.0)
    relationship_type: Mapped[str] = mapped_column(String(50), default='neutral')
    
    __table_args__ = (
        UniqueConstraint('agent_id', 'target_agent_id', name='uq_agent_target'),
    )
