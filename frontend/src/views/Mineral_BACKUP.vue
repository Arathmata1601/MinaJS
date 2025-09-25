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
} from '../../js/minerales.js'
import Modal from '../components/Modal.vue'
import { VueFinalModal } from 'vue-final-modal'
import {guardarMineral} from '../../js/agregaMineral'
import { eliminarMineral } from '../../js/eliminarMineral.js'
  showModalSala.value = true
}

// Función para subir archivos (placeholder)ort {
    obtenerMineralesTipo
} from '../../js/minerales.js'
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

// Función para ver detalles del mineral
const verMineral = (mineral) => {
  mineralSeleccionado.value = mineral
  showModalVer.value = true
}

// Función para editar mineral
const editarMineral = (mineral) => {
  mineralSeleccionado.value = { ...mineral }
  showModalEditar.value = true
}

// Función para asignar sala
const asignarSala = (mineral) => {
  mineralSeleccionado.value = mineral
  showModalSala.value = true
}

// Función para cambiar ordenamiento
const changeSort = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

// Función para abrir modal de agregar
const abrirModal = () => {
  showModal.value = true
}

// Función para subir archivos (placeholder)
const uploadFiles = () => {
  uploadMessage.value = 'Función de subida no implementada aún'
}

// Variables para asignación de sala
const salaSeleccionada = ref('')

// Función para guardar edición
const guardarEdicion = async () => {
  try {
    // Aquí iría la lógica para guardar los cambios
    alert('Cambios guardados correctamente')
    showModalEditar.value = false
    // Recargar lista
    loading.value = true
    minerales.value = await obtenerMineralesTipo()
    loading.value = false
  } catch (error) {
    console.error('Error al guardar cambios:', error)
    alert(`Error: ${error.message}`)
  }
}

// Función para confirmar asignación de sala
const confirmarAsignacion = async () => {
  try {
    if (!salaSeleccionada.value) {
      alert('Por favor selecciona una sala')
      return
    }
    // Aquí iría la lógica para asignar a sala
    alert(`Mineral asignado a Sala ${salaSeleccionada.value}`)
    showModalSala.value = false
    salaSeleccionada.value = ''
  } catch (error) {
    console.error('Error al asignar sala:', error)
    alert(`Error: ${error.message}`)
  }
}


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

<!-- Modal Ver Mineral -->
<Modal
  v-model="showModalVer"
  title="Detalles del Mineral"
>
  <div v-if="mineralSeleccionado">
    <p><strong>Clave:</strong> {{ mineralSeleccionado.clave_mineral || 'N/D' }}</p>
    <p><strong>Nombre:</strong> {{ mineralSeleccionado.nombre_mineral || 'N/D' }}</p>
    <p><strong>Descripción:</strong> {{ mineralSeleccionado.descripcion_mineral || 'N/D' }}</p>
    <p><strong>Procedencia:</strong> {{ mineralSeleccionado.procedencia_mineral || 'N/D' }}</p>
    <div v-if="mineralSeleccionado.imagen_mineral">
      <strong>Imagen:</strong><br>
      <ImageDecoder :encoded-image="mineralSeleccionado.imagen_mineral" alt-text="Imagen del mineral" img-class="img-fluid" />
    </div>
  </div>
</Modal>

<!-- Modal Editar Mineral -->
<Modal
  v-model="showModalEditar"
  title="Editar Mineral"
>
  <div v-if="mineralSeleccionado">
    <input v-model="mineralSeleccionado.clave_mineral" placeholder="Clave del mineral" />
    <input v-model="mineralSeleccionado.nombre_mineral" placeholder="Nombre del mineral" />
    <textarea v-model="mineralSeleccionado.descripcion_mineral" placeholder="Descripción:" />
    <input v-model="mineralSeleccionado.procedencia_mineral" placeholder="Procedencia" />
    <button class="btn btn-primary" @click="guardarEdicion">Guardar Cambios</button>
  </div>
</Modal>

<!-- Modal Asignar Sala -->
<Modal
  v-model="showModalSala"
  title="Asignar a Sala"
>
  <div v-if="mineralSeleccionado">
    <p><strong>Mineral:</strong> {{ mineralSeleccionado.nombre_mineral }}</p>
    <select v-model="salaSeleccionada">
      <option disabled value="">Seleccionar sala</option>
      <option value="1">Sala 1</option>
      <option value="2">Sala 2</option>
      <option value="3">Sala 3</option>
    </select>
    <button class="btn btn-primary" @click="confirmarAsignacion">Asignar</button>
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
