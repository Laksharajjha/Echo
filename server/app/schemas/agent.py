from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class PersonalityCreate(BaseModel):
    openness: float = 0.5
    conscientiousness: float = 0.5
    extraversion: float = 0.5
    agreeableness: float = 0.5
    neuroticism: float = 0.5
    traits: List[str] = []

class GoalCreate(BaseModel):
    description: str
    priority: float = 0.5
    motivation: str = ''
    deadline_tick: Optional[int] = None

class ScheduleEntryCreate(BaseModel):
    time_of_day: str
    activity: str
    location_id: Optional[str] = None
    priority: float = 0.5
    day_of_week: Optional[int] = None

class AgentCreate(BaseModel):
    name: str
    age: int
    occupation: str
    bio: str = ''
    personality: PersonalityCreate = PersonalityCreate()
    home_location_id: Optional[str] = None
    current_location_id: Optional[str] = None
    values: List[str] = []
    fears: List[str] = []
    preferences: Dict[str, Any] = {}
    money: float = 1000.0
    goals: List[GoalCreate] = []
    schedule: List[ScheduleEntryCreate] = []

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    occupation: Optional[str] = None
    bio: Optional[str] = None
    current_location_id: Optional[str] = None
    current_activity: Optional[str] = None
    energy: Optional[float] = None
    hunger: Optional[float] = None
    mood: Optional[float] = None
    stress: Optional[float] = None
    social_need: Optional[float] = None
    money: Optional[float] = None
    is_active: Optional[bool] = None

class AgentResponse(BaseModel):
    id: str
    world_id: str
    name: str
    age: int
    occupation: str
    bio: Optional[str]
    home_location_id: Optional[str]
    current_location_id: Optional[str]
    current_activity: Optional[str]
    current_activity_reason: Optional[str]
    openness: float
    conscientiousness: float
    extraversion: float
    agreeableness: float
    neuroticism: float
    personality_traits: List[str]
    energy: float
    hunger: float
    mood: float
    stress: float
    social_need: float
    money: float
    values: List[str]
    fears: List[str]
    preferences: dict
    is_active: bool
    last_decision_tick: int
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class AgentListResponse(BaseModel):
    id: str
    name: str
    age: int
    occupation: str
    current_location_id: Optional[str]
    current_activity: Optional[str]
    mood: float
    energy: float
    money: float
    is_active: bool
    
    model_config = ConfigDict(from_attributes=True)

class AgentDetailResponse(AgentResponse):
    goals: List[Any] = []
    schedule: List[Any] = []
