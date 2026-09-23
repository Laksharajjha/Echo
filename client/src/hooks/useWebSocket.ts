import { useEffect, useRef } from 'react';
import { WsClient } from '../api/ws';

export function useWebSocket(worldId: string | undefined, onMessage: (data: any) => void) {
  const wsRef = useRef<WsClient | null>(null);

  useEffect(() => {
    if (!worldId) return;

    const ws = new WsClient(worldId);
    wsRef.current = ws;
    ws.connect();
    
    const unsubscribe = ws.onMessage(onMessage);

    return () => {
      unsubscribe();
      ws.disconnect();
    };
  }, [worldId, onMessage]);

  return {
    send: (data: any) => wsRef.current?.send(data)
  };
}
