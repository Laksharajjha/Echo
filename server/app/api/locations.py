from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_session
from app.models.location import Location, LocationConnection
from app.schemas.location import LocationCreate, LocationUpdate, LocationResponse, LocationWithConnections, ConnectionResponse

router = APIRouter(prefix="/api/worlds/{world_id}/locations", tags=["Locations"])

@router.post("/", response_model=LocationResponse)
async def create_location(world_id: str, loc_in: LocationCreate, db: AsyncSession = Depends(get_session)):
    loc = Location(world_id=world_id, **loc_in.model_dump())
    db.add(loc)
    await db.commit()
    await db.refresh(loc)
    return loc

@router.get("/", response_model=list[LocationWithConnections])
async def list_locations(world_id: str, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Location).where(Location.world_id == world_id))
    locations = result.scalars().all()
    
    res = []
    for loc in locations:
        conns_result = await db.execute(select(LocationConnection).where(LocationConnection.from_location_id == loc.id))
        conns = conns_result.scalars().all()
        loc_dict = {c.name: getattr(loc, c.name) for c in loc.__table__.columns}
        loc_dict["connections"] = conns
        res.append(loc_dict)
        
    return res

@router.get("/{location_id}", response_model=LocationResponse)
async def get_location(world_id: str, location_id: str, db: AsyncSession = Depends(get_session)):
    loc = await db.get(Location, location_id)
    if not loc or loc.world_id != world_id:
        raise HTTPException(status_code=404, detail="Location not found")
    return loc

@router.put("/{location_id}", response_model=LocationResponse)
async def update_location(world_id: str, location_id: str, loc_in: LocationUpdate, db: AsyncSession = Depends(get_session)):
    loc = await db.get(Location, location_id)
    if not loc or loc.world_id != world_id:
        raise HTTPException(status_code=404, detail="Location not found")
        
    for k, v in loc_in.model_dump(exclude_unset=True).items():
        setattr(loc, k, v)
        
    await db.commit()
    await db.refresh(loc)
    return loc

@router.delete("/{location_id}")
async def delete_location(world_id: str, location_id: str, db: AsyncSession = Depends(get_session)):
    loc = await db.get(Location, location_id)
    if not loc or loc.world_id != world_id:
        raise HTTPException(status_code=404, detail="Location not found")
        
    await db.delete(loc)
    await db.commit()
    return {"message": "Location deleted"}

@router.post("/{location_id}/connections", response_model=ConnectionResponse)
async def add_connection(world_id: str, location_id: str, conn_in: dict, db: AsyncSession = Depends(get_session)):
    conn = LocationConnection(from_location_id=location_id, **conn_in)
    db.add(conn)
    await db.commit()
    await db.refresh(conn)
    return conn

@router.delete("/{location_id}/connections/{connection_id}")
async def remove_connection(world_id: str, location_id: str, connection_id: str, db: AsyncSession = Depends(get_session)):
    conn = await db.get(LocationConnection, connection_id)
    if not conn or conn.from_location_id != location_id:
        raise HTTPException(status_code=404, detail="Connection not found")
    await db.delete(conn)
    await db.commit()
    return {"message": "Connection removed"}
