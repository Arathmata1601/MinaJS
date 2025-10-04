import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import 'vue-final-modal/style.css'
import { createVfm } from 'vue-final-modal' // 👈 Importa el plugin
import {createBootstrap} from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap'

// Configurar la URL base de axios directamente
axios.defaults.baseURL = 'https://minajs-715x.onrender.com/api'
//axios.defaults.baseURL = 'http://localhost:5020/api'

// Debug: verificar la configuración
console.log('🔧 Axios baseURL configurada:', axios.defaults.baseURL);

// Configura interceptor de axios - COMENTADO para evitar conflictos con api.js
// axios.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response && error.response.status === 401) {
//       localStorage.removeItem('token')
//       router.push('/login')
//     }
//     return Promise.reject(error)
//   }
// )

// Interceptor de request: adjuntar Authorization si existe token
axios.interceptors.request.use(
  config => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers = config.headers || {}
        if (!config.headers['Authorization'] && !config.headers['authorization']) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
      }
    } catch (e) {
      // ignore
    }
    return config
  },
  error => Promise.reject(error)
)

// Crea la app y registra plugins
const app = createApp(App)
const vfm = createVfm() 

app.use(createBootstrap())
app.use(router)
app.use(vfm) // 👈 Usa el plugin aquí
app.mount('#app')
