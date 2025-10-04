<template>
  <div class="excel-uploader">
    <!-- Área de carga de archivo -->
    <div class="upload-area" 
         :class="{ 'dragover': isDragOver }"
         @dragover.prevent="isDragOver = true"
         @dragleave="isDragOver = false"
         @drop.prevent="handleDrop">
      
      <div v-if="!selectedFile" class="upload-placeholder">
        <i class="fas fa-file-excel fa-3x text-success mb-3"></i>
        <h5>Arrastra tu archivo Excel aquí</h5>
        <p class="text-muted">o haz clic para seleccionar</p>
        <input 
          type="file" 
          ref="fileInput" 
          @change="handleFileSelect" 
          accept=".xlsx,.xls"
          class="d-none">
        <button class="btn btn-outline-primary" @click="$refs.fileInput.click()">
          Seleccionar Archivo
        </button>
      </div>

      <div v-else class="file-info">
        <div class="alert alert-success">
          <i class="fas fa-check-circle"></i>
          Archivo seleccionado: <strong>{{ selectedFile.name }}</strong>
          <button class="btn btn-sm btn-outline-danger ms-2" @click="removeFile">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Progreso de procesamiento -->
    <div v-if="processing" class="mt-4">
      <div class="alert alert-info">
        <i class="fas fa-spinner fa-spin"></i>
        Procesando archivo Excel...
      </div>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <!-- Preview de datos extraídos -->
    <div v-if="extractedData.length > 0" class="mt-4">
      <h6>📋 Preview de datos ({{ extractedData.length }} registros)</h6>
      
      <div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Clave</th>
              <th>Nombre</th>
              <th>Procedencia</th>
              <th>Descripción</th>
              <th>No. Caja</th>
              <th>Tipo</th>
              <th>Estatus</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in extractedData.slice(0, 5)" :key="index">
              <td>{{ index + 1 }}</td>
              <td><strong>{{ item.clave_mineral }}</strong></td>
              <td>{{ item.nombre_mineral }}</td>
              <td>{{ truncate(item.procedencia_mineral, 30) }}</td>
              <td>{{ truncate(item.descripcion_mineral, 40) }}</td>
              <td>{{ item.no_caja }}</td>
              <td>
                <span class="badge bg-primary">{{ item.tipo }}</span>
              </td>
              <td>
                <span class="badge bg-success">{{ item.estatus }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="extractedData.length > 5" class="text-muted">
        ... y {{ extractedData.length - 5 }} registros más
      </div>

      <!-- Botones de acción -->
      <div class="mt-3">
        <button class="btn btn-success me-2" @click="importData" :disabled="importing">
          <i class="fas fa-upload"></i>
          {{ importing ? 'Importando...' : 'Importar Todos' }}
        </button>
        <button class="btn btn-secondary" @click="clearData">
          <i class="fas fa-trash"></i>
          Limpiar
        </button>
      </div>
    </div>

    <!-- Resultados de importación -->
    <div v-if="importResults" class="mt-4">
      <div class="alert" :class="importResults.success ? 'alert-success' : 'alert-danger'">
        <h6>📊 Resultados de Importación</h6>
        <p><strong>Exitosos:</strong> {{ importResults.successful }}</p>
        <p><strong>Fallidos:</strong> {{ importResults.failed }}</p>
        <div v-if="importResults.errors.length > 0">
          <strong>Errores:</strong>
          <ul>
            <li v-for="error in importResults.errors.slice(0, 3)" :key="error">
              {{ error }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'
import { mineralService } from '../services/api.js'

// Variables reactivas
const selectedFile = ref(null)
const isDragOver = ref(false)
const processing = ref(false)
const progress = ref(0)
const extractedData = ref([])
const importing = ref(false)
const importResults = ref(null)
const rawPreview = ref([]) // Para debug

// Manejar selección de archivo
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    processExcelFile(file)
  }
}

// Manejar drag & drop
const handleDrop = (event) => {
  isDragOver.value = false
  const files = event.dataTransfer.files
  if (files.length > 0) {
    selectedFile.value = files[0]
    processExcelFile(files[0])
  }
}

