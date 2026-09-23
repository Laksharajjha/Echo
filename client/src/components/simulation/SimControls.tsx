import React from 'react';
import { Play, Pause, SkipForward, FastForward } from 'lucide-react';
import { useSimulationStore } from '../../stores/simulationStore';
import { useParams } from 'react-router-dom';

export default function SimControls() {
  const { worldId } = useParams();
  const { isRunning, sendCommand } = useSimulationStore();

  const handleCommand = (action: 'play' | 'pause' | 'step') => {
    if (worldId) {
      sendCommand(worldId, { action });
    }
  };

  return (
    <div className="flex items-center gap-1 bg-echo-darker border border-echo-border rounded-lg p-1">
      <button
        onClick={() => handleCommand('play')}
        className={`p-1.5 rounded ${isRunning ? 'text-green-400 bg-green-500/10' : 'text-gray-400 hover:text-green-400 hover:bg-echo-card'}`}
        title="Play"
      >
        <Play className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleCommand('pause')}
        className={`p-1.5 rounded ${!isRunning ? 'text-echo-amber bg-echo-amber/10' : 'text-gray-400 hover:text-echo-amber hover:bg-echo-card'}`}
        title="Pause"
      >
        <Pause className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleCommand('step')}
        className="p-1.5 rounded text-gray-400 hover:text-echo-cyan hover:bg-echo-card"
        title="Step Forward"
      >
        <SkipForward className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-echo-border mx-1"></div>
      <button
        className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-echo-card flex items-center gap-1 text-xs font-medium"
        title="Speed"
      >
        <FastForward className="w-3 h-3" />
        1x
      </button>
    </div>
  );
}
