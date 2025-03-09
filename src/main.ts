import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(PrimeVue);
app.use(createPinia())
app.use(router)

app.mount('#app')
