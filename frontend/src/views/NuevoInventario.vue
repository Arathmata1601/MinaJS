<script setup>
import {
    ref,
    onMounted,
    computed
} from 'vue'
import Header from '../components/Header.vue'
import {
    obtenerVitrinasPorSala
} from '../utils/vitrinas.js'
import {
    obtenerMineralesPorSala
} from '../utils/obtenerMinerales.js'
import ImageDecoder from '../components/ImageDecoder.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { useRoute } from 'vue-router'
import {obtenerMinerales} from '../utils/todosMinerales.js'
import Modal from '../components/Modal.vue'
import { VueFinalModal } from 'vue-final-modal'
const route = useRoute()
const idSala = computed(() => Number(route.params.idSala))

const numVitrinas = ref(0)



const vitrinaSeleccionada = ref(null)
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


const mineralesFiltrados = computed(() => {
    if (!vitrinaSeleccionada.value) return minerales.value
    return minerales.value.filter(m => m.vitrina === vitrinaSeleccionada.value)
})

onMounted(async () => {
    try {
        loading.value = true
        numVitrinas.value = await obtenerVitrinasPorSala(idSala.value)
        minerales.value = await obtenerMineralesPorSala(idSala.value)
    } catch (err) {
        console.error('Error:', err)
        error.value = 'Error al cargar los datos de la sala'
    } finally {
        loading.value = false
    }
})
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
</script>

<template>
<Header />
<Modal
  v-model="showModal"
  title="Nuevo mineral"

>
<div  class="table-responsive">
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
                    <!--<td>
                        <ImageDecoder :encoded-image="mineral.imagen_mineral" alt-text="Imagen del mineral" img-class="img-thumbnail" />
                    </td>-->
                    <td>
                        <router-link :to="`/fosiles/${mineral.id_mineral}`" class="btn btn-sm btn-primary">
                            Ver
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</Modal>

<div>
<button class="btn btn-success mb-3" @click="abrirModal">
  Agregar mineral
</button>
</div>

<div class="container mt-3">
    <h1>Sala #1</h1>

    <!-- Estado de carga -->
    <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando información de la sala...</p>
    </div>

    <!-- Mensaje de error -->
    <div v-else-if="error" class="alert alert-danger">
        {{ error }}
    </div>

    <!-- Contenido principal -->
    <div v-else class="salas-container">
        <!-- Selector de vitrinas -->
        <div class="vitrina-selector mb-4">
            <select v-model="vitrinaSeleccionada" class="form-select" aria-label="Seleccionar vitrina">
                <option :value="null">Todas las vitrinas</option>
                <option v-for="i in numVitrinas" :key="i" :value="i.toString()">
                    Vitrina #{{ i }}
                </option>
            </select>
        </div>

        <!-- Mensaje cuando no hay minerales -->
        <div v-if="mineralesFiltrados.length === 0" class="alert alert-info">
            No se encontraron minerales en esta vitrina
        </div>

        <!-- Contenedor de tarjetas -->
    </div>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div v-for="mineralItem in mineralesFiltrados" :key="mineralItem.id_invent" class="col">
                <div class="card h-100">
                    <ImageDecoder :encoded-image="mineralItem.mineral?.imagen_mineral" alt-text="Imagen del mineral" img-class="card-img-top mineral-image" />
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">{{ mineralItem.mineral?.nombre_mineral || 'Mineral sin nombre' }}</h5>
                        <p class="card-text text-muted">
                            {{ mineralItem.mineral?.descripcion_mineral || 'Sin descripción disponible' }}
                        </p>
                        <ul class="list-group list-group-flush mt-auto">
                            <li class="list-group-item">
                                <strong>Procedencia:</strong> {{ mineralItem.mineral?.procedencia_mineral || 'N/D' }}
                            </li>
                            <li class="list-group-item">
                                <strong>Vitrina:</strong> {{ mineralItem.vitrina || 'N/D' }}
                            </li>
                            <li class="list-group-item">
                                <strong>Ubicación:</strong> {{ mineralItem.ubicacion || 'N/D' }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
</div>
</template>

<style scoped>
.salas-container{
    margin:1px;
    
}
.vitrina-selector {
    max-width: 300px;
}

.mineral-image {
    height: 200px;
    object-fit:cover ;
}

.card {
    transition: transform 0.2s;
    min-height: 100%;
    /*width: 300px;*/
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.row{
    margin-top: 20px !important; 
}
img-class{
    max-width: 10px;
    height: auto;
}

@media (max-width: 576px) {

    .vitrina-selector {
        width: 100%;
        max-width: none;
    }
}
</style>
