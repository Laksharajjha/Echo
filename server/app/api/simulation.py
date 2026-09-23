from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.db.session import get_session
from app.models.world import World
from app.models.agent import Agent
from app.models.location import Location
from app.schemas.simulation import SimulationStatus, SimulationCommand, TickResult
from datetime import timedelta

router = APIRouter(prefix="/api/worlds/{world_id}/simulation", tags=["Simulation"])

@router.get("/status", response_model=SimulationStatus)
async def get_status(world_id: str, db: AsyncSession = Depends(get_session)):
    world = await db.get(World, world_id)
    if not world:
        raise HTTPException(status_code=404, detail="World not found")
        
    agents_count = await db.scalar(select(func.count(Agent.id)).where(Agent.world_id == world_id))
    locs_count = await db.scalar(select(func.count(Location.id)).where(Location.world_id == world_id))
    
    return SimulationStatus(
        world_id=world.id,
        is_running=world.is_running,
        current_tick=world.current_tick,
        current_time=world.current_time,
        tick_duration_minutes=world.tick_duration_minutes,
        agent_count=agents_count or 0,
        location_count=locs_count or 0
    )

@router.post("/command", response_model=TickResult)
async def sim_command(world_id: str, cmd: SimulationCommand, db: AsyncSession = Depends(get_session)):
    world = await db.get(World, world_id)
    if not world:
        raise HTTPException(status_code=404, detail="World not found")
        
    if cmd.action == "play":
        world.is_running = True
    elif cmd.action == "pause":
        world.is_running = False
    elif cmd.action in ["step", "advance"]:
        world.current_tick += cmd.ticks
        if world.current_time:
            world.current_time += timedelta(minutes=world.tick_duration_minutes * cmd.ticks)
            
        agents = (await db.execute(select(Agent).where(Agent.world_id == world_id))).scalars().all()
        for agent in agents:
            agent.energy = max(0.0, agent.energy - 0.01 * cmd.ticks)
            agent.hunger = min(1.0, agent.hunger + 0.02 * cmd.ticks)
            
    await db.commit()
    await db.refresh(world)
    
    return TickResult(
        tick=world.current_tick,
        simulation_time=world.current_time,
        events=[],
        actions=[],
        agent_updates=[]
    )
