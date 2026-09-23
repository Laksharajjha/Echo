import React from 'react';
import { Menu } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useWorldStore } from '../../stores/worldStore';
import { useSimulationStore } from '../../stores/simulationStore';
import SimControls from '../simulation/SimControls';

export default function Header() {
  const { toggleSidebar } = useUIStore();
  const { currentWorld } = useWorldStore();
  const { status, isRunning } = useSimulationStore();

  return (
    <header className="h-16 border-b border-echo-border bg-echo-card/80 backdrop-blur flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-echo-darker rounded text-gray-400 hover:text-gray-100">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-lg">{currentWorld?.name || 'Loading...'}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-echo-darker rounded border border-echo-border">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Tick</span>
          <span className="font-mono text-sm text-echo-cyan">{status?.current_tick || 0}</span>
          <span className="text-gray-600 mx-1">|</span>
          <span className="font-mono text-sm">{status?.current_time || '00:00'}</span>
        </div>

        {/* Sim Controls */}
        <div className="flex gap-2 text-sm text-gray-500">
          <SimControls />
        </div>
      </div>
    </header>
  );
}
