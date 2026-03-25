import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'
import './assets/main.css'

import App from './App.vue'
import store from './store'
import router from './router'
import { setupNetworkDetection } from './utils/network'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(ToastService)
app.use(store)
app.use(router)

setupNetworkDetection(store)

app.mount('#app')
