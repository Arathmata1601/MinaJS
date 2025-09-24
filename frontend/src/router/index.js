import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/home.vue'
import Sala1 from '../views/SalaView.vue'
import Fosil from '../views/Fosil.vue'
import Mineral from '../views/Mineral.vue'
import Roca from '../views/Rocas.vue'
import Logout from '../views/Logout.vue'
import inventario from '../views/NuevoInventario.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/logout', component: Logout },
  { path: '/login', component: Login },
  { path: '/home', component: Home, meta: { requiresAuth: true }},
  { path: '/sala/:idSala', component: Sala1, meta: { requiresAuth: true } },
  { path: '/fosiles', component: Fosil, meta: { requiresAuth: true }},
  { path: '/minerales', component: Mineral, meta: { requiresAuth: true }},
  { path: '/rocas', component: Roca, meta: { requiresAuth: true }},
  { path: '/inventario', component: inventario, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // Si la ruta requiere autenticación y no hay token
  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }
  
  // Si está autenticado y trata de ir al login, redirigir al home
  if (to.path === '/login' && token) {
    next('/home')
    return
  }
  
  // Permitir navegación normal
  next()
})


export default router
