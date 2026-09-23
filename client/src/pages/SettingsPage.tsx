import React from 'react';
import { useParams } from 'react-router-dom';
import { useWorld } from '../hooks/useWorld';

export default function SettingsPage() {
  const { worldId } = useParams<{ worldId: string }>();
  const { currentWorld } = useWorld(worldId);

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">World Settings: {currentWorld?.name}</h1>
      
      <div className="bg-echo-card border border-echo-border rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tick Duration (minutes)</label>
            <input type="number" className="w-full bg-echo-darker border border-echo-border rounded p-2" value={currentWorld?.tick_duration_minutes || 0} readOnly />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Simulation Style</label>
            <input type="text" className="w-full bg-echo-darker border border-echo-border rounded p-2 capitalize" value={currentWorld?.simulation_style || ''} readOnly />
          </div>
        </div>
      </div>

      <div className="bg-echo-card border border-red-900/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-red-500 mb-4">Danger Zone</h2>
        <p className="text-gray-400 mb-4 text-sm">Deleting a world will permanently remove all agents, locations, events, and history.</p>
        <button className="bg-red-500/10 text-red-500 border border-red-500/50 rounded px-4 py-2 hover:bg-red-500/20 transition-colors">
          Delete World
        </button>
      </div>
    </div>
  );
}
