from sqlalchemy import String, Text, Integer, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base
from typing import Optional

class Agent(Base):
    __tablename__ = "agents"
    
    world_id: Mapped[str] = mapped_column(String(36), ForeignKey("worlds.id"))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    age: Mapped[int] = mapped_column(Integer)
    occupation: Mapped[str] = mapped_column(String(255))
    bio: Mapped[Optional[str]] = mapped_column(Text)
    
    home_location_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("locations.id"))
    current_location_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("locations.id"))
    
    current_activity: Mapped[Optional[str]] = mapped_column(String(255))
    current_activity_reason: Mapped[Optional[str]] = mapped_column(Text)
    
    openness: Mapped[float] = mapped_column(Float, default=0.5)
    conscientiousness: Mapped[float] = mapped_column(Float, default=0.5)
    extraversion: Mapped[float] = mapped_column(Float, default=0.5)
    agreeableness: Mapped[float] = mapped_column(Float, default=0.5)
    neuroticism: Mapped[float] = mapped_column(Float, default=0.5)
    personality_traits: Mapped[list] = mapped_column(JSON, default=list)
    
    energy: Mapped[float] = mapped_column(Float, default=1.0)
    hunger: Mapped[float] = mapped_column(Float, default=0.0)
    mood: Mapped[float] = mapped_column(Float, default=0.5)
    stress: Mapped[float] = mapped_column(Float, default=0.0)
    social_need: Mapped[float] = mapped_column(Float, default=0.5)
    money: Mapped[float] = mapped_column(Float, default=1000.0)
    
    values: Mapped[list] = mapped_column(JSON, default=list)
    fears: Mapped[list] = mapped_column(JSON, default=list)
    preferences: Mapped[dict] = mapped_column(JSON, default=dict)
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_decision_tick: Mapped[int] = mapped_column(Integer, default=0)
