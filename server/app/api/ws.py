from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json

router = APIRouter(prefix="/ws", tags=["WebSockets"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, world_id: str):
        await websocket.accept()
        if world_id not in self.active_connections:
            self.active_connections[world_id] = []
        self.active_connections[world_id].append(websocket)

    def disconnect(self, websocket: WebSocket, world_id: str):
        if world_id in self.active_connections:
            self.active_connections[world_id].remove(websocket)

    async def broadcast(self, message: dict, world_id: str):
        if world_id in self.active_connections:
            msg_str = json.dumps(message)
            for connection in self.active_connections[world_id]:
                try:
                    await connection.send_text(msg_str)
                except Exception:
                    pass

manager = ConnectionManager()

@router.websocket("/{world_id}")
async def websocket_endpoint(websocket: WebSocket, world_id: str):
    await manager.connect(websocket, world_id)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                if msg.get("type") == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        manager.disconnect(websocket, world_id)
