import type { Store } from 'vuex'

export function createPersistencePlugin() {
  return (store: Store<unknown>) => {
    store.dispatch('cart/loadFromStorage')
  }
}
