from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_session
from app.models.relationship import Relationship
from app.schemas.relationship import RelationshipCreate, RelationshipUpdate, RelationshipResponse

router = APIRouter(prefix="/api/worlds/{world_id}/relationships", tags=["Relationships"])

@router.post("/", response_model=RelationshipResponse)
async def create_relationship(world_id: str, rel_in: RelationshipCreate, db: AsyncSession = Depends(get_session)):
    rel = Relationship(world_id=world_id, **rel_in.model_dump())
    db.add(rel)
    await db.commit()
    await db.refresh(rel)
    return rel

@router.get("/", response_model=list[RelationshipResponse])
async def list_relationships(world_id: str, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Relationship).where(Relationship.world_id == world_id))
    return result.scalars().all()

@router.get("/agent/{agent_id}", response_model=list[RelationshipResponse])
async def get_agent_relationships(world_id: str, agent_id: str, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Relationship).where(
        (Relationship.world_id == world_id) & (Relationship.agent_id == agent_id)
    ))
    return result.scalars().all()

@router.put("/{relationship_id}", response_model=RelationshipResponse)
async def update_relationship(world_id: str, relationship_id: str, rel_in: RelationshipUpdate, db: AsyncSession = Depends(get_session)):
    rel = await db.get(Relationship, relationship_id)
    if not rel or rel.world_id != world_id:
        raise HTTPException(status_code=404, detail="Relationship not found")
        
    for k, v in rel_in.model_dump(exclude_unset=True).items():
        setattr(rel, k, v)
        
    await db.commit()
    await db.refresh(rel)
    return rel
