from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class RelationshipCreate(BaseModel):
    agent_id: str
    target_agent_id: str
    trust: float = 0.5
    affinity: float = 0.5
    respect: float = 0.5
    familiarity: float = 0.1
    conflict: float = 0.0
    professional_dependency: float = 0.0
    relationship_type: str = 'neutral'

class RelationshipUpdate(BaseModel):
    trust: Optional[float] = None
    affinity: Optional[float] = None
    respect: Optional[float] = None
    familiarity: Optional[float] = None
    conflict: Optional[float] = None
    professional_dependency: Optional[float] = None
    relationship_type: Optional[str] = None

class RelationshipResponse(BaseModel):
    id: str
    world_id: str
    agent_id: str
    target_agent_id: str
    trust: float
    affinity: float
    respect: float
    familiarity: float
    conflict: float
    professional_dependency: float
    relationship_type: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
