import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { SSEHandlers } from '@/types';

class MockEventSource {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSED = 2;

  url: string;
  readyState = MockEventSource.CONNECTING;
  onopen: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  private listeners: Record<string, ((event: MessageEvent) => void)[]> = {};

  constructor(url: string) {
    this.url = url;
    MockEventSource.instances.push(this);
  }

  addEventListener(type: string, listener: (event: MessageEvent) => void): void {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(listener);
  }

  close(): void {
    this.readyState = MockEventSource.CLOSED;
  }

  simulateOpen(): void {
    this.readyState = MockEventSource.OPEN;
    this.onopen?.(new Event('open'));
  }

  simulateError(): void {
    this.onerror?.(new Event('error'));
  }

  simulateEvent(type: string, data: unknown): void {
    const event = new MessageEvent(type, { data: JSON.stringify(data) });
    this.listeners[type]?.forEach((listener) => listener(event));
  }

  static instances: MockEventSource[] = [];
  static reset(): void {
    MockEventSource.instances = [];
  }
}

vi.stubGlobal('EventSource', MockEventSource);

function createMockHandlers(): SSEHandlers {
  return {
    onConnectionChange: vi.fn(),
    onOrderCreated: vi.fn(),
    onOrderStatusChanged: vi.fn(),
    onOrderDeleted: vi.fn(),
    onTableCompleted: vi.fn(),
  };
}

describe('SSEManager', () => {
  let SSEManager: typeof import('@/api/sse').SSEManager;
  let handlers: SSEHandlers;

  beforeEach(async () => {
    vi.useFakeTimers();
    MockEventSource.reset();
    localStorage.setItem('token', 'test-token');
    vi.resetModules();
    const mod = await import('@/api/sse');
    SSEManager = mod.SSEManager;
    handlers = createMockHandlers();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it('creates EventSource with correct URL on connect', () => {
    const manager = new SSEManager();
    manager.connect('store-1', handlers);

    expect(MockEventSource.instances).toHaveLength(1);
    expect(MockEventSource.instances[0].url).toContain('/stores/store-1/events');
    expect(MockEventSource.instances[0].url).toContain('token=test-token');
  });

  it('calls onConnectionChange with connected on open', () => {
    const manager = new SSEManager();
    manager.connect('store-1', handlers);

    MockEventSource.instances[0].simulateOpen();
    expect(handlers.onConnectionChange).toHaveBeenCalledWith('connected');
  });

  it('dispatches order:created events', () => {
    const manager = new SSEManager();
    manager.connect('store-1', handlers);

    const orderData = { orderId: 'order-1', tableId: 'table-1' };
    MockEventSource.instances[0].simulateEvent('order:created', orderData);
    expect(handlers.onOrderCreated).toHaveBeenCalledWith(orderData);
  });

  it('dispatches order:statusChanged events', () => {
    const manager = new SSEManager();
    manager.connect('store-1', handlers);

    const data = { orderId: 'order-1', status: 'preparing' };
    MockEventSource.instances[0].simulateEvent('order:statusChanged', data);
    expect(handlers.onOrderStatusChanged).toHaveBeenCalledWith(data);
  });

  it('dispatches order:deleted events', () => {
    const manager = new SSEManager();
    manager.connect('store-1', handlers);

    const data = { orderId: 'order-1' };
    MockEventSource.instances[0].simulateEvent('order:deleted', data);
    expect(handlers.onOrderDeleted).toHaveBeenCalledWith(data);
  });

  it('dispatches table:completed events', () => {
    const manager = new SSEManager();
    manager.connect('store-1', handlers);

    const data = { tableId: 'table-1' };
    MockEventSource.instances[0].simulateEvent('table:completed', data);
    expect(handlers.onTableCompleted).toHaveBeenCalledWith(data);
  });

  it('retries on error with reconnecting state', () => {
    const manager = new SSEManager();
    manager.connect('store-1', handlers);

    MockEventSource.instances[0].simulateError();
    expect(handlers.onConnectionChange).toHaveBeenCalledWith('reconnecting');

    vi.advanceTimersByTime(3000);
    expect(MockEventSource.instances).toHaveLength(2);
  });

  it('stops retrying after max retries', () => {
    const manager = new SSEManager();
    manager.connect('store-1', handlers);

    for (let i = 0; i < 10; i++) {
      MockEventSource.instances[MockEventSource.instances.length - 1].simulateError();
      vi.advanceTimersByTime(3000);
    }

    // 11th error - should not retry
    MockEventSource.instances[MockEventSource.instances.length - 1].simulateError();
    expect(handlers.onConnectionChange).toHaveBeenLastCalledWith('disconnected');
  });

  it('disconnects and cleans up', () => {
    const manager = new SSEManager();
    manager.connect('store-1', handlers);

    const es = MockEventSource.instances[0];
    manager.disconnect();

    expect(es.readyState).toBe(MockEventSource.CLOSED);
    expect(handlers.onConnectionChange).toHaveBeenCalledWith('disconnected');
  });

  it('clears retry timer on disconnect', () => {
    const manager = new SSEManager();
    manager.connect('store-1', handlers);

    MockEventSource.instances[0].simulateError();
    manager.disconnect();

    vi.advanceTimersByTime(3000);
    // Should not create a new connection after disconnect
    expect(MockEventSource.instances).toHaveLength(1);
  });

  it('returns correct connection state', () => {
    const manager = new SSEManager();
    expect(manager.getConnectionState()).toBe('disconnected');

    manager.connect('store-1', handlers);
    MockEventSource.instances[0].simulateOpen();
    expect(manager.getConnectionState()).toBe('connected');
  });

  it('resets retry count on successful connection', () => {
    const manager = new SSEManager();
    manager.connect('store-1', handlers);

    // Trigger some errors
    for (let i = 0; i < 5; i++) {
      MockEventSource.instances[MockEventSource.instances.length - 1].simulateError();
      vi.advanceTimersByTime(3000);
    }

    // Simulate successful reconnection
    MockEventSource.instances[MockEventSource.instances.length - 1].simulateOpen();

    // Should be able to retry again from 0
    for (let i = 0; i < 10; i++) {
      MockEventSource.instances[MockEventSource.instances.length - 1].simulateError();
      vi.advanceTimersByTime(3000);
    }

    // 11th error after reset should disconnect
    MockEventSource.instances[MockEventSource.instances.length - 1].simulateError();
    expect(handlers.onConnectionChange).toHaveBeenLastCalledWith('disconnected');
  });
});
