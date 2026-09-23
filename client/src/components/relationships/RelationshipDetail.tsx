import React from 'react';
import { Relationship } from '../../api/types';
import ProgressBar from '../common/ProgressBar';

interface RelationshipDetailProps {
  relationship: Relationship;
  agentNames: Record<string, string>;
}

export default function RelationshipDetail({ relationship: r, agentNames }: RelationshipDetailProps) {
  return (
    <div className="bg-echo-card border border-echo-border rounded-xl p-6">
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="text-lg font-semibold text-gray-100">{agentNames[r.agent_id] || 'Unknown'}</span>
        <span className="text-echo-cyan">↔</span>
        <span className="text-lg font-semibold text-gray-100">{agentNames[r.target_agent_id] || 'Unknown'}</span>
      </div>

      <div className="inline-block mx-auto mb-4 px-3 py-1 rounded-full text-xs font-medium capitalize bg-echo-darker border border-echo-border text-gray-300">
        {r.relationship_type}
      </div>

      <div className="space-y-3">
        <ProgressBar label="Trust" value={r.trust} color="bg-green-500" showPercent />
        <ProgressBar label="Affinity" value={r.affinity} color="bg-blue-500" showPercent />
        <ProgressBar label="Respect" value={r.respect} color="bg-purple-500" showPercent />
        <ProgressBar label="Familiarity" value={r.familiarity} color="bg-echo-cyan" showPercent />
        <ProgressBar label="Conflict" value={r.conflict} color="bg-red-500" showPercent />
        <ProgressBar label="Prof. Dependency" value={r.professional_dependency} color="bg-echo-amber" showPercent />
      </div>
    </div>
  );
}
