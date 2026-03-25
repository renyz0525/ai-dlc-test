import type { SSEHandlers } from '@/types';

export class SSEManager {
  private eventSource: EventSource | null = null;
  private retryCount = 0;
  private maxRetries = 10;
  private retryInterval = 3000;
  private retryTimer: number | null = null;
  private storeId: string | null = null;
  private handlers: SSEHandlers | null = null;

  connect(storeId: string, handlers: SSEHandlers): void {
    this.storeId = storeId;
    this.handlers = handlers;
    this.retryCount = 0;
    this.createConnection();
  }

  disconnect(): void {
    if (this.retryTimer !== null) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.handlers?.onConnectionChange('disconnected');
  }

  getConnectionState(): 'connected' | 'reconnecting' | 'disconnected' {
    if (!this.eventSource) return 'disconnected';
    if (this.eventSource.readyState === EventSource.OPEN) return 'connected';
    if (this.eventSource.readyState === EventSource.CONNECTING) return 'reconnecting';
    return 'disconnected';
  }

  private createConnection(): void {
    if (!this.storeId || !this.handlers) return;

    const token = localStorage.getItem('token');
    const url = `${import.meta.env.VITE_API_BASE_URL}/stores/${this.storeId}/events?token=${token}`;

    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      this.retryCount = 0;
      this.handlers?.onConnectionChange('connected');
    };

    this.eventSource.addEventListener('order:created', (event) => {
      this.handlers?.onOrderCreated(JSON.parse(event.data));
    });

    this.eventSource.addEventListener('order:statusChanged', (event) => {
      this.handlers?.onOrderStatusChanged(JSON.parse(event.data));
    });

    this.eventSource.addEventListener('order:deleted', (event) => {
      this.handlers?.onOrderDeleted(JSON.parse(event.data));
    });

    this.eventSource.addEventListener('table:completed', (event) => {
      this.handlers?.onTableCompleted(JSON.parse(event.data));
    });

    this.eventSource.onerror = () => {
      this.eventSource?.close();
      this.eventSource = null;

      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        this.handlers?.onConnectionChange('reconnecting');
        this.retryTimer = window.setTimeout(() => {
          this.createConnection();
        }, this.retryInterval);
      } else {
        this.handlers?.onConnectionChange('disconnected');
      }
    };
  }
}

export const sseManager = new SSEManager();
