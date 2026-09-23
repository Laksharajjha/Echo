from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.db.session import get_session
from app.models.agent import Agent
from app.models.goal import AgentGoal
from app.models.schedule import AgentScheduleEntry
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse, AgentListResponse, AgentDetailResponse

router = APIRouter(prefix="/api/worlds/{world_id}/agents", tags=["Agents"])

@router.post("/", response_model=AgentResponse)
async def create_agent(world_id: str, agent_in: AgentCreate, db: AsyncSession = Depends(get_session)):
    agent_data = agent_in.model_dump(exclude={'personality', 'goals', 'schedule'})
    
    personality = agent_in.personality.model_dump()
    agent_data.update(personality)
    agent_data["world_id"] = world_id
    
    agent = Agent(**agent_data)
    db.add(agent)
    await db.commit()
    await db.refresh(agent)
    
    for goal in agent_in.goals:
        db.add(AgentGoal(agent_id=agent.id, **goal.model_dump()))
        
    for sched in agent_in.schedule:
        db.add(AgentScheduleEntry(agent_id=agent.id, **sched.model_dump()))
        
    if agent_in.goals or agent_in.schedule:
        await db.commit()
        
    return agent

@router.get("/", response_model=list[AgentListResponse])
async def list_agents(world_id: str, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Agent).where(Agent.world_id == world_id))
    return result.scalars().all()

@router.get("/{agent_id}", response_model=AgentDetailResponse)
async def get_agent(world_id: str, agent_id: str, db: AsyncSession = Depends(get_session)):
    agent = await db.get(Agent, agent_id)
    if not agent or agent.world_id != world_id:
        raise HTTPException(status_code=404, detail="Agent not found")
        
    goals = (await db.execute(select(AgentGoal).where(AgentGoal.agent_id == agent_id))).scalars().all()
    schedule = (await db.execute(select(AgentScheduleEntry).where(AgentScheduleEntry.agent_id == agent_id))).scalars().all()
    
    agent_dict = {c.name: getattr(agent, c.name) for c in agent.__table__.columns}
    agent_dict["goals"] = goals
    agent_dict["schedule"] = schedule
    
    return agent_dict

@router.put("/{agent_id}", response_model=AgentResponse)
async def update_agent(world_id: str, agent_id: str, agent_in: AgentUpdate, db: AsyncSession = Depends(get_session)):
    agent = await db.get(Agent, agent_id)
    if not agent or agent.world_id != world_id:
        raise HTTPException(status_code=404, detail="Agent not found")
        
    update_data = agent_in.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(agent, k, v)
        
    await db.commit()
    await db.refresh(agent)
    return agent

@router.delete("/{agent_id}")
async def delete_agent(world_id: str, agent_id: str, db: AsyncSession = Depends(get_session)):
    agent = await db.get(Agent, agent_id)
    if not agent or agent.world_id != world_id:
        raise HTTPException(status_code=404, detail="Agent not found")
        
    await db.delete(agent)
    await db.commit()
    return {"message": "Agent deleted"}
