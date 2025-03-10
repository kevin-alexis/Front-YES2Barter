import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
import { createPinia } from 'pinia'
import Lara from '@primeuix/themes/lara';
import Tooltip from 'primevue/tooltip';

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
      preset: Lara,
      options: {
        darkModeSelector: false || 'none',
    }
  }
});
app.directive('tooltip', Tooltip);
app.use(createPinia())
app.use(router)

app.mount('#app')
