from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_session
from app.models.event import Event
from app.schemas.event import EventCreate, EventResponse
from app.models.world import World
import datetime

router = APIRouter(prefix="/api/worlds/{world_id}/events", tags=["Events"])

@router.get("/", response_model=list[EventResponse])
async def list_events(
    world_id: str,
    since_tick: int = 0,
    importance_min: float = 0.0,
    agent_id: str = None,
    location_id: str = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_session)
):
    query = select(Event).where(Event.world_id == world_id)
    
    if since_tick > 0:
        query = query.where(Event.tick >= since_tick)
    if importance_min > 0:
        query = query.where(Event.importance >= importance_min)
    if agent_id:
        query = query.where(Event.source_agent_id == agent_id)
    if location_id:
        query = query.where(Event.location_id == location_id)
        
    query = query.order_by(Event.tick.desc()).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/", response_model=EventResponse)
async def create_event(world_id: str, event_in: EventCreate, db: AsyncSession = Depends(get_session)):
    world = await db.get(World, world_id)
    tick = world.current_tick if world else 0
    sim_time = world.current_time if world and world.current_time else datetime.datetime.now()
    
    event = Event(
        world_id=world_id,
        tick=tick,
        simulation_time=sim_time,
        **event_in.model_dump()
    )
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event
