import React from 'react';
import { useParams } from 'react-router-dom';
import { useWorld } from '../hooks/useWorld';

export default function WorldPage() {
  const { worldId } = useParams<{ worldId: string }>();
  const { currentWorld } = useWorld(worldId);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* Real implementation will have WorldMap and LocationNode */}
      <h1 className="text-2xl text-gray-400">Map View for {currentWorld?.name} (Coming Soon)</h1>
    </div>
  );
}
