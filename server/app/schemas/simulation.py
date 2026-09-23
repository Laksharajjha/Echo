from pydantic import BaseModel
from typing import Literal, List, Dict, Any, Optional
from datetime import datetime

class SimulationStatus(BaseModel):
    world_id: str
    is_running: bool
    current_tick: int
    current_time: Optional[datetime]
    tick_duration_minutes: int
    agent_count: int
    location_count: int

class SimulationCommand(BaseModel):
    action: Literal['play', 'pause', 'step', 'advance']
    ticks: int = 1
    speed: float = 1.0

class TickResult(BaseModel):
    tick: int
    simulation_time: datetime
    events: List[Any]
    actions: List[Any]
    agent_updates: List[Any]
