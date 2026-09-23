import { create } from 'zustand';
import { Agent, AgentCreate } from '../api/types';
import { api } from '../api/client';

interface AgentState {
  agents: Agent[];
  selectedAgent: Agent | null;
  loading: boolean;
  error: string | null;
  fetchAgents: (worldId: string) => Promise<void>;
  createAgent: (worldId: string, data: AgentCreate) => Promise<Agent>;
  selectAgent: (id: string | null) => void;
  updateAgent: (worldId: string, agentId: string, data: Partial<AgentCreate>) => Promise<void>;
  deleteAgent: (worldId: string, agentId: string) => Promise<void>;
  updateAgentRealtime: (updatedAgent: Agent) => void;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: [],
  selectedAgent: null,
  loading: false,
  error: null,
  
  fetchAgents: async (worldId: string) => {
    set({ loading: true, error: null });
    try {
      const agents = await api.agents.list(worldId);
      set({ agents, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  
  createAgent: async (worldId: string, data: AgentCreate) => {
    set({ loading: true, error: null });
    try {
      const newAgent = await api.agents.create(worldId, data);
      set(state => ({ agents: [...state.agents, newAgent], loading: false }));
      return newAgent;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
  
  selectAgent: (id: string | null) => {
    if (!id) {
      set({ selectedAgent: null });
      return;
    }
    const agent = get().agents.find(a => a.id === id) || null;
    set({ selectedAgent: agent });
  },
  
  updateAgent: async (worldId: string, agentId: string, data: Partial<AgentCreate>) => {
    try {
      const updated = await api.agents.update(worldId, agentId, data);
      set(state => ({
        agents: state.agents.map(a => a.id === agentId ? updated : a),
        selectedAgent: state.selectedAgent?.id === agentId ? updated : state.selectedAgent
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },
  
  deleteAgent: async (worldId: string, agentId: string) => {
    try {
      await api.agents.delete(worldId, agentId);
      set(state => ({
        agents: state.agents.filter(a => a.id !== agentId),
        selectedAgent: state.selectedAgent?.id === agentId ? null : state.selectedAgent
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  updateAgentRealtime: (updatedAgent: Agent) => {
    set(state => ({
      agents: state.agents.map(a => a.id === updatedAgent.id ? updatedAgent : a),
      selectedAgent: state.selectedAgent?.id === updatedAgent.id ? updatedAgent : state.selectedAgent
    }));
  }
}));
