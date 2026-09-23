import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { Agent, Relationship } from '../../api/types';

interface RelationshipGraphProps {
  agents: Agent[];
  relationships: Relationship[];
  onSelectRelationship?: (r: Relationship) => void;
}

export default function RelationshipGraph({ agents, relationships, onSelectRelationship }: RelationshipGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!containerRef.current || agents.length === 0) return;

    const agentMap = new Map(agents.map(a => [a.id, a]));

    const nodes = agents.map(agent => ({
      data: {
        id: agent.id,
        label: agent.name,
        occupation: agent.occupation,
        mood: agent.mood,
      }
    }));

    const edges = relationships.map(r => {
      const strength = (r.trust + r.affinity + r.respect + r.familiarity) / 4;
      const isConflict = r.conflict > 0.5;
      return {
        data: {
          id: r.id,
          source: r.agent_id,
          target: r.target_agent_id,
          strength,
          conflict: r.conflict,
          trust: r.trust,
          isConflict,
          label: r.relationship_type !== 'neutral' ? r.relationship_type : '',
        }
      };
    });

    if (cyRef.current) cyRef.current.destroy();

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: [...nodes, ...edges],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#12121a',
            'border-color': '#06b6d4',
            'border-width': 2,
            'label': 'data(label)',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'color': '#d1d5db',
            'font-size': '11px',
            'font-family': 'Inter, system-ui, sans-serif',
            'width': 40,
            'height': 40,
            'text-margin-y': 8,
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 'mapData(strength, 0, 1, 1, 6)',
            'line-color': 'mapData(conflict, 0, 1, #22c55e, #ef4444)',
            'curve-style': 'bezier',
            'opacity': 0.7,
          }
        },
        {
          selector: 'edge[?isConflict]',
          style: {
            'line-style': 'dashed',
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-color': '#f59e0b',
            'border-width': 4,
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': '#f59e0b',
            'opacity': 1,
            'width': 4,
          }
        },
      ],
      layout: {
        name: 'cose',
        animate: true,
        animationDuration: 500,
        nodeRepulsion: () => 6000,
        idealEdgeLength: () => 150,
        padding: 40,
      } as any,
      userZoomingEnabled: true,
      userPanningEnabled: true,
    });

    cyRef.current.on('tap', 'edge', (e) => {
      const edgeData = e.target.data();
      const rel = relationships.find(r => r.id === edgeData.id);
      if (rel && onSelectRelationship) {
        onSelectRelationship(rel);
      }
    });

    return () => { cyRef.current?.destroy(); };
  }, [agents, relationships, onSelectRelationship]);

  if (agents.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        <p>No agents to show relationships for</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full rounded-xl" style={{ minHeight: '400px' }} />
  );
}
