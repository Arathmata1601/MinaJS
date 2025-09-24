import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'vue-final-modal/style.css'
import { createVfm } from 'vue-final-modal' // 👈 Importa el plugin

// Configura interceptor de axios
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

// Crea la app y registra plugins
const app = createApp(App)
const vfm = createVfm() // 👈 Crea instancia de vue-final-modal

app.use(router)
app.use(vfm) // 👈 Usa el plugin aquí
app.mount('#app')
