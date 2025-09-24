<script setup>
import { computed } from 'vue'
import ejemplo from '../assets/ejemplo.png' // ✅ Importa la imagen directamente

const props = defineProps({
  encodedImage: String,
  altText: {
    type: String,
    default: 'Imagen'
  },
  imgClass: {
    type: String,
    default: ''
  }
})

const placeholder = ejemplo

const imageSrc = computed(() => {
  if (!props.encodedImage) return placeholder
  if (props.encodedImage.startsWith('data:image')) {
    return props.encodedImage
  }
  return `data:image/jpeg;base64,${props.encodedImage}`
})

function handleImageError() {
  // Si quieres cambiar la imagen a placeholder al fallar
  // no puedes modificar `imageSrc` directamente porque es computed,
  // así que necesitas emitir un evento o usar una variable reactiva aparte.
  // Por ahora solo emite error:
  console.warn('Imagen falló al cargar')
}
</script>

<template>
  <img 
    :src="imageSrc" 
    :alt="altText"
    :class="imgClass"
    @error="handleImageError"
  />
</template>
