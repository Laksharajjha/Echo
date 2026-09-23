import {
  World, WorldCreate, Location, LocationCreate, Agent, AgentCreate,
  Relationship, Event, SimulationStatus, SimulationCommand, LocationConnection
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    const detail = await response.text().catch(() => response.statusText);
    throw new ApiError(response.status, `API Error: ${detail}`);
  }
  
  if (response.status === 204) return undefined as T;
  return response.json();
}

export const api = {
  worlds: {
    list: () => fetchApi<World[]>('/api/worlds/'),
    get: (id: string) => fetchApi<World>(`/api/worlds/${id}`),
    create: (data: WorldCreate) => fetchApi<World>('/api/worlds/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<WorldCreate>) => fetchApi<World>(`/api/worlds/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<void>(`/api/worlds/${id}`, { method: 'DELETE' }),
  },
  
  locations: {
    list: (worldId: string) => fetchApi<Location[]>(`/api/worlds/${worldId}/locations/`),
    get: (worldId: string, id: string) => fetchApi<Location>(`/api/worlds/${worldId}/locations/${id}`),
    create: (worldId: string, data: LocationCreate) => fetchApi<Location>(`/api/worlds/${worldId}/locations/`, { method: 'POST', body: JSON.stringify(data) }),
    update: (worldId: string, id: string, data: Partial<LocationCreate>) => fetchApi<Location>(`/api/worlds/${worldId}/locations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (worldId: string, id: string) => fetchApi<void>(`/api/worlds/${worldId}/locations/${id}`, { method: 'DELETE' }),
    addConnection: (worldId: string, fromId: string, toId: string, travelTime: number, bidirectional = true) => 
      fetchApi<LocationConnection>(`/api/worlds/${worldId}/locations/${fromId}/connections`, { 
        method: 'POST', 
        body: JSON.stringify({ to_location_id: toId, travel_time_minutes: travelTime, bidirectional }) 
      }),
    removeConnection: (worldId: string, fromId: string, connectionId: string) =>
      fetchApi<void>(`/api/worlds/${worldId}/locations/${fromId}/connections/${connectionId}`, { method: 'DELETE' }),
  },
  
  agents: {
    list: (worldId: string) => fetchApi<Agent[]>(`/api/worlds/${worldId}/agents/`),
    get: (worldId: string, id: string) => fetchApi<Agent>(`/api/worlds/${worldId}/agents/${id}`),
    create: (worldId: string, data: AgentCreate) => fetchApi<Agent>(`/api/worlds/${worldId}/agents/`, { method: 'POST', body: JSON.stringify(data) }),
    update: (worldId: string, id: string, data: Partial<AgentCreate>) => fetchApi<Agent>(`/api/worlds/${worldId}/agents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (worldId: string, id: string) => fetchApi<void>(`/api/worlds/${worldId}/agents/${id}`, { method: 'DELETE' }),
  },
  
  relationships: {
    list: (worldId: string) => fetchApi<Relationship[]>(`/api/worlds/${worldId}/relationships/`),
    getForAgent: (worldId: string, agentId: string) => fetchApi<Relationship[]>(`/api/worlds/${worldId}/relationships/agent/${agentId}`),
    create: (worldId: string, data: any) => fetchApi<Relationship>(`/api/worlds/${worldId}/relationships/`, { method: 'POST', body: JSON.stringify(data) }),
    update: (worldId: string, id: string, data: any) => fetchApi<Relationship>(`/api/worlds/${worldId}/relationships/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  
  events: {
    list: (worldId: string, limit = 50) => fetchApi<Event[]>(`/api/worlds/${worldId}/events/?limit=${limit}`),
    create: (worldId: string, data: any) => fetchApi<Event>(`/api/worlds/${worldId}/events/`, { method: 'POST', body: JSON.stringify(data) }),
  },
  
  simulation: {
    getStatus: (worldId: string) => fetchApi<SimulationStatus>(`/api/worlds/${worldId}/simulation/status`),
    sendCommand: (worldId: string, command: SimulationCommand) => fetchApi<any>(`/api/worlds/${worldId}/simulation/command`, { method: 'POST', body: JSON.stringify(command) }),
  }
};

