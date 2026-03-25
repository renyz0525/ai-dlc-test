import { createStore } from 'vuex'
import auth from './modules/auth'
import menu from './modules/menu'
import cart from './modules/cart'
import order from './modules/order'
import sse from './modules/sse'
import ui from './modules/ui'
import { createPersistencePlugin } from './plugins/persistence'

const store = createStore({
  modules: {
    auth,
    menu,
    cart,
    order,
    sse,
    ui,
  },
  plugins: [createPersistencePlugin()],
})

export default store
