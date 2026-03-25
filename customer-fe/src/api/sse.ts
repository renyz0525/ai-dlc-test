import type { OrderStatusChangedEvent } from '@/types'

const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

type SSEEventHandler = (event: OrderStatusChangedEvent) => void

export class SSEManager {
  private eventSource: EventSource | null = null
  private retryCount = 0
  private maxRetries = 5
  private retryDelay = 3000
  private retryTimer: ReturnType<typeof setTimeout> | null = null
  private storeId: string = ''
  private handler: SSEEventHandler | null = null

  connect(storeId: string, onEvent: SSEEventHandler): void {
    if (USE_MOCK) {
      this.handler = onEvent
      return
    }

    this.storeId = storeId
    this.handler = onEvent
    this.createConnection()
  }

  private createConnection(): void {
    const url = `${baseUrl}/api/stores/${this.storeId}/events`
    this.eventSource = new EventSource(url)

    this.eventSource.onopen = () => {
      this.retryCount = 0
    }

    this.eventSource.addEventListener('order:statusChanged', (e: MessageEvent) => {
      if (this.handler) {
        const data = JSON.parse(e.data) as OrderStatusChangedEvent
        this.handler(data)
      }
    })

    this.eventSource.onerror = () => {
      this.closeConnection()
      if (this.retryCount < this.maxRetries) {
        this.retryCount++
        this.retryTimer = setTimeout(() => {
          this.createConnection()
        }, this.retryDelay)
      }
    }
  }

  private closeConnection(): void {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
  }

  disconnect(): void {
    this.closeConnection()
    if (this.retryTimer) {
      clearTimeout(this.retryTimer)
      this.retryTimer = null
    }
    this.retryCount = 0
    this.handler = null
  }

  get isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN
  }
}

export const sseManager = new SSEManager()
