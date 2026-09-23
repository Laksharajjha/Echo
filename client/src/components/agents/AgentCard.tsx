import React from 'react';
import { Agent } from '../../api/types';
import ProgressBar from '../common/ProgressBar';

type AgentCardProps = {
  agent: Agent;
  onClick: () => void;
};

export default function AgentCard({ agent, onClick }: AgentCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-echo-card border border-echo-border rounded-xl p-4 hover:border-echo-cyan transition-colors cursor-pointer group flex flex-col gap-3"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-100 group-hover:text-echo-cyan transition-colors">{agent.name}</h3>
          <p className="text-xs text-gray-400">{agent.age}yo • {agent.occupation}</p>
        </div>
        <div className={`w-2.5 h-2.5 rounded-full ${agent.mood > 70 ? 'bg-green-500' : agent.mood > 30 ? 'bg-echo-amber' : 'bg-red-500'}`} />
      </div>

      <div className="space-y-2">
        <ProgressBar label="Energy" value={agent.energy} color="bg-echo-cyan" showValue={false} />
        <ProgressBar label="Social" value={agent.social_need} color="bg-purple-500" showValue={false} />
      </div>

      <div className="mt-auto pt-3 border-t border-echo-border">
        <div className="text-xs text-gray-400 truncate">
          <span className="font-medium text-gray-300">Doing:</span> {agent.current_activity || 'Idle'}
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-green-400 font-mono">${agent.money}</span>
          <span className="text-xs text-gray-500 truncate max-w-[100px]">{agent.current_location_id.substring(0, 8)}...</span>
        </div>
      </div>
    </div>
  );
}
