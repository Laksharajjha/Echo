from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_session
from app.models.world import World
from app.schemas.world import WorldCreate, WorldUpdate, WorldResponse, WorldListResponse
from datetime import datetime

router = APIRouter(prefix="/api/worlds", tags=["Worlds"])

@router.post("/", response_model=WorldResponse)
async def create_world(world_in: WorldCreate, db: AsyncSession = Depends(get_session)):
    world = World(**world_in.model_dump())
    world.current_time = datetime(2026, 9, 23, 8, 0, 0)
    db.add(world)
    await db.commit()
    await db.refresh(world)
    return world

@router.get("/", response_model=list[WorldListResponse])
async def list_worlds(db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(World))
    return result.scalars().all()

@router.get("/{world_id}", response_model=WorldResponse)
async def get_world(world_id: str, db: AsyncSession = Depends(get_session)):
    world = await db.get(World, world_id)
    if not world:
        raise HTTPException(status_code=404, detail="World not found")
    return world

@router.put("/{world_id}", response_model=WorldResponse)
async def update_world(world_id: str, world_in: WorldUpdate, db: AsyncSession = Depends(get_session)):
    world = await db.get(World, world_id)
    if not world:
        raise HTTPException(status_code=404, detail="World not found")
    
    update_data = world_in.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(world, k, v)
        
    await db.commit()
    await db.refresh(world)
    return world

@router.delete("/{world_id}")
async def delete_world(world_id: str, db: AsyncSession = Depends(get_session)):
    world = await db.get(World, world_id)
    if not world:
        raise HTTPException(status_code=404, detail="World not found")
    
    await db.delete(world)
    await db.commit()
    return {"message": "World deleted"}
