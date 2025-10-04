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
} from '../utils/minerales.js'
import Modal from '../components/Modal.vue'
import { VueFinalModal } from 'vue-final-modal'
import {guardarMineral} from '../utils/agregaMineral.js'
import { eliminarMineral } from '../utils/eliminarMineral.js'
import { salaService } from '../services/api.js'

// Estados reactivos
const minerales = ref([])
const searchQuery = ref('')
const sortKey = ref('nombre_mineral')
const sortAsc = ref(true)
// Pagination and filters
const currentPage = ref(1)
const pageSize = ref(10)
const pageSizes = [5, 10, 20, 50]
const filterTipo = ref('')
const filterEstatus = ref('')
const loading = ref(true)
const error = ref(null)
const showModal = ref(false)
const files = ref([])
const uploadMessage = ref('')
const previewUrls = ref([])

// Estados para modales
const mineralSeleccionado = ref(null)
const showModalVer = ref(false)
const showModalEditar = ref(false)
const showModalSala = ref(false)
// Variables para asignación de sala
const salaSeleccionada = ref('')
const vitrinaSeleccionada = ref('')
const salasDisponibles = ref([])
const loadingSalas = ref(false)

// Datos del nuevo mineral
const nuevoMineral = ref({
  clave_mineral: '',
  nombre_mineral: '',
  descripcion_mineral: '',
  procedencia_mineral: '',
  tipo: '',
  imagen_mineral: null
})

// Computed para ordenar y filtrar
const sortedFilteredMinerales = computed(() => {
  let filtered = minerales.value.filter(m =>
    Object.values(m).some(val =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )

  // Apply tipo filter if set
 

  // Apply estatus filter if set
  if (filterEstatus.value) {
    filtered = filtered.filter(m => (m.estatus || '').toLowerCase() === filterEstatus.value.toLowerCase())
  }

  const sorted = filtered.sort((a, b) => {
    const key = sortKey.value
    const aVal = a[key] || ''
    const bVal = b[key] || ''
    if (aVal < bVal) return sortAsc.value ? -1 : 1
    if (aVal > bVal) return sortAsc.value ? 1 : -1
    return 0
  })

  return sorted
})

// Derived paged items and counts
const totalItems = computed(() => sortedFilteredMinerales.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)))
const pagedMinerales = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedFilteredMinerales.value.slice(start, start + pageSize.value)
})

// Función para cambiar ordenamiento
function changeSort(key) {
    if (sortKey.value === key) {
        sortAsc.value = !sortAsc.value
    } else {
        sortKey.value = key
        sortAsc.value = true
    }
}

// Función para abrir modal
const abrirModal = () => {
  showModal.value = true
}

// Función para cargar salas desde la base de datos
const cargarSalas = async () => {
  try {
    loadingSalas.value = true
    const salas = await salaService.getAllSalas()
    salasDisponibles.value = salas
  } catch (error) {
    console.error('Error al cargar salas:', error)
    salasDisponibles.value = []
  } finally {
    loadingSalas.value = false
  }
}

// Cargar datos iniciales
onMounted(async () => {
  try {
    loading.value = true
    // Cargar minerales y salas en paralelo
    await Promise.all([
      obtenerMineralesTipo().then(data => minerales.value = data),
      
    ])
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
    files.value = [file]
  } catch (error) {
    console.error('Error procesando imagen:', error)
    uploadMessage.value = 'Error al procesar imagen'
  }
}

// Función para agregar mineral
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
      imagen_mineral: null
    }
    files.value = []
    previewUrls.value = []
    uploadMessage.value = ''
  } catch (error) {
    console.error('Error al guardar:', error)
    alert(`Error: ${error.message}`)
  }
}

// Función para eliminar mineral
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
const asignarSala = async (mineral) => {
  mineralSeleccionado.value = mineral
  
  // Si no hay salas cargadas, cargarlas
  if (salasDisponibles.value.length === 0) {
    await cargarSalas()
  }
  
  showModalSala.value = true
}

// Función para subir archivos
const uploadFiles = () => {
  uploadMessage.value = 'Función de subida no implementada aún'
}

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
    if (!salaSeleccionada.value || !vitrinaSeleccionada.value) {
      alert('Por favor selecciona sala y vitrina')
      return
    }
    
    // Buscar información de la sala seleccionada
    const sala = salasDisponibles.value.find(s => (s.id_sala || s.id) == salaSeleccionada.value)
    const nombreSala = sala ? (sala.nombre_sala || `Sala ${sala.id_sala || sala.id}`) : `Sala ${salaSeleccionada.value}`
    
    // Aquí iría la lógica para asignar a sala y vitrina en la base de datos
    // Por ejemplo: await inventarioService.asignarMineralASala(mineralSeleccionado.value.id_mineral, salaSeleccionada.value, vitrinaSeleccionada.value)
    
    alert(`Mineral "${mineralSeleccionado.value.nombre_mineral}" asignado a ${nombreSala}, Vitrina ${vitrinaSeleccionada.value}`)
    
    // Limpiar y cerrar modal
    showModalSala.value = false
    salaSeleccionada.value = ''
    vitrinaSeleccionada.value = ''
    mineralSeleccionado.value = null
    
  } catch (error) {
    console.error('Error al asignar sala:', error)
    alert(`Error: ${error.message}`)
  }
}
</script>

