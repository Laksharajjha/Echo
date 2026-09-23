from pydantic import BaseModel
from typing import Dict, Any

class GodConsoleCommand(BaseModel):
    command: str

class GodConsoleResponse(BaseModel):
    response_type: str
    content: str
    data: Dict[str, Any] = {}
