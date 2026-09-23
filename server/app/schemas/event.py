from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime

class EventCreate(BaseModel):
    event_type: str
    description: str
    importance: float = 0.5
    location_id: Optional[str] = None
    source_agent_id: Optional[str] = None
    metadata_json: Dict[str, Any] = {}
    is_public: bool = True

class EventResponse(BaseModel):
    id: str
    world_id: str
    event_type: str
    description: str
    importance: float
    location_id: Optional[str]
    tick: int
    simulation_time: datetime
    source_agent_id: Optional[str]
    metadata_json: Dict[str, Any]
    is_public: bool
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
