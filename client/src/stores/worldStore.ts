import { create } from 'zustand';
import { World, WorldCreate } from '../api/types';
import { api } from '../api/client';

interface WorldState {
  worlds: World[];
  currentWorld: World | null;
  loading: boolean;
  error: string | null;
  fetchWorlds: () => Promise<void>;
  createWorld: (data: WorldCreate) => Promise<World>;
  selectWorld: (id: string | null) => Promise<void>;
  updateWorld: (id: string, data: Partial<WorldCreate>) => Promise<void>;
  deleteWorld: (id: string) => Promise<void>;
}

export const useWorldStore = create<WorldState>((set, get) => ({
  worlds: [],
  currentWorld: null,
  loading: false,
  error: null,
  
  fetchWorlds: async () => {
    set({ loading: true, error: null });
    try {
      const worlds = await api.worlds.list();
      set({ worlds, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  
  createWorld: async (data: WorldCreate) => {
    set({ loading: true, error: null });
    try {
      const newWorld = await api.worlds.create(data);
      set(state => ({ worlds: [...state.worlds, newWorld], loading: false }));
      return newWorld;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
  
  selectWorld: async (id: string | null) => {
    if (!id) {
      set({ currentWorld: null });
      return;
    }
    set({ loading: true, error: null });
    try {
      const world = await api.worlds.get(id);
      set({ currentWorld: world, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  
  updateWorld: async (id: string, data: Partial<WorldCreate>) => {
    set({ loading: true, error: null });
    try {
      const updated = await api.worlds.update(id, data);
      set(state => ({
        worlds: state.worlds.map(w => w.id === id ? updated : w),
        currentWorld: state.currentWorld?.id === id ? updated : state.currentWorld,
        loading: false
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
  
  deleteWorld: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await api.worlds.delete(id);
      set(state => ({
        worlds: state.worlds.filter(w => w.id !== id),
        currentWorld: state.currentWorld?.id === id ? null : state.currentWorld,
        loading: false
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  }
}));
