import React from 'react';
import { useParams } from 'react-router-dom';
import { useWorld } from '../hooks/useWorld';

export default function PeoplePage() {
  const { worldId } = useParams<{ worldId: string }>();
  const { currentWorld } = useWorld(worldId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">People in {currentWorld?.name}</h1>
      <p className="text-gray-400">Agent list coming soon.</p>
    </div>
  );
}
