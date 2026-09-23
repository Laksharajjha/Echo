import React, { useEffect, useRef, useMemo } from 'react';
import cytoscape from 'cytoscape';
import { Location, LocationConnection, Agent } from '../../api/types';
import { useUiStore } from '../../stores/uiStore';

interface WorldMapProps {
  locations: (Location & { connections?: LocationConnection[] })[];
  agents: Agent[];
}

export default function WorldMap({ locations, agents }: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const { setSelectedLocation, selectedLocationId } = useUiStore();

  // Count agents per location
  const agentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    agents.forEach(a => {
      if (a.current_location_id) {
        counts[a.current_location_id] = (counts[a.current_location_id] || 0) + 1;
      }
    });
    return counts;
  }, [agents]);

  useEffect(() => {
    if (!containerRef.current || locations.length === 0) return;

    const nodes = locations.map((loc, i) => ({
      data: {
        id: loc.id,
        label: `${loc.name}\n${agentCounts[loc.id] ? `👥 ${agentCounts[loc.id]}` : ''}`,
        type: loc.location_type,
        agentCount: agentCounts[loc.id] || 0,
      },
      position: loc.x_pos && loc.y_pos ? { x: loc.x_pos * 100, y: loc.y_pos * 100 } : undefined,
    }));

    const edges: cytoscape.ElementDefinition[] = [];
    const seenEdges = new Set<string>();
    locations.forEach(loc => {
      (loc.connections || []).forEach(conn => {
        const edgeKey = [loc.id, conn.to_location_id].sort().join('-');
        if (!seenEdges.has(edgeKey)) {
          seenEdges.add(edgeKey);
          edges.push({
            data: {
              id: `edge-${edgeKey}`,
              source: loc.id,
              target: conn.to_location_id,
              travelTime: conn.travel_time_minutes,
            }
          });
        }
      });
    });

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: [...nodes, ...edges],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#1e1e2e',
            'border-color': '#06b6d4',
            'border-width': 2,
            'label': 'data(label)',
            'text-wrap': 'wrap',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#e5e7eb',
            'font-size': '11px',
            'font-family': 'Inter, system-ui, sans-serif',
            'width': 90,
            'height': 90,
            'shape': 'roundrectangle',
            'text-max-width': '80px',
          }
        },
        {
          selector: 'node[?agentCount]',
          style: {
            'border-color': '#f59e0b',
            'border-width': 3,
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-color': '#06b6d4',
            'border-width': 4,
            'background-color': '#06b6d4',
            'background-opacity': 0.15,
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#374151',
            'curve-style': 'bezier',
            'line-style': 'solid',
          }
        },
      ],
      layout: {
        name: locations.some(l => l.x_pos && l.y_pos) ? 'preset' : 'cose',
        animate: true,
        animationDuration: 500,
        nodeRepulsion: () => 8000,
        idealEdgeLength: () => 120,
        padding: 50,
      } as any,
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
    });

    cyRef.current.on('tap', 'node', (e) => {
      setSelectedLocation(e.target.id());
    });

    cyRef.current.on('tap', (e) => {
      if (e.target === cyRef.current) {
        setSelectedLocation(null);
      }
    });

    return () => {
      cyRef.current?.destroy();
    };
  }, [locations, agentCounts, setSelectedLocation]);

  // Highlight selected node
  useEffect(() => {
    if (!cyRef.current) return;
    cyRef.current.nodes().unselect();
    if (selectedLocationId) {
      cyRef.current.getElementById(selectedLocationId).select();
    }
  }, [selectedLocationId]);

  if (locations.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
        <p className="text-lg mb-2">No locations yet</p>
        <p className="text-sm">Add locations to see your world map</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-xl"
      style={{ minHeight: '400px' }}
    />
  );
}
