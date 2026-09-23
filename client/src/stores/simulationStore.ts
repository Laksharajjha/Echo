import { create } from 'zustand';
import { SimulationStatus, SimulationCommand, Event } from '../api/types';
import { api } from '../api/client';

interface SimulationState {
  status: SimulationStatus | null;
  events: Event[];
  isRunning: boolean;
  loading: boolean;
  fetchStatus: (worldId: string) => Promise<void>;
  sendCommand: (worldId: string, command: SimulationCommand) => Promise<void>;
  addEvent: (event: Event) => void;
  fetchEvents: (worldId: string) => Promise<void>;
  setStatus: (status: SimulationStatus) => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  status: null,
  events: [],
  isRunning: false,
  loading: false,
  
  fetchStatus: async (worldId: string) => {
    try {
      const status = await api.simulation.getStatus(worldId);
      set({ status, isRunning: status.is_running });
    } catch (err) {
      console.error("Failed to fetch sim status", err);
    }
  },
  
  sendCommand: async (worldId: string, command: SimulationCommand) => {
    set({ loading: true });
    try {
      const status = await api.simulation.sendCommand(worldId, command);
      set({ status, isRunning: status.is_running, loading: false });
    } catch (err) {
      console.error("Failed to send command", err);
      set({ loading: false });
    }
  },
  
  addEvent: (event: Event) => {
    set(state => ({
      events: [event, ...state.events].slice(0, 100) // Keep last 100
    }));
  },
  
  fetchEvents: async (worldId: string) => {
    try {
      const events = await api.events.list(worldId);
      set({ events });
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  },

  setStatus: (status: SimulationStatus) => {
    set({ status, isRunning: status.is_running });
  }
}));
