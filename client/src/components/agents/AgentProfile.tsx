import React from 'react';
import { Agent } from '../../api/types';
import { X, MapPin, Briefcase, Brain, Target, Clock, DollarSign, Heart } from 'lucide-react';
import ProgressBar from '../common/ProgressBar';

interface AgentProfileProps {
  agent: Agent;
  onClose: () => void;
  locationName?: string;
}

export default function AgentProfile({ agent, onClose, locationName }: AgentProfileProps) {
  const moodColor = agent.mood > 0.6 ? 'text-green-400' : agent.mood > 0.3 ? 'text-yellow-400' : 'text-red-400';
  const moodLabel = agent.mood > 0.7 ? 'Happy' : agent.mood > 0.5 ? 'Content' : agent.mood > 0.3 ? 'Neutral' : agent.mood > 0.1 ? 'Stressed' : 'Distressed';

  return (
    <div className="bg-echo-card border border-echo-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-echo-cyan/10 to-echo-amber/5 p-6 border-b border-echo-border">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">{agent.name}</h2>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {agent.occupation}</span>
              <span>Age {agent.age}</span>
              {locationName && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {locationName}</span>}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300"><X className="w-5 h-5" /></button>
        </div>
        {agent.bio && <p className="text-sm text-gray-400 mt-3">{agent.bio}</p>}

        {/* Current Activity */}
        {agent.current_activity && (
          <div className="mt-4 bg-echo-darker/60 rounded-lg p-3 border border-echo-border/50">
            <div className="text-xs text-echo-cyan uppercase tracking-wider mb-1">Current Activity</div>
            <div className="text-sm text-gray-200">{agent.current_activity}</div>
            {agent.current_activity_reason && (
              <div className="text-xs text-gray-500 mt-1 italic">Why: {agent.current_activity_reason}</div>
            )}
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* State */}
        <section>
          <h3 className="text-xs font-semibold text-echo-cyan uppercase tracking-wider mb-3 flex items-center gap-2">
            <Heart className="w-3.5 h-3.5" /> Current State
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <ProgressBar label="Energy" value={agent.energy} color="bg-green-500" />
            <ProgressBar label="Hunger" value={agent.hunger} color="bg-orange-500" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Mood</span>
              <span className={`text-xs font-medium ${moodColor}`}>{moodLabel} ({(agent.mood * 100).toFixed(0)}%)</span>
            </div>
            <ProgressBar label="Stress" value={agent.stress} color="bg-red-500" />
            <ProgressBar label="Social Need" value={agent.social_need} color="bg-purple-500" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Money</span>
              <span className="text-xs font-medium text-echo-amber">${agent.money.toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* Personality */}
        <section>
          <h3 className="text-xs font-semibold text-echo-cyan uppercase tracking-wider mb-3 flex items-center gap-2">
            <Brain className="w-3.5 h-3.5" /> Personality
          </h3>
          <div className="space-y-2">
            {[
              { label: 'Openness', value: agent.openness },
              { label: 'Conscientiousness', value: agent.conscientiousness },
              { label: 'Extraversion', value: agent.extraversion },
              { label: 'Agreeableness', value: agent.agreeableness },
              { label: 'Neuroticism', value: agent.neuroticism },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-28">{label}</span>
                <div className="flex-1 h-1.5 bg-echo-darker rounded-full overflow-hidden">
                  <div className="h-full bg-echo-cyan rounded-full transition-all" style={{ width: `${value * 100}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{(value * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
          {agent.personality_traits.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {agent.personality_traits.map(t => (
                <span key={t} className="px-2 py-0.5 bg-echo-cyan/10 text-echo-cyan text-xs rounded-full border border-echo-cyan/20">{t}</span>
              ))}
            </div>
          )}
        </section>

        {/* Goals */}
        {agent.goals && agent.goals.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-echo-cyan uppercase tracking-wider mb-3 flex items-center gap-2">
              <Target className="w-3.5 h-3.5" /> Goals
            </h3>
            <div className="space-y-2">
              {agent.goals.map(goal => (
                <div key={goal.id} className="bg-echo-darker rounded-lg p-3 border border-echo-border/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-200">{goal.description}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      goal.status === 'active' ? 'bg-echo-cyan/10 text-echo-cyan' :
                      goal.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                    }`}>{goal.status}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-echo-card rounded-full overflow-hidden">
                      <div className="h-full bg-echo-amber rounded-full" style={{ width: `${goal.progress * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">P: {(goal.priority * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Schedule */}
        {agent.schedule && agent.schedule.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-echo-cyan uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Daily Schedule
            </h3>
            <div className="space-y-1">
              {agent.schedule.sort((a, b) => a.time_of_day.localeCompare(b.time_of_day)).map(entry => (
                <div key={entry.id} className="flex items-center gap-3 py-1">
                  <span className="text-xs text-echo-amber font-mono w-12">{entry.time_of_day}</span>
                  <div className="w-1.5 h-1.5 bg-echo-border rounded-full" />
                  <span className="text-sm text-gray-300">{entry.activity}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Values & Fears */}
        <div className="grid grid-cols-2 gap-4">
          {agent.values.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">Values</h3>
              <div className="flex flex-wrap gap-1.5">
                {agent.values.map(v => <span key={v} className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">{v}</span>)}
              </div>
            </section>
          )}
          {agent.fears.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Fears</h3>
              <div className="flex flex-wrap gap-1.5">
                {agent.fears.map(f => <span key={f} className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20">{f}</span>)}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
