import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  activePanel: string;
  selectedLocationId: string | null;
  toggleSidebar: () => void;
  setActivePanel: (panel: string) => void;
  setSelectedLocation: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activePanel: 'map',
  selectedLocationId: null,
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActivePanel: (panel: string) => set({ activePanel: panel }),
  setSelectedLocation: (id: string | null) => set({ selectedLocationId: id }),
}));
