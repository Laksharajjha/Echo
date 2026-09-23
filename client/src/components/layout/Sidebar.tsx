import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Globe, Users, Zap, Heart, Clock, Terminal, Settings } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useSimulationStore } from '../../stores/simulationStore';

export default function Sidebar() {
  const { worldId } = useParams();
  const { sidebarOpen } = useUIStore();
  const { isRunning } = useSimulationStore();

  const links = [
    { to: `/world/${worldId}`, icon: Globe, label: 'World Map' },
    { to: `/world/${worldId}/people`, icon: Users, label: 'People' },
    { to: `/world/${worldId}/events`, icon: Zap, label: 'Events' },
    { to: `/world/${worldId}/relationships`, icon: Heart, label: 'Relationships' },
    { to: `/world/${worldId}/timeline`, icon: Clock, label: 'Timeline' },
    { to: `/world/${worldId}/console`, icon: Terminal, label: 'God Console' },
    { to: `/world/${worldId}/settings`, icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-full w-64 bg-echo-card border-r border-echo-border flex flex-col transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-4 border-b border-echo-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-echo-cyan to-echo-amber flex items-center justify-center font-bold text-black">
            E
          </div>
          <span className="font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-echo-cyan to-echo-amber">ECHO</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === `/world/${worldId}`}
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-echo-cyan/10 text-echo-cyan' 
                  : 'text-gray-400 hover:text-gray-100 hover:bg-echo-darker'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-echo-border flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${isRunning ? 'bg-green-500 shadow-green-500/50 animate-pulse' : 'bg-echo-amber shadow-echo-amber/50'}`} />
        <span className="text-sm font-medium text-gray-400">{isRunning ? 'Simulation Running' : 'Simulation Paused'}</span>
      </div>
    </aside>
  );
}
