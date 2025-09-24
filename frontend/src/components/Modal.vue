<script setup lang="ts">
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'

// Props
defineProps<{
  title?: string
}>()

// Emits
const emit = defineEmits<{
  (e: 'agregar'): void
}>()


const cerrarModal = () => {
  emit('update:modelValue', false)
}

// Model para v-model
const visible = defineModel<boolean>() // Esto conecta con v-model desde el padre
</script>

<template>
  <VueFinalModal
    v-model="visible"
    class="confirm-modal"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
  >
    <h1>{{ title }}</h1>
    <slot />
    <button @click="emit('agregar')">
      Agregar
    </button>
    <div class="modal-footer">
        <slot name="footer">
          <!-- Botón por defecto en el slot del footer -->
          <button class="btn btn-secondary" @click="cerrarModal">Cerrar</button>
        </slot>
      </div>
  </VueFinalModal>
</template>

<style>
.confirm-modal {
  display: flex;
  justify-content: center;
  align-items: center;
}
.confirm-modal-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #fff;
  border-radius: 0.5rem;
}
.confirm-modal-content > * + * {
  margin: 0.5rem 0;
}
.confirm-modal-content h1 {
  font-size: 1.375rem;
}
.confirm-modal-content button {
  margin: 0.25rem 0 0 auto;
  padding: 0 8px;
  border: 1px solid;
  border-radius: 0.5rem;
}
.dark .confirm-modal-content {
  background: #000;
}


</style>
