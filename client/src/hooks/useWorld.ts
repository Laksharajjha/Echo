import { useEffect } from 'react';
import { useWorldStore } from '../stores/worldStore';
import { useAgentStore } from '../stores/agentStore';
import { useSimulationStore } from '../stores/simulationStore';

export function useWorld(worldId: string | undefined) {
  const { selectWorld, currentWorld } = useWorldStore();
  const { fetchAgents } = useAgentStore();
  const { fetchStatus, fetchEvents } = useSimulationStore();

  useEffect(() => {
    if (worldId) {
      selectWorld(worldId);
      fetchAgents(worldId);
      fetchStatus(worldId);
      fetchEvents(worldId);
    }
  }, [worldId, selectWorld, fetchAgents, fetchStatus, fetchEvents]);

  return { currentWorld };
}
