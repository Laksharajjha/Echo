import React, { useRef, useEffect } from 'react';
import { Event } from '../../api/types';
import { Zap, MapPin, User } from 'lucide-react';

interface EventFeedProps {
  events: Event[];
  agentNames?: Record<string, string>;
  locationNames?: Record<string, string>;
}

function importanceColor(importance: number): string {
  if (importance >= 0.8) return 'border-red-500/50 bg-red-500/5';
  if (importance >= 0.6) return 'border-echo-amber/50 bg-echo-amber/5';
  if (importance >= 0.4) return 'border-echo-cyan/30 bg-echo-cyan/5';
  return 'border-echo-border bg-transparent';
}

function importanceDot(importance: number): string {
  if (importance >= 0.8) return 'bg-red-500';
  if (importance >= 0.6) return 'bg-echo-amber';
  if (importance >= 0.4) return 'bg-echo-cyan';
  return 'bg-gray-600';
}

function formatTime(timeStr: string): string {
  try {
    const d = new Date(timeStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return timeStr;
  }
}

export default function EventFeed({ events, agentNames = {}, locationNames = {} }: EventFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events.length]);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
        <Zap className="w-8 h-8 mb-3 opacity-30" />
        <p className="text-sm">No events yet. Start the simulation to see what happens.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto max-h-full">
      {events.map(event => (
        <div
          key={event.id}
          className={`rounded-lg p-3 border transition-colors ${importanceColor(event.importance)}`}
        >
          <div className="flex items-start gap-2">
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${importanceDot(event.importance)}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200">{event.description}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                <span className="font-mono">{formatTime(event.simulation_time)}</span>
                <span className="capitalize bg-echo-darker px-1.5 py-0.5 rounded text-gray-400">{event.event_type.replace('_', ' ')}</span>
                {event.source_agent_id && agentNames[event.source_agent_id] && (
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{agentNames[event.source_agent_id]}</span>
                )}
                {event.location_id && locationNames[event.location_id] && (
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{locationNames[event.location_id]}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
