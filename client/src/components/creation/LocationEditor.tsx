import React, { useState } from 'react';
import { Location, LocationCreate } from '../../api/types';
import { api } from '../../api/client';
import { Plus, Link2, MapPin, Trash2 } from 'lucide-react';

interface LocationEditorProps {
  worldId: string;
  locations: Location[];
  onLocationsChange: () => void;
}

const LOCATION_TYPES = ['building', 'outdoor', 'residential', 'commercial', 'educational', 'transit', 'entertainment', 'medical'];

export default function LocationEditor({ worldId, locations, onLocationsChange }: LocationEditorProps) {
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('building');
  const [newDesc, setNewDesc] = useState('');
  const [connectFrom, setConnectFrom] = useState('');
  const [connectTo, setConnectTo] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAddLocation = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const data: LocationCreate = {
        name: newName,
        location_type: newType,
        description: newDesc,
        x_pos: Math.random() * 5,
        y_pos: Math.random() * 5,
      };
      await api.locations.create(worldId, data);
      setNewName('');
      setNewDesc('');
      onLocationsChange();
    } catch (err) {
      console.error('Failed to create location:', err);
    } finally {
      setAdding(false);
    }
  };

  const handleConnect = async () => {
    if (!connectFrom || !connectTo || connectFrom === connectTo) return;
    try {
      await api.locations.addConnection(worldId, connectFrom, connectTo, 5, true);
      setConnectFrom('');
      setConnectTo('');
      onLocationsChange();
    } catch (err) {
      console.error('Failed to connect locations:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.locations.delete(worldId, id);
      onLocationsChange();
    } catch (err) {
      console.error('Failed to delete location:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Location */}
      <div className="bg-echo-card border border-echo-border rounded-xl p-4">
        <h3 className="text-sm font-semibold text-echo-cyan uppercase tracking-wider mb-3 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" /> Add Location
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Location name"
            className="bg-echo-darker border border-echo-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-echo-cyan focus:outline-none" />
          <select value={newType} onChange={e => setNewType(e.target.value)}
            className="bg-echo-darker border border-echo-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-echo-cyan focus:outline-none">
            {LOCATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <input type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description (optional)"
          className="w-full mt-2 bg-echo-darker border border-echo-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-echo-cyan focus:outline-none" />
        <button onClick={handleAddLocation} disabled={adding || !newName.trim()}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-echo-cyan text-black font-medium rounded-lg text-sm hover:bg-echo-cyan/90 disabled:opacity-30 disabled:cursor-not-allowed">
          <Plus className="w-3.5 h-3.5" /> {adding ? 'Adding...' : 'Add Location'}
        </button>
      </div>

      {/* Connect Locations */}
      {locations.length >= 2 && (
        <div className="bg-echo-card border border-echo-border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-echo-cyan uppercase tracking-wider mb-3 flex items-center gap-2">
            <Link2 className="w-3.5 h-3.5" /> Connect Locations
          </h3>
          <div className="flex items-center gap-2">
            <select value={connectFrom} onChange={e => setConnectFrom(e.target.value)}
              className="flex-1 bg-echo-darker border border-echo-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-echo-cyan focus:outline-none">
              <option value="">From...</option>
              {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            <span className="text-gray-500">↔</span>
            <select value={connectTo} onChange={e => setConnectTo(e.target.value)}
              className="flex-1 bg-echo-darker border border-echo-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-echo-cyan focus:outline-none">
              <option value="">To...</option>
              {locations.filter(l => l.id !== connectFrom).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            <button onClick={handleConnect} disabled={!connectFrom || !connectTo}
              className="px-4 py-2 bg-echo-border rounded-lg text-sm text-gray-300 hover:bg-echo-cyan/20 hover:text-echo-cyan disabled:opacity-30 disabled:cursor-not-allowed">
              Connect
            </button>
          </div>
        </div>
      )}

      {/* Location List */}
      <div className="space-y-2">
        {locations.map(loc => (
          <div key={loc.id} className="bg-echo-card border border-echo-border rounded-lg p-3 flex items-center justify-between group">
            <div>
              <span className="text-sm font-medium text-gray-200">{loc.name}</span>
              <span className="ml-2 text-xs text-gray-500 capitalize">{loc.location_type}</span>
              {loc.description && <p className="text-xs text-gray-500 mt-0.5">{loc.description}</p>}
            </div>
            <button onClick={() => handleDelete(loc.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
