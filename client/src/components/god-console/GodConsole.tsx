import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2 } from 'lucide-react';

interface GodConsoleMessage {
  type: 'command' | 'response' | 'system' | 'error';
  content: string;
  timestamp: string;
}

interface GodConsoleProps {
  worldId: string;
  onCommand?: (command: string) => Promise<string>;
}

const WELCOME_MSG: GodConsoleMessage = {
  type: 'system',
  content: `ECHO God Console v0.1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You have absolute power over this world.

Commands you can try:
  • "What is happening in the world?"
  • "Where is [agent name]?"
  • "Inject event: power outage"
  • "Advance 10 ticks"
  • "Pause simulation"
  • "Show all agents"
  • "Show relationships"

Type a command below.`,
  timestamp: new Date().toISOString(),
};

export default function GodConsole({ worldId, onCommand }: GodConsoleProps) {
  const [messages, setMessages] = useState<GodConsoleMessage[]>([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const now = new Date().toISOString();
    setMessages(prev => [...prev, { type: 'command', content: cmd, timestamp: now }]);
    setInput('');
    setProcessing(true);

    try {
      if (onCommand) {
        const response = await onCommand(cmd);
        setMessages(prev => [...prev, { type: 'response', content: response, timestamp: new Date().toISOString() }]);
      } else {
        // Default handler — parse simple commands locally
        const lower = cmd.toLowerCase();
        let response = '';
        if (lower.includes('pause')) {
          response = '⏸ Simulation paused.';
        } else if (lower.includes('play') || lower.includes('resume')) {
          response = '▶ Simulation resumed.';
        } else if (lower.startsWith('advance')) {
          const num = parseInt(cmd.replace(/\D/g, '')) || 1;
          response = `⏩ Advanced ${num} tick(s).`;
        } else {
          response = `[God Console] Command received: "${cmd}"\n\nNote: Full God Console with LLM interpretation is coming in Phase 6. For now, use the UI controls for simulation commands.`;
        }
        setMessages(prev => [...prev, { type: 'response', content: response, timestamp: new Date().toISOString() }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { type: 'error', content: `Error: ${err.message}`, timestamp: new Date().toISOString() }]);
    } finally {
      setProcessing(false);
    }
  };

  const typeColor = (type: GodConsoleMessage['type']) => {
    switch (type) {
      case 'command': return 'text-echo-cyan';
      case 'response': return 'text-gray-300';
      case 'system': return 'text-gray-500';
      case 'error': return 'text-red-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-echo-darker rounded-xl border border-echo-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-echo-border bg-echo-card">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-echo-cyan" />
          <span className="text-sm font-medium text-gray-200">God Console</span>
          <span className="text-xs text-gray-600 font-mono">~/world/{worldId.slice(0, 8)}</span>
        </div>
        <button
          onClick={() => setMessages([WELCOME_MSG])}
          className="text-gray-600 hover:text-gray-400 transition-colors"
          title="Clear console"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-3">
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.type === 'command' && (
              <div className="flex items-start gap-2">
                <span className="text-echo-amber select-none">{'>'}</span>
                <span className={typeColor(msg.type)}>{msg.content}</span>
              </div>
            )}
            {msg.type !== 'command' && (
              <pre className={`whitespace-pre-wrap ${typeColor(msg.type)} leading-relaxed`}>{msg.content}</pre>
            )}
          </div>
        ))}
        {processing && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-echo-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-echo-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-echo-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs">Processing...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-echo-border p-3 flex items-center gap-2 bg-echo-card">
        <span className="text-echo-amber font-mono text-sm select-none">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command..."
          disabled={processing}
          className="flex-1 bg-transparent text-gray-200 text-sm font-mono focus:outline-none placeholder-gray-600 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={processing || !input.trim()}
          className="text-echo-cyan hover:text-echo-cyan/80 disabled:text-gray-600 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
