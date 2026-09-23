from sqlalchemy import String, Text, Integer, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base
from enum import Enum
from typing import Optional

class ActionType(str, Enum):
    MOVE = "MOVE"
    TALK = "TALK"
    WORK = "WORK"
    EAT = "EAT"
    REST = "REST"
    BUY = "BUY"
    SELL = "SELL"
    GIVE = "GIVE"
    TAKE = "TAKE"
    CALL = "CALL"
    MESSAGE = "MESSAGE"
    MEET = "MEET"
    ATTEND_EVENT = "ATTEND_EVENT"
    CREATE_EVENT = "CREATE_EVENT"
    QUIT_JOB = "QUIT_JOB"
    APPLY_FOR_JOB = "APPLY_FOR_JOB"
    START_PROJECT = "START_PROJECT"
    JOIN_GROUP = "JOIN_GROUP"
    LEAVE_GROUP = "LEAVE_GROUP"
    MAKE_FRIEND = "MAKE_FRIEND"
    CONFRONT = "CONFRONT"
    APOLOGIZE = "APOLOGIZE"
    HELP = "HELP"
    IGNORE = "IGNORE"
    WAIT = "WAIT"
    SLEEP = "SLEEP"

class Action(Base):
    __tablename__ = "actions"
    
    world_id: Mapped[str] = mapped_column(String(36), ForeignKey("worlds.id"))
    agent_id: Mapped[str] = mapped_column(String(36), ForeignKey("agents.id"))
    action_type: Mapped[str] = mapped_column(String(50))
    target_agent_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("agents.id"), nullable=True)
    location_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("locations.id"), nullable=True)
    parameters: Mapped[dict] = mapped_column(JSON, default=dict)
    decision_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tick: Mapped[int] = mapped_column(Integer)
    result: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    state_changes: Mapped[dict] = mapped_column(JSON, default=dict)
