type MessageHandler = (data: any) => void;

export class WsClient {
  private socket: WebSocket | null = null;
  private url: string;
  private handlers: Set<MessageHandler> = new Set();
  private reconnectTimer: any = null;
  
  constructor(worldId: string) {
    const baseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
    this.url = `${baseUrl}/ws/worlds/${worldId}`;
  }

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return;
    
    this.socket = new WebSocket(this.url);
    
    this.socket.onopen = () => {
      console.log('WS Connected');
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    };
    
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handlers.forEach(handler => handler(data));
      } catch (e) {
        console.error('Failed to parse WS message', e);
      }
    };
    
    this.socket.onclose = () => {
      console.log('WS Disconnected, scheduling reconnect...');
      this.reconnectTimer = setTimeout(() => this.connect(), 3000);
    };
    
    this.socket.onerror = (err) => {
      console.error('WS Error:', err);
      this.socket?.close();
    };
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.socket?.close();
    this.socket = null;
  }

  onMessage(handler: MessageHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  send(data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }
}
