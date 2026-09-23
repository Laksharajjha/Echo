import React from 'react';
import { useParams } from 'react-router-dom';
import { useWorld } from '../hooks/useWorld';

export default function RelationshipsPage() {
  const { worldId } = useParams<{ worldId: string }>();
  useWorld(worldId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Relationships</h1>
      <p className="text-gray-400">Relationship graph coming soon.</p>
    </div>
  );
}
