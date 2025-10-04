<script setup>
import { ref, onMounted } from 'vue'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import Nav from './components/Nav.vue'
import { RouterView } from 'vue-router'

import { useRoute } from 'vue-router'

const route = useRoute()



const modoOscuro = ref(false)

function toggleModo() {
  modoOscuro.value = !modoOscuro.value
  aplicarModo(modoOscuro.value)
  localStorage.setItem('modoOscuro', modoOscuro.value)
}

function aplicarModo(activo) {
  document.body.classList.toggle('modo-oscuro', activo)
}

onMounted(() => {
  const guardado = localStorage.getItem('modoOscuro') === 'true'
  modoOscuro.value = guardado
  aplicarModo(guardado)
})
</script>

<template>
  <Nav v-if="route.path !== '/login'" :modoOscuro="modoOscuro" @toggle-modo="toggleModo"  />
  <RouterView />
</template>

<style>
body {
  background-color: white;
  color: black;
  transition: 0.3s;
  text-align: center;
  align-items: center;
  justify-content: center;
  display: flex;
}

body.modo-oscuro {
  background-color: #393939;
  color: white;
  text-align: center;
}
</style>
