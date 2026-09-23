import React, { useState } from 'react';
import { AgentCreate, GoalCreate, ScheduleEntryCreate, Location } from '../../api/types';
import { useAgentStore } from '../../stores/agentStore';
import { X, Plus, Trash2, User } from 'lucide-react';

interface AgentCreatorProps {
  worldId: string;
  locations: Location[];
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_SCHEDULE: ScheduleEntryCreate[] = [
  { time_of_day: '08:00', activity: 'Wake up', priority: 0.9 },
  { time_of_day: '09:00', activity: 'Work', priority: 0.8 },
  { time_of_day: '13:00', activity: 'Lunch', priority: 0.7 },
  { time_of_day: '14:00', activity: 'Work', priority: 0.8 },
  { time_of_day: '18:00', activity: 'Free time', priority: 0.5 },
  { time_of_day: '22:00', activity: 'Sleep', priority: 0.9 },
];

export default function AgentCreator({ worldId, locations, isOpen, onClose }: AgentCreatorProps) {
  const { createAgent } = useAgentStore();
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: '',
    age: 25,
    occupation: '',
    bio: '',
    home_location_id: locations[0]?.id || '',
    openness: 0.5,
    conscientiousness: 0.5,
    extraversion: 0.5,
    agreeableness: 0.5,
    neuroticism: 0.5,
    personality_traits: [] as string[],
    values: [] as string[],
    fears: [] as string[],
    money: 1000,
  });

  const [goals, setGoals] = useState<GoalCreate[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntryCreate[]>(DEFAULT_SCHEDULE);
  const [tagInput, setTagInput] = useState({ traits: '', values: '', fears: '' });

  const addTag = (field: 'personality_traits' | 'values' | 'fears', inputField: 'traits' | 'values' | 'fears') => {
    const val = tagInput[inputField].trim();
    if (val && !form[field].includes(val)) {
      setForm(prev => ({ ...prev, [field]: [...prev[field], val] }));
      setTagInput(prev => ({ ...prev, [inputField]: '' }));
    }
  };

  const removeTag = (field: 'personality_traits' | 'values' | 'fears', idx: number) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.occupation.trim()) return;
    setCreating(true);
    try {
      const data: AgentCreate = {
        name: form.name,
        age: form.age,
        occupation: form.occupation,
        bio: form.bio,
        home_location_id: form.home_location_id,
        current_location_id: form.home_location_id,
        openness: form.openness,
        conscientiousness: form.conscientiousness,
        extraversion: form.extraversion,
        agreeableness: form.agreeableness,
        neuroticism: form.neuroticism,
        personality_traits: form.personality_traits,
        values: form.values,
        fears: form.fears,
        money: form.money,
        goals,
        schedule,
      };
      await createAgent(worldId, data);
      onClose();
    } catch (err) {
      console.error('Failed to create agent:', err);
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-echo-card border border-echo-border rounded-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-echo-card border-b border-echo-border p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-echo-cyan" />
            <h2 className="text-xl font-bold text-gray-100">Create Synthetic Person</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Identity */}
          <section>
            <h3 className="text-sm font-semibold text-echo-cyan uppercase tracking-wider mb-3">Identity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-echo-darker border border-echo-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-echo-cyan focus:outline-none" placeholder="e.g., Sarah Chen" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Age</label>
                <input type="number" value={form.age} onChange={e => setForm(prev => ({ ...prev, age: parseInt(e.target.value) || 25 }))}
                  className="w-full bg-echo-darker border border-echo-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-echo-cyan focus:outline-none" min={1} max={120} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Occupation *</label>
                <input type="text" value={form.occupation} onChange={e => setForm(prev => ({ ...prev, occupation: e.target.value }))}
                  className="w-full bg-echo-darker border border-echo-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-echo-cyan focus:outline-none" placeholder="e.g., Software Engineer" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Home Location</label>
                <select value={form.home_location_id} onChange={e => setForm(prev => ({ ...prev, home_location_id: e.target.value }))}
                  className="w-full bg-echo-darker border border-echo-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-echo-cyan focus:outline-none">
                  {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs text-gray-400 mb-1">Bio</label>
              <textarea value={form.bio} onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full bg-echo-darker border border-echo-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-echo-cyan focus:outline-none resize-none" rows={2}
                placeholder="Brief background..." />
            </div>
          </section>

          {/* Personality Big Five */}
          <section>
            <h3 className="text-sm font-semibold text-echo-cyan uppercase tracking-wider mb-3">Personality (Big Five)</h3>
            {(['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'] as const).map(trait => (
              <div key={trait} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-gray-400 w-32 capitalize">{trait}</span>
                <input type="range" min={0} max={1} step={0.05} value={form[trait]}
                  onChange={e => setForm(prev => ({ ...prev, [trait]: parseFloat(e.target.value) }))}
                  className="flex-1 accent-echo-cyan h-1" />
                <span className="text-xs text-gray-300 w-8 text-right">{form[trait].toFixed(2)}</span>
              </div>
            ))}
          </section>

          {/* Tags: Traits, Values, Fears */}
          {([
            { field: 'personality_traits' as const, label: 'Traits', input: 'traits' as const, placeholder: 'e.g., ambitious, curious' },
            { field: 'values' as const, label: 'Values', input: 'values' as const, placeholder: 'e.g., honesty, family' },
            { field: 'fears' as const, label: 'Fears', input: 'fears' as const, placeholder: 'e.g., rejection, failure' },
          ]).map(({ field, label, input, placeholder }) => (
            <section key={field}>
              <h3 className="text-sm font-semibold text-echo-cyan uppercase tracking-wider mb-2">{label}</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {form[field].map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-echo-darker border border-echo-border rounded-full px-3 py-1 text-xs text-gray-300">
                    {tag}
                    <button onClick={() => removeTag(field, i)} className="text-gray-500 hover:text-red-400"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={tagInput[input]} onChange={e => setTagInput(prev => ({ ...prev, [input]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(field, input))}
                  className="flex-1 bg-echo-darker border border-echo-border rounded-lg px-3 py-1.5 text-xs text-gray-100 focus:border-echo-cyan focus:outline-none" placeholder={placeholder} />
                <button onClick={() => addTag(field, input)} className="px-3 py-1.5 bg-echo-border rounded-lg text-xs text-gray-300 hover:bg-echo-cyan/20 hover:text-echo-cyan">Add</button>
              </div>
            </section>
          ))}

          {/* Money */}
          <section>
            <h3 className="text-sm font-semibold text-echo-cyan uppercase tracking-wider mb-2">Initial Money</h3>
            <input type="number" value={form.money} onChange={e => setForm(prev => ({ ...prev, money: parseFloat(e.target.value) || 0 }))}
              className="w-40 bg-echo-darker border border-echo-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-echo-cyan focus:outline-none" min={0} step={100} />
          </section>

          {/* Goals */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-echo-cyan uppercase tracking-wider">Goals</h3>
              <button onClick={() => setGoals([...goals, { description: '', priority: 0.5, motivation: '' }])}
                className="text-xs text-echo-cyan hover:text-echo-cyan/80 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Goal</button>
            </div>
            {goals.map((goal, i) => (
              <div key={i} className="flex gap-2 mb-2 items-start">
                <input type="text" value={goal.description} onChange={e => { const g = [...goals]; g[i] = { ...g[i], description: e.target.value }; setGoals(g); }}
                  className="flex-1 bg-echo-darker border border-echo-border rounded-lg px-3 py-1.5 text-xs text-gray-100 focus:border-echo-cyan focus:outline-none" placeholder="Goal description" />
                <input type="range" min={0} max={1} step={0.1} value={goal.priority}
                  onChange={e => { const g = [...goals]; g[i] = { ...g[i], priority: parseFloat(e.target.value) }; setGoals(g); }}
                  className="w-20 accent-echo-amber" title={`Priority: ${goal.priority}`} />
                <button onClick={() => setGoals(goals.filter((_, j) => j !== i))} className="text-gray-500 hover:text-red-400 mt-1"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </section>

          {/* Schedule */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-echo-cyan uppercase tracking-wider">Daily Schedule</h3>
              <button onClick={() => setSchedule([...schedule, { time_of_day: '12:00', activity: '', priority: 0.5 }])}
                className="text-xs text-echo-cyan hover:text-echo-cyan/80 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Entry</button>
            </div>
            {schedule.map((entry, i) => (
              <div key={i} className="flex gap-2 mb-1.5 items-center">
                <input type="time" value={entry.time_of_day} onChange={e => { const s = [...schedule]; s[i] = { ...s[i], time_of_day: e.target.value }; setSchedule(s); }}
                  className="bg-echo-darker border border-echo-border rounded px-2 py-1 text-xs text-gray-100 focus:border-echo-cyan focus:outline-none w-24" />
                <input type="text" value={entry.activity} onChange={e => { const s = [...schedule]; s[i] = { ...s[i], activity: e.target.value }; setSchedule(s); }}
                  className="flex-1 bg-echo-darker border border-echo-border rounded px-2 py-1 text-xs text-gray-100 focus:border-echo-cyan focus:outline-none" placeholder="Activity" />
                <button onClick={() => setSchedule(schedule.filter((_, j) => j !== i))} className="text-gray-500 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-echo-card border-t border-echo-border p-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={creating || !form.name.trim() || !form.occupation.trim()}
            className="px-6 py-2 bg-echo-cyan text-black font-medium rounded-lg hover:bg-echo-cyan/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            {creating ? 'Creating...' : 'Create Person'}
          </button>
        </div>
      </div>
    </div>
  );
}
