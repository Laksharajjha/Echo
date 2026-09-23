import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWorldStore } from '../stores/worldStore';
import { Globe, Plus } from 'lucide-react';

export default function HomePage() {
  const { worlds, fetchWorlds, loading } = useWorldStore();

  useEffect(() => {
    fetchWorlds();
  }, [fetchWorlds]);

  return (
    <div className="min-h-screen bg-echo-dark text-gray-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-echo-cyan to-echo-amber mb-4">
            ECHO
          </h1>
          <p className="text-xl text-gray-400">Simulation Control Platform</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-500">Loading worlds...</div>
          ) : (
            <>
              {worlds.map((world) => (
                <Link
                  key={world.id}
                  to={`/world/${world.id}`}
                  className="bg-echo-card border border-echo-border rounded-xl p-6 hover:border-echo-cyan transition-colors flex flex-col gap-4 group"
                >
                  <div className="flex items-start justify-between">
                    <h2 className="text-xl font-semibold group-hover:text-echo-cyan transition-colors">{world.name}</h2>
                    <Globe className="w-6 h-6 text-gray-500 group-hover:text-echo-cyan transition-colors" />
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-3">{world.description}</p>
                  <div className="mt-auto pt-4 border-t border-echo-border flex items-center justify-between text-xs text-gray-500">
                    <span>Tick: {world.current_tick}</span>
                    <span className="capitalize">{world.simulation_style}</span>
                  </div>
                </Link>
              ))}
              
              <button 
                className="bg-transparent border-2 border-dashed border-echo-border rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:text-echo-cyan hover:border-echo-cyan transition-colors min-h-[200px]"
                onClick={() => alert("Create World Wizard coming soon")}
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="font-medium">Create New World</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
