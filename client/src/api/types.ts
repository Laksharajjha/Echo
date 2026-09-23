export interface World {
  id: string;
  name: string;
  description: string;
  simulation_style: string;
  current_tick: number;
  current_time: string;
  tick_duration_minutes: number;
  is_running: boolean;
  seed: number | null;
  config_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface WorldCreate {
  name: string;
  description: string;
  simulation_style?: string;
  tick_duration_minutes?: number;
  seed?: number;
}

export interface Location {
  id: string;
  world_id: string;
  name: string;
  description: string;
  location_type: string;
  capacity: number;
  x_pos: number;
  y_pos: number;
  created_at: string;
}

export interface LocationConnection {
  id: string;
  from_location_id: string;
  to_location_id: string;
  travel_time_minutes: number;
  bidirectional: boolean;
}

export interface LocationCreate {
  name: string;
  description?: string;
  location_type?: string;
  capacity?: number;
  x_pos?: number;
  y_pos?: number;
}

export interface Agent {
  id: string;
  world_id: string;
  name: string;
  age: number;
  occupation: string;
  bio: string;
  home_location_id: string;
  current_location_id: string;
  current_activity: string | null;
  current_activity_reason: string | null;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  personality_traits: string[];
  energy: number;
  hunger: number;
  mood: number;
  stress: number;
  social_need: number;
  money: number;
  values: string[];
  fears: string[];
  preferences: Record<string, unknown>;
  is_active: boolean;
  goals: AgentGoal[];
  schedule: ScheduleEntry[];
  created_at: string;
}

export interface AgentCreate {
  name: string;
  age: number;
  occupation: string;
  bio?: string;
  home_location_id: string;
  current_location_id?: string;
  openness?: number;
  conscientiousness?: number;
  extraversion?: number;
  agreeableness?: number;
  neuroticism?: number;
  personality_traits?: string[];
  values?: string[];
  fears?: string[];
  preferences?: Record<string, unknown>;
  money?: number;
  goals?: GoalCreate[];
  schedule?: ScheduleEntryCreate[];
}

export interface AgentGoal {
  id: string;
  description: string;
  priority: number;
  progress: number;
  motivation: string;
  status: string;
  deadline_tick: number | null;
}

export interface GoalCreate {
  description: string;
  priority?: number;
  motivation?: string;
}

export interface ScheduleEntry {
  id: string;
  time_of_day: string;
  activity: string;
  location_id: string | null;
  priority: number;
  day_of_week: number | null;
}

export interface ScheduleEntryCreate {
  time_of_day: string;
  activity: string;
  location_id?: string;
  priority?: number;
  day_of_week?: number;
}

export interface Relationship {
  id: string;
  world_id: string;
  agent_id: string;
  target_agent_id: string;
  trust: number;
  affinity: number;
  respect: number;
  familiarity: number;
  conflict: number;
  professional_dependency: number;
  relationship_type: string;
}

export interface Event {
  id: string;
  world_id: string;
  event_type: string;
  description: string;
  importance: number;
  location_id: string | null;
  tick: number;
  simulation_time: string;
  source_agent_id: string | null;
  metadata_json: Record<string, unknown>;
  is_public: boolean;
  created_at: string;
}

export interface SimulationStatus {
  world_id: string;
  is_running: boolean;
  current_tick: number;
  current_time: string;
  tick_duration_minutes: number;
  agent_count: number;
  location_count: number;
}

export interface SimulationCommand {
  action: 'play' | 'pause' | 'step' | 'advance';
  ticks?: number;
  speed?: number;
}
