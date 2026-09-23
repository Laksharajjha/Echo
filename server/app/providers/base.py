from abc import ABC, abstractmethod

class ModelProvider(ABC):
    @abstractmethod
    async def generate_decision(self, agent_context: dict, available_actions: list[str], situation: str) -> dict:
        pass
        
    @abstractmethod
    async def generate_conversation_turn(self, speaker_context: dict, conversation: dict) -> dict:
        pass
        
    @abstractmethod
    async def evaluate_memory_importance(self, agent_context: dict, event_description: str) -> float:
        pass
        
    @abstractmethod
    async def generate_world_summary(self, world_state: dict, since_tick: int) -> str:
        pass
        
    @abstractmethod
    async def interpret_god_command(self, command: str, world_context: dict) -> dict:
        pass
        
    @abstractmethod
    async def generate_agent(self, description: str, world_context: dict) -> dict:
        pass
