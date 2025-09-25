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
  console.log('🖼️ ImageDecoder - Imagen recibida:', {
    encodedImage: props.encodedImage,
    hasImage: !!props.encodedImage,
    length: props.encodedImage?.length,
    preview: props.encodedImage?.substring(0, 50) + '...'
  })
  
  if (!props.encodedImage) {
    console.log('⚠️ ImageDecoder - No hay imagen, usando placeholder')
    return placeholder
  }
  
  if (props.encodedImage.startsWith('data:image')) {
    console.log('✅ ImageDecoder - Imagen ya tiene formato data:image')
    return props.encodedImage
  }
  
  const dataUrl = `data:image/jpeg;base64,${props.encodedImage}`
  console.log('🔧 ImageDecoder - Convirtiendo a data URL:', dataUrl.substring(0, 50) + '...')
  return dataUrl
})

function handleImageError(event) {
  console.error('❌ ImageDecoder - Error al cargar imagen:', {
    src: event.target.src,
    encodedImage: props.encodedImage,
    altText: props.altText
  })
  
  // Cambiar a placeholder cuando falle
  event.target.src = placeholder
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
