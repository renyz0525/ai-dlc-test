import type { Store } from 'vuex'

let toastCallback: ((message: string, severity: string) => void) | null = null

export function setToastCallback(cb: (message: string, severity: string) => void) {
  toastCallback = cb
}

export function setupNetworkDetection(_store: Store<unknown>) {
  window.addEventListener('offline', () => {
    if (toastCallback) {
      toastCallback('네트워크 연결이 끊어졌습니다', 'error')
    }
  })

  window.addEventListener('online', () => {
    if (toastCallback) {
      toastCallback('네트워크가 다시 연결되었습니다', 'success')
    }
  })
}
