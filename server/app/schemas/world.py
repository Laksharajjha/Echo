from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class WorldCreate(BaseModel):
    name: str
    description: Optional[str] = None
    simulation_style: str = 'realistic'
    tick_duration_minutes: int = 5
    seed: Optional[int] = None
    config_json: dict = {}

class WorldUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    simulation_style: Optional[str] = None
    tick_duration_minutes: Optional[int] = None
    seed: Optional[int] = None
    config_json: Optional[dict] = None

class WorldResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    simulation_style: str
    current_tick: int
    current_time: Optional[datetime]
    tick_duration_minutes: int
    is_running: bool
    seed: Optional[int]
    config_json: dict
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class WorldListResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    simulation_style: str
    current_tick: int
    current_time: Optional[datetime]
    is_running: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
