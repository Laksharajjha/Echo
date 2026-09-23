import React from 'react';

export default function GodConsolePage() {
  return (
    <div className="h-full bg-echo-darker p-4 font-mono text-sm">
      <div className="text-echo-cyan mb-4">ECHO God Console v0.1 — You have absolute power over this world.</div>
      <div className="text-gray-500 mb-2">{'>'} type 'help' for commands (Coming Soon)</div>
      <div className="flex items-center text-gray-300">
        <span className="mr-2 text-echo-amber">{'>'}</span>
        <input type="text" className="bg-transparent outline-none flex-1" autoFocus disabled />
      </div>
    </div>
  );
}
