from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.session import init_db

from app.api import worlds, agents, locations, relationships, events, simulation, ws

app = FastAPI(
    title="ECHO",
    description="ECHO simulation platform backend",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(worlds.router)
app.include_router(agents.router)
app.include_router(locations.router)
app.include_router(relationships.router)
app.include_router(events.router)
app.include_router(simulation.router)
app.include_router(ws.router)

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.get("/")
async def root():
    return {"name": "ECHO", "version": "0.1.0", "status": "running"}