<template>
<Header />

<!-- Modal Agregar Mineral -->
<Modal
  v-model="showModal"
  title="Nuevo mineral"
  @agregar="manejarAgregar"
>
  <input v-model="nuevoMineral.clave_mineral" placeholder="Clave del mineral" />
  <input v-model="nuevoMineral.nombre_mineral" placeholder="Nombre del mineral" />
  <textarea v-model="nuevoMineral.descripcion_mineral" placeholder="Descripción:" />
  <input v-model="nuevoMineral.procedencia_mineral" placeholder="Procedencia" />
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
    <div>
      <strong>Imagen:</strong><br>
      <ImageDecoder :encoded-image="mineralSeleccionado.imagen_mineral" :id="mineralSeleccionado?.id_mineral" alt-text="Imagen del mineral" img-class="img-fluid" />
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
    
    <div v-if="loadingSalas" class="text-center">
      <p>Cargando salas...</p>
    </div>
    
    <div v-else>
      <div class="mb-3">
        <label for="salaSelect" class="form-label">Seleccionar Sala:</label>
        <select id="salaSelect" v-model="salaSeleccionada" class="form-select">
          <option disabled value="">Seleccionar sala</option>
          <option 
            v-for="sala in salasDisponibles" 
            :key="sala.id_sala || sala.id" 
            :value="sala.id_sala || sala.id"
          >
            {{ sala.nombre_sala || `Sala ${sala.id_sala || sala.id}` }}
          </option>
        </select>
      </div>
      
      <div v-if="salaSeleccionada" class="mb-3">
        <label for="vitrinaSelect" class="form-label">Seleccionar Vitrina:</label>
        <select id="vitrinaSelect" v-model="vitrinaSeleccionada" class="form-select">
          <option disabled value="">Seleccionar vitrina</option>
          <option v-for="n in 10" :key="n" :value="n">
            Vitrina {{ n }}
          </option>
        </select>
      </div>
      
      <button 
        class="btn btn-primary" 
        @click="confirmarAsignacion"
        :disabled="!salaSeleccionada || !vitrinaSeleccionada"
      >
        Asignar
      </button>
    </div>
  </div>
</Modal>

<button class="btn btn-success mb-3" @click="abrirModal">
  Agregar mineral
</button>

<div class="container mt-4">
    <h2 class="mb-3">Minerales Registrados</h2>

    <div class="row mb-3">
      <div class="col-md-4 mb-2">
        <input v-model="searchQuery" type="text" class="form-control" placeholder="Buscar mineral..." />
      </div>
      <div class="col-md-3 mb-2">
        <select v-model="filterEstatus" class="form-select">
          <option value="">Filtrar por estatus (todos)</option>
          <option value="activo">activo</option>
          <option value="inactivo">inactivo</option>
        </select>
      </div>
      <div class="col-md-2 text-left mb-2">
        <div class="d-flex align-items-center justify-content-end">
          <label class="form-label " >Mostrar</label>
          <select v-model.number="pageSize" class="form-select">
            <option v-for="s in pageSizes" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

      </div>
      
    </div>

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
                    <th @click="changeSort('id_mineral')">Clave</th>
                    <th @click="changeSort('nombre_mineral')">Nombre</th>
                    <th @click="changeSort('procedencia_mineral')">Procedencia</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="sortedFilteredMinerales.length === 0">
                    <td colspan="5" class="text-center">No hay minerales registrados.</td>
                </tr>
                <tr v-else v-for="mineral in pagedMinerales" :key="mineral.id_mineral">
                    <td>{{ mineral.clave_mineral || 'N/D' }}</td>
                    <td>{{ mineral.nombre_mineral || 'N/D' }}</td>
                    <td>{{ mineral.procedencia_mineral || 'N/D' }}</td>
                    <td>
                        <ImageDecoder :encoded-image="mineral.imagen_mineral" :id="mineral.id_mineral" alt-text="Imagen del mineral" img-class="img-thumbnail" />
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
      <div class="d-flex justify-content-between align-items-center mt-3">
        <div>
          Mostrando {{ (currentPage-1)*pageSize + 1 }} - {{ Math.min(currentPage*pageSize, totalItems) }} de {{ totalItems }} registros
        </div>
        <div class="btn-group">
          <button class="btn btn-outline-secondary" :disabled="currentPage <= 1" @click="currentPage--">Anterior</button>
          <button class="btn btn-outline-secondary" :disabled="currentPage >= totalPages" @click="currentPage++">Siguiente</button>
        </div>
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
  margin: 5px;
}

p,
span,
.span {
    text-align: left;
    margin: 10px;
    padding: 1px;
}


</style>