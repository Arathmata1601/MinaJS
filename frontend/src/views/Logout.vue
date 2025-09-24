<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  localStorage.removeItem('token') // Elimina el token
  router.push('/login')            // Redirige al login
})
</script>

<template>
  <div class="text-center mt-5">
    <h3>Cerrando sesión...</h3>
  </div>
</template>