// Procesar archivo Excel
const processExcelFile = async (file) => {
  processing.value = true
  progress.value = 0
  
  try {
    console.log('📊 Iniciando procesamiento de Excel...')
    // Leer el archivo
    const arrayBuffer = await file.arrayBuffer()
    progress.value = 15
    
    // Extraer imágenes primero (usando JSZip)
    console.log('🖼️ Extrayendo imágenes del Excel...')
    const images = await extractImagesFromWorkbook(arrayBuffer)
    console.log('📸 Imágenes encontradas:', images.length)
    progress.value = 35
    
    // Parsear con XLSX para datos
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const worksheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[worksheetName]
    progress.value = 50
    
    // Convertir a JSON manteniendo las celdas como están
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      defval: '', // Valor por defecto para celdas vacías
      raw: false // No convertir tipos automáticamente
    })
    
    console.log('📊 Datos raw del Excel:', jsonData.slice(0, 3)) // Debug
    rawPreview.value = jsonData.slice(0, 5) // Para mostrar en UI
    
    progress.value = 75
    
    // Procesar datos con imágenes
    const processedData = await processData(jsonData, images)
    extractedData.value = processedData
    progress.value = 100
    
  } catch (error) {
    console.error('Error procesando Excel:', error)
    alert('Error al procesar el archivo Excel: ' + error.message)
  } finally {
    processing.value = false
  }
}

// Procesar datos del Excel con mapeo correcto
const processData = async (rawData, images = []) => {
  const processed = []
  
  // Saltar primera fila si son headers, y posiblemente las primeras filas vacías
  let startRow = 0
  for (let i = 0; i < rawData.length; i++) {
    if (rawData[i] && rawData[i][1]) { // Si la columna B (clave) tiene datos
      startRow = i
      break
    }
  }
  
  console.log('🔍 Empezando desde fila:', startRow)
  console.log('🔍 Primera fila de datos:', rawData[startRow])
  
  for (let i = startRow; i < rawData.length; i++) {
    const row = rawData[i]
    if (!row || !row[1]) continue // Saltar si no hay clave (columna B)
    
    // Mapeo corregido según tu estructura real
    const item = {
      clave_mineral: String(row[1] || '').trim(),           // Columna B
      nombre_mineral: String(row[2] || '').trim(),          // Columna C  
      procedencia_mineral: row[3] ? String(row[3]).trim() : null, // Columna D
      descripcion_mineral: String(row[4] || '').trim(),     // Columna E
      no_caja: String(row[5] || '').trim(),                 // Columna F
      no_mediana: parseInt(row[6]) || 0,                    // Columna G
      imagen_mineral: getImageForRow(images, i),  // Columna H (imagen)
      fecha: formatDate(row[8]),                            // Columna I
      observacion: row[9] ? String(row[9]).trim() : null,   // Columna J
      luminiscencia: row[10] ? String(row[10]).trim() : null, // Columna K
      talla: row[11] ? String(row[11]).trim() : null,       // Columna L
      medida: row[12] ? String(row[12]).trim() : null,      // Columna M
      tipo: String(row[15] || 'mineral').trim(),            // Columna P (intercambiado)
      estatus: String(row[14] || 'activo').trim()           // Columna O (intercambiado)
    }
    
    console.log(`📝 Registro ${i + 1}:`, {
      clave: item.clave_mineral,
      nombre: item.nombre_mineral,
      procedencia: item.procedencia_mineral,
      descripcion: item.descripcion_mineral.substring(0, 50) + '...',
      tipo: item.tipo
    })
    
    processed.push(item)
  }
  
  return processed
}

