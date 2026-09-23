import { useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { useSimulationStore } from '../stores/simulationStore';
import { useAgentStore } from '../stores/agentStore';
import { Event, SimulationStatus, Agent } from '../api/types';

export function useSimulation(worldId: string | undefined) {
  const { setStatus, addEvent } = useSimulationStore();
  const { updateAgentRealtime } = useAgentStore();

  const handleMessage = useCallback((message: any) => {
    if (message.type === 'status_update') {
      setStatus(message.data as SimulationStatus);
    } else if (message.type === 'new_event') {
      addEvent(message.data as Event);
    } else if (message.type === 'agent_update') {
      updateAgentRealtime(message.data as Agent);
    }
  }, [setStatus, addEvent, updateAgentRealtime]);

  const { send } = useWebSocket(worldId, handleMessage);

  return { send };
}
