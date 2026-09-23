from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class LocationCreate(BaseModel):
    name: str
    description: str = ''
    location_type: str = 'building'
    capacity: int = 50
    x_pos: float = 0.0
    y_pos: float = 0.0

class LocationConnectionCreate(BaseModel):
    to_location_id: str
    travel_time_minutes: int = 5
    bidirectional: bool = True

class LocationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    location_type: Optional[str] = None
    capacity: Optional[int] = None
    x_pos: Optional[float] = None
    y_pos: Optional[float] = None

class LocationResponse(BaseModel):
    id: str
    world_id: str
    name: str
    description: Optional[str]
    location_type: str
    capacity: int
    x_pos: float
    y_pos: float
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class ConnectionResponse(BaseModel):
    id: str
    to_location_id: str
    travel_time_minutes: int
    bidirectional: bool
    
    model_config = ConfigDict(from_attributes=True)

class LocationWithConnections(LocationResponse):
    connections: List[ConnectionResponse] = []
