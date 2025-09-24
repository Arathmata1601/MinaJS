<template>
  <div style="padding: 20px; text-align: center;">
    <h1>🎉 ¡Bienvenido al Sistema Mina!</h1>
    <p>Login exitoso. El router está funcionando correctamente.</p>
    <p><strong>Token:</strong> {{ token ? 'Presente' : 'No encontrado' }}</p>
    <p><strong>Usuario:</strong> {{ user?.username || 'No encontrado' }}</p>
    
    <div style="margin-top: 20px;">
      <button @click="goToOriginalHome" style="margin: 5px; padding: 10px 20px;">
        Ir al Home Original
      </button>
      <button @click="logout" style="margin: 5px; padding: 10px 20px;">
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const token = ref(null)
const user = ref(null)

onMounted(() => {
  token.value = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      user.value = JSON.parse(userStr)
    } catch (e) {
      console.error('Error parsing user data:', e)
    }
  }
})

const goToOriginalHome = () => {
  router.push('/home-original')
}

const logout = () => {
  localStorage.clear()
  router.push('/login')
}
</script>