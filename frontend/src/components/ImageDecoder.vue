<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import ejemplo from '../assets/ejemplo.png' // ✅ Importa la imagen directamente
import { mineralService, API_BASE_URL } from '../services/api.js'

const props = defineProps({
  encodedImage: String,
  id: {
    type: [String, Number],
    default: null
  },
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
const fetchedImage = ref(null)
const loadingImage = ref(false)
let worker = null

onMounted(async () => {
  // Si ya viene la imagen en props, no hacemos nada
  if (props.encodedImage) return

  // Si nos pasan id, preferimos dejar que el navegador descargue la imagen directamente
  // usando la ruta pública: `${API_BASE_URL}/mineral/image/:id`
  if (props.id) {
    try {
      // asignar la URL pública como fuente inmediata para que el <img> la cargue
      fetchedImage.value = `${API_BASE_URL}/mineral/image/${props.id}`

      // lanzar en background una petición para obtener metadatos (no bloqueante)
      loadingImage.value = true
      mineralService.getMineralById(props.id).catch((e) => {
        console.warn('ImageDecoder: warming metadata fetch failed', e)
      })
    } finally {
      loadingImage.value = false
    }

    return
  }

  // Si no hay id ni encodedImage, mantener comportamiento previo (no hacer nada)
})

onBeforeUnmount(() => {
  if (worker) {
    try { worker.terminate() } catch(e) {}
    worker = null
  }
})

const imageSrc = computed(() => {
  const srcCandidate = props.encodedImage || fetchedImage.value
  console.log('🖼️ ImageDecoder - Imagen recibida:', {
    encodedImage: props.encodedImage,
    fetchedImage: fetchedImage.value,
    hasImage: !!srcCandidate,
    length: srcCandidate?.length,
    preview: srcCandidate?.substring ? srcCandidate.substring(0, 50) + '...' : null
  })
  
  if (!srcCandidate) {
    console.log('⚠️ ImageDecoder - No hay imagen, usando placeholder')
    return placeholder
  }
  
  if (srcCandidate.startsWith('data:image')) {
    console.log('✅ ImageDecoder - Imagen ya tiene formato data:image')
    return srcCandidate
  }
  
  // Si la fuente es una URL (http/https o path absoluto), dejarla pasar al navegador
  if (typeof srcCandidate === 'string' && (srcCandidate.startsWith('http://') || srcCandidate.startsWith('https://') || srcCandidate.startsWith('/'))) {
    console.log('✅ ImageDecoder - Usando URL directa para <img>:', srcCandidate)
    return srcCandidate
  }

  // Detectar si es una cadena base64 (heurística simple)
  const isBase64 = (str) => typeof str === 'string' && /^[A-Za-z0-9+/=\s]+$/.test(str) && str.length % 4 === 0 && str.length > 100
  if (isBase64(srcCandidate)) {
    const dataUrl = `data:image/jpeg;base64,${srcCandidate}`
    console.log('🔧 ImageDecoder - Convirtiendo base64 a data URL (sized):', srcCandidate.length)
    return dataUrl
  }
  // Si llegamos aquí, no reconocemos el formato -> usar placeholder
  console.warn('⚠️ ImageDecoder - Fuente de imagen no reconocida, usando placeholder', { preview: srcCandidate?.substring ? srcCandidate.substring(0, 80) + '...' : srcCandidate })
  return placeholder
})

function handleImageError(event) {
  console.error('❌ ImageDecoder - Error al cargar imagen:', {
    src: event.target.src,
    encodedImage: props.encodedImage,
    fetchedImage: fetchedImage.value,
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
