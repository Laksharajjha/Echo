import pytest
from app.models.world import World
from app.models.location import Location
from app.models.agent import Agent
from datetime import datetime

@pytest.mark.asyncio
async def test_create_world_location_agent(db_session):
    world = World(name="Test World", current_time=datetime.now())
    db_session.add(world)
    await db_session.commit()
    
    loc = Location(world_id=world.id, name="Test Location")
    db_session.add(loc)
    await db_session.commit()
    
    agent = Agent(
        world_id=world.id,
        name="Test Agent",
        age=30,
        occupation="Tester",
        home_location_id=loc.id
    )
    db_session.add(agent)
    await db_session.commit()
    
    assert world.id is not None
    assert loc.id is not None
    assert agent.id is not None
    assert agent.world_id == world.id
