<script setup>
import {
    ref,
    computed,
    onMounted
} from 'vue'
import Header from '../components/Header.vue'
import ImageDecoder from '../components/ImageDecoder.vue'
import {
    obtenerMineralesTipo
} from '../../js/fosiles.js'
import Modal from '../components/Modal.vue'
import { VueFinalModal } from 'vue-final-modal'
import {guardarMineral} from '../../js/agregaMineral'
import { eliminarMineral } from '../../js/eliminarMineral.js'

const sortedFilteredMinerales = computed(() => {
    let filtered = minerales.value.filter(m =>
        Object.values(m).some(val =>
            String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    )

    return filtered.sort((a, b) => {
        const key = sortKey.value
        const aVal = a[key] || ''
        const bVal = b[key] || ''
        if (aVal < bVal) return sortAsc.value ? -1 : 1
        if (aVal > bVal) return sortAsc.value ? 1 : -1
        return 0
    })
})

function changeSort(key) {
    if (sortKey.value === key) {
        sortAsc.value = !sortAsc.value
    } else {
        sortKey.value = key
        sortAsc.value = true
    }
}
const abrirModal = () => {
  showModal.value = true
}

// Estados reactivos
const minerales = ref([])
const searchQuery = ref('')
const sortKey = ref('nombre_mineral')
const sortAsc = ref(true)
const loading = ref(true)
const error = ref(null)
const showModal = ref(false)
const files = ref([])
const uploadMessage = ref('')
const previewUrls = ref([])

// Datos del nuevo mineral
const nuevoMineral = ref({
  clave_mineral: '',
  nombre_mineral: '',
  descripcion_mineral: '',
  procedencia_mineral: '',
  tipo: '',
  imagen_mineral: null // Cambiado a null para manejar array de bytes
})

// Cargar datos iniciales
onMounted(async () => {
  try {
    loading.value = true
    minerales.value = await obtenerMineralesTipo()
  } catch (err) {
    console.error('Error:', err)
    error.value = 'Error al cargar los datos'
  } finally {
    loading.value = false
  }
})

// Manejo de archivos de imagen
const handleFile = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validar tamaño (ejemplo: máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    uploadMessage.value = 'La imagen es demasiado grande (máx 5MB)'
    return
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    nuevoMineral.value.imagen_mineral = Array.from(new Uint8Array(arrayBuffer))
    previewUrls.value = [URL.createObjectURL(file)]
    uploadMessage.value = 'Imagen lista para subir'
    files.value = [file] // Almacenamos el archivo para referencia
  } catch (error) {
    console.error('Error procesando imagen:', error)
    uploadMessage.value = 'Error al procesar imagen'
  }
}

const manejarAgregar = async () => {
  try {
    if (!nuevoMineral.value.nombre_mineral || !nuevoMineral.value.tipo) {
      throw new Error('Nombre y tipo son obligatorios')
    }

    const response = await guardarMineral(nuevoMineral.value)
    alert('Mineral guardado correctamente ✔️')
    showModal.value = false
    
    loading.value = true
    minerales.value = await obtenerMineralesTipo()
    loading.value = false

    // Resetear
    nuevoMineral.value = {
      clave_mineral: '',
      nombre_mineral: '',
      descripcion_mineral: '',
      procedencia_mineral: '',
      tipo: '',
      imagen_mineral_base64: ''
    }
    files.value = []
    previewUrls.value = []
    uploadMessage.value = ''
  } catch (error) {
    console.error('Error al guardar:', error)
    alert(`Error: ${error.message}`)
  }
}
const manejarEliminar = async (id) => {
  const confirmado = confirm("¿Estás seguro de que deseas eliminar este mineral?");
  if (!confirmado) return;

  const eliminado = await eliminarMineral(id);
  if (eliminado) {
    minerales.value = minerales.value.filter(m => m.id_mineral !== id);
  } else {
    alert("Hubo un error al eliminar el mineral");
  }
}


const mineralSeleccionado = ref(null)
const showModalVer = ref(false)
const showModalEditar = ref(false)
const showModalSala = ref(false)


</script>

<template>
<Header />

<Modal
  v-model="showModal"
  title="Nuevo mineral"
  @agregar="manejarAgregar"
>

<input v-model="nuevoMineral.clave_mineral" placeholder="Clave del mineral" />
<input v-model="nuevoMineral.nombre_mineral" placeholder="Nombre del mineral" />
<textarea v-model="nuevoMineral.descripcion_mineral" placeholder="Descripción:" />
<input v-model="nuevoMineral.procedencia_mineral" placeholder="Procedencia" />
<select v-model="nuevoMineral.tipo">
  <option disabled value="">Seleccione tipo</option>
  <option >Fósil</option>
  <option >Mineral</option>
  <option >Roca</option>
</select>



<div class="uploader">
    <h2>Subir imagen</h2>

    <input type="file" @change="handleFile" accept="image/*" multiple />
    <button @click="uploadFiles" :disabled="!files.length">Subir</button>

    <ul>
      <li v-for="(file, index) in files" :key="index">{{ file.name }}</li>
    </ul>

    <div v-if="uploadMessage">{{ uploadMessage }}</div>
  </div>
</Modal>

<button class="btn btn-success mb-3" @click="abrirModal">
  Agregar mineral
</button>

<div class="container mt-4">
    <h2 class="mb-3">Minerales Registrados</h2>

    <input v-model="searchQuery" type="text" class="form-control mb-3" placeholder="Buscar fósil..." />

    <div v-if="loading" class="alert alert-info text-center">
        Cargando información de minerales...
    </div>
    <div v-else-if="error" class="alert alert-danger">
        {{ error }}
    </div>

    <div v-else class="table-responsive">
        <table class="table table-bordered table-hover">
            <thead>
                <tr>
                    <th @click="changeSort('id_mineral')">Clave </th>
                    <th @click="changeSort('nombre_mineral')">Nombre </th>
                    <th @click="changeSort('procedencia_mineral')">Procedencia </th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="sortedFilteredMinerales.length === 0">
                    <td colspan="5" class="text-center">No hay rocas registrados.</td>
                </tr>
                <tr v-else v-for="mineral in sortedFilteredMinerales" :key="mineral.id_mineral">
                    <td>{{ mineral.clave_mineral || 'N/D' }}</td>
                    <td>{{ mineral.nombre_mineral || 'N/D' }}</td>
                    <td>{{ mineral.procedencia_mineral || 'N/D' }}</td>
                    <td>
                        <ImageDecoder :encoded-image="mineral.imagen_mineral" alt-text="Imagen del mineral" img-class="img-thumbnail" />
                    </td>
                    <td>
                      <button class="btn btn-sm btn-info me-1" @click="verMineral(mineral)">Ver</button>
                      <button class="btn btn-sm btn-warning me-1" @click="editarMineral(mineral)">Editar</button>
                      <button class="btn btn-sm btn-danger me-1" @click="manejarEliminar(mineral.id_mineral)">Eliminar</button>
                      <button class="btn btn-sm btn-secondary" @click="asignarSala(mineral)">Asignar Sala</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<style scoped>
.img-thumbnail {
    max-width: 100px;
    max-height: 100px;
    object-fit: cover;
}

th {
    cursor: pointer;
}
input,
textarea,
select {
  border-radius: 8px;
  margin:5px;
  
}
p,
span,
.span{
    text-align:left;
    margin: 10px;
    padding:1px;
}

</style>
