<script setup>
import { defineEmits, defineProps } from 'vue'
import 'bootstrap-icons/font/bootstrap-icons.css'

const emit = defineEmits(['toggle-modo'])
const props = defineProps({
  modoOscuro: Boolean
})
</script>

<template>
  <div class="navbar">
    <RouterLink to="/home">Inicio</RouterLink>
    <RouterLink to="/fosiles">Fósiles</RouterLink>
    <RouterLink to="/minerales">Minerales</RouterLink>
    <RouterLink to="/rocas">Rocas</RouterLink>
    <RouterLink to="/logout">Cerrar Sesión</RouterLink>

    <label class="switch">
      <input type="checkbox" :checked="modoOscuro" @change="emit('toggle-modo')" />
      <span class="slider">
        <i class="bi" :class="modoOscuro ? 'bi-brightness-high' : 'bi-moon'"></i>
      </span>
    </label>
  </div>
</template>

<style scoped>


/* Estilo del switch */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 26px;
}

.slider:before {
  position: absolute;

  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

/* Cuando está activo */
.switch input:checked + .slider {
  background-color: #242424;
}

.switch input:checked + .slider:before {
  transform: translateX(24px);
  
}
</style>
