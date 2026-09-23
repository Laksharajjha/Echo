import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUIStore } from '../../stores/uiStore';
import { useSimulation } from '../../hooks/useSimulation';

export default function AppShell() {
  const { worldId } = useParams<{ worldId: string }>();
  const { sidebarOpen } = useUIStore();
  
  // Connect to WS
  useSimulation(worldId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-echo-dark text-gray-100">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header />
        <main className="flex-1 overflow-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
