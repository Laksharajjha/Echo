from .base import ModelProvider
import random

class MockModelProvider(ModelProvider):
    async def generate_decision(self, agent_context: dict, available_actions: list[str], situation: str) -> dict:
        return {
            "action": random.choice(available_actions) if available_actions else "WAIT",
            "target": None,
            "reasoning": "Mocked decision logic."
        }
        
    async def generate_conversation_turn(self, speaker_context: dict, conversation: dict) -> dict:
        return {
            "content": "This is a mocked conversation turn.",
            "intent": "inform",
            "emotional_tone": "neutral"
        }
        
    async def evaluate_memory_importance(self, agent_context: dict, event_description: str) -> float:
        return random.uniform(0.3, 0.8)
        
    async def generate_world_summary(self, world_state: dict, since_tick: int) -> str:
        return "The world continued peacefully."
        
    async def interpret_god_command(self, command: str, world_context: dict) -> dict:
        return {"action": "none", "parameters": {}}
        
    async def generate_agent(self, description: str, world_context: dict) -> dict:
        return {
            "name": "Generated Agent",
            "age": 30,
            "occupation": "NPC",
            "bio": description
        }
