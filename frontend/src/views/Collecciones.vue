<script setup>
import { ref, onMounted, computed } from 'vue'
import Header from '../components/Header.vue'
import Mineral from './Mineral.vue'
import Fosil from './Fosil.vue'
import ExcelUploader from '../components/ExcelUploader.vue'

const activeTab = ref('minerales')

const setActiveTab = (tab) => {
  activeTab.value = tab
}
</script>

<template>
<Header/>
<div class="container mt-4">
  <div class="card">
    <div class="card-header">
      <ul class="nav nav-tabs card-header-tabs">
        <li class="nav-item">
          <button 
            :class="['nav-link', { active: activeTab === 'minerales' }]"
            @click="setActiveTab('minerales')"
            type="button"
          >
            Minerales
          </button>
        </li>
        <li class="nav-item">
          <button 
            :class="['nav-link', { active: activeTab === 'fosiles' }]"
            @click="setActiveTab('fosiles')"
            type="button"
          >
            Fósiles
          </button>
        </li>
        <li class="nav-item">
          <button 
            :class="['nav-link', { active: activeTab === 'importar' }]"
            @click="setActiveTab('importar')"
            type="button"
          >
            📊 Importar Excel
          </button>
        </li>
      </ul>
    </div>
    <div class="card-body">
      <div v-show="activeTab === 'minerales'" class="tab-content">
        <div class="tab-pane fade show active">
          <h5 class="card-title">Colección de Minerales</h5>
          <Mineral/>
        </div>
      </div>
      <div v-show="activeTab === 'fosiles'" class="tab-content">
        <div class="tab-pane fade show active">
          <h5 class="card-title">Colección de Fósiles</h5>
          <Fosil/>
        </div>
      </div>
      <div v-show="activeTab === 'importar'" class="tab-content">
        <div class="tab-pane fade show active">
          <h5 class="card-title">📊 Importar Excel con Imágenes</h5>
          <ExcelUploader/>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.nav-link {
  cursor: pointer;
  border: none;
  background: none;
  color: #495057;
}

.nav-link:hover {
  background-color: #e9ecef;
  border-color: transparent;
  color: #495057;
}

.nav-link.active {
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff;
  color: #495057;
  border-bottom: 1px solid transparent;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.nav-tabs {
  border-bottom: none;
  margin-bottom: 0;
}
</style>