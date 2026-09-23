from sqlalchemy import String, Text, Integer, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base
from typing import Optional

class Conversation(Base):
    __tablename__ = "conversations"
    
    world_id: Mapped[str] = mapped_column(String(36), ForeignKey("worlds.id"))
    location_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("locations.id"), nullable=True)
    topic: Mapped[Optional[str]] = mapped_column(Text)
    start_tick: Mapped[int] = mapped_column(Integer)
    end_tick: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    participant_ids: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(20), default='active')

class ConversationMessage(Base):
    __tablename__ = "conversation_messages"
    
    conversation_id: Mapped[str] = mapped_column(String(36), ForeignKey("conversations.id"))
    speaker_id: Mapped[str] = mapped_column(String(36), ForeignKey("agents.id"))
    content: Mapped[str] = mapped_column(Text)
    intent: Mapped[Optional[str]] = mapped_column(String(100))
    tick: Mapped[int] = mapped_column(Integer)
    emotional_tone: Mapped[Optional[str]] = mapped_column(String(50))