// Función para extraer imágenes del workbook usando JSZip
const extractImagesFromWorkbook = async (fileArrayBuffer) => {
  const images = []
  
  try {
    // Usar JSZip para leer el Excel como archivo ZIP
    const zip = await JSZip.loadAsync(fileArrayBuffer)
    
    console.log('📂 Archivos en el Excel:', Object.keys(zip.files))
    
    // Buscar imágenes en la carpeta xl/media/
    const mediaFiles = Object.keys(zip.files).filter(filename => 
      filename.includes('xl/media/') && 
      (filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.jpeg'))
    )
    
    console.log('🖼️ Archivos de imagen encontrados:', mediaFiles)
    
    // Extraer cada imagen
    for (let i = 0; i < mediaFiles.length; i++) {
      const filename = mediaFiles[i]
      try {
        const imageData = await zip.files[filename].async('base64')
        const extension = filename.split('.').pop().toLowerCase()
        const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg'
        
        images.push({
          index: i,
          filename: filename,
          base64: imageData,
          type: mimeType
        })
        
        console.log(`✅ Imagen ${i + 1} extraída: ${filename} (${imageData.length} chars)`)
      } catch (imgError) {
        console.warn(`⚠️ Error extrayendo ${filename}:`, imgError)
      }
    }
    
    // También buscar en otras ubicaciones posibles
    const alternateLocations = ['xl/drawings/', 'xl/embeddings/', 'media/']
    for (const location of alternateLocations) {
      const locationFiles = Object.keys(zip.files).filter(filename => 
        filename.includes(location) && 
        (filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.jpeg'))
      )
      
      for (const filename of locationFiles) {
        if (!images.find(img => img.filename === filename)) {
          try {
            const imageData = await zip.files[filename].async('base64')
            const extension = filename.split('.').pop().toLowerCase()
            const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg'
            
            images.push({
              index: images.length,
              filename: filename,
              base64: imageData,
              type: mimeType
            })
            
            console.log(`✅ Imagen adicional extraída: ${filename}`)
          } catch (error) {
            console.warn(`⚠️ Error con imagen ${filename}:`, error)
          }
        }
      }
    }
    
  } catch (error) {
    console.warn('⚠️ Error general extrayendo imágenes:', error)
  }
  
  console.log(`🎯 Total de imágenes extraídas: ${images.length}`)
  return images
}

// Función auxiliar para convertir ArrayBuffer a Base64
const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// Función para obtener imagen por fila
const getImageForRow = (images, rowIndex) => {
  // Buscar imagen que corresponda a esta fila (aproximadamente)
  const matchingImage = images.find(img => 
    Math.abs(img.row - rowIndex) <= 1 // Tolerancia de 1 fila
  )
  
  if (matchingImage) {
    return matchingImage.base64
  }
  
  // Si no hay coincidencia exacta, usar por índice secuencial
  if (images[rowIndex]) {
    return images[rowIndex].base64
  }
  
  return null
}

// Formatear fecha mejorado
const formatDate = (excelDate) => {
  if (!excelDate) return new Date().toISOString().split('T')[0]
  
  // Si ya está en formato YYYY-MM-DD
  if (typeof excelDate === 'string' && excelDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return excelDate
  }
  
  // Si está en formato DD/MM/YYYY
  if (typeof excelDate === 'string' && excelDate.includes('/')) {
    const parts = excelDate.split('/')
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0')
      const month = parts[1].padStart(2, '0')
      const year = parts[2]
      return `${year}-${month}-${day}`
    }
  }
  
  // Si es un número de Excel (días desde 1900-01-01)
  if (typeof excelDate === 'number') {
    const date = new Date((excelDate - 25569) * 86400 * 1000)
    return date.toISOString().split('T')[0]
  }
  
  return new Date().toISOString().split('T')[0]
}

// Importar datos a la base de datos
const importData = async () => {
  // Use server-side import endpoint to handle large files
  if (!selectedFile.value) {
    alert('Selecciona un archivo primero')
    return
  }

  importing.value = true
  importResults.value = null
  progress.value = 0

  try {
    // Build form data
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    // Use API_BASE_URL directly to upload to /import/excel
    const uploadUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5020'}/api/import/excel`

    console.log('⬆️ Uploading file to', uploadUrl)

    // Use the ApiService.postMultipart helper if available
    // Fallback to a simple XHR here to ensure progress is reported
    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', uploadUrl, true)
      const token = localStorage.getItem('token')
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          progress.value = Math.round((e.loaded / e.total) * 100)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const json = JSON.parse(xhr.responseText || '{}')
            importResults.value = { success: true, successful: json.inserted || 0, failed: (json.total || 0) - (json.inserted || 0), errors: [] }
            resolve()
          } catch (err) {
            importResults.value = { success: true, successful: 0, failed: 0, errors: [] }
            resolve()
          }
        } else {
          try {
            const err = JSON.parse(xhr.responseText)
            reject(new Error(err.error || JSON.stringify(err)))
          } catch (e) {
            reject(new Error(`Upload failed: ${xhr.status}`))
          }
        }
      }

      xhr.onerror = () => reject(new Error('Network error during upload'))
      xhr.send(formData)
    })

    alert('Importación en servidor completada (revisa el resumen)')
  } catch (err) {
    console.error('Upload error', err)
    alert('Error subiendo el archivo: ' + err.message)
    importResults.value = { success: false, successful: 0, failed: 0, errors: [err.message] }
  } finally {
    importing.value = false
    progress.value = 100
  }
}

// Utilidades
const removeFile = () => {
  selectedFile.value = null
  extractedData.value = []
  importResults.value = null
  rawPreview.value = []
}

const clearData = () => {
  extractedData.value = []
  importResults.value = null
  rawPreview.value = []
}

const truncate = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const viewDetails = (item) => {
  console.log('Ver detalles:', item)
}

// Cargar Font Awesome si no está disponible
onMounted(() => {
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    document.head.appendChild(link)
  }
})
</script>

<style scoped>
.excel-uploader {
  max-width: 100%;
}

.upload-area {
  border: 3px dashed #dee2e6;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.upload-area.dragover {
  border-color: #28a745;
  background-color: #d4edda;
}

.upload-placeholder {
  color: #6c757d;
}

.preview-img {
  max-width: 40px;
  max-height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.progress {
  height: 8px;
  border-radius: 4px;
}

.file-info {
  text-align: left;
}

.table-responsive {
  max-height: 400px;
  overflow-y: auto;
}

.btn:disabled {
  opacity: 0.6;
}
</style>