<template>
  <div class="diagnostico-container">
    <h1>🔧 Diagnóstico de Conectividad</h1>
    
    <div class="test-section">
      <h2>1. Test de Conectividad Básica</h2>
      <button @click="testHealth" :disabled="loading.health">
        {{ loading.health ? 'Probando...' : 'Probar /api/health' }}
      </button>
      <div v-if="results.health" class="result" :class="results.health.success ? 'success' : 'error'">
        <pre>{{ results.health.message }}</pre>
      </div>
    </div>

    <div class="test-section">
      <h2>2. Test de Autenticación</h2>
      <div class="auth-form">
        <input v-model="testCredentials.username" placeholder="Usuario" />
        <input v-model="testCredentials.password" type="password" placeholder="Contraseña" />
        <button @click="testAuth" :disabled="loading.auth">
          {{ loading.auth ? 'Probando...' : 'Probar Login' }}
        </button>
      </div>
      <div v-if="results.auth" class="result" :class="results.auth.success ? 'success' : 'error'">
        <pre>{{ results.auth.message }}</pre>
      </div>
    </div>

    <div class="test-section">
      <h2>3. Test de Minerales/Fósiles</h2>
      <button @click="testMinerals" :disabled="loading.minerals">
        {{ loading.minerals ? 'Probando...' : 'Probar /api/mineral/fosil' }}
      </button>
      <div v-if="results.minerals" class="result" :class="results.minerals.success ? 'success' : 'error'">
        <pre>{{ results.minerals.message }}</pre>
      </div>
    </div>

    <div class="info-section">
      <h2>ℹ️ Información de Configuración</h2>
      <div class="config-info">
        <p><strong>API Base URL:</strong> {{ apiBaseUrl }}</p>
        <p><strong>Token presente:</strong> {{ hasToken ? '✅ Sí' : '❌ No' }}</p>
        <p><strong>Usuario actual:</strong> {{ currentUser || 'No logueado' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { authService, mineralService } from '../services/api.js'

const loading = ref({
  health: false,
  auth: false,
  minerals: false
})

const results = ref({
  health: null,
  auth: null,
  minerals: null
})

const testCredentials = ref({
  username: '',
  password: ''
})

const apiBaseUrl = ref('https://minajs-715x.onrender.com/api')
const hasToken = ref(false)
const currentUser = ref(null)

onMounted(() => {
  hasToken.value = !!localStorage.getItem('token')
  const user = localStorage.getItem('user')
  currentUser.value = user ? JSON.parse(user).username : null
})

const testHealth = async () => {
  loading.value.health = true
  try {
    const response = await fetch(`${apiBaseUrl.value}/health`)
    const data = await response.json()
    
    results.value.health = {
      success: response.ok,
      message: `Status: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`
    }
  } catch (error) {
    results.value.health = {
      success: false,
      message: `Error: ${error.message}`
    }
  } finally {
    loading.value.health = false
  }
}

const testAuth = async () => {
  if (!testCredentials.value.username || !testCredentials.value.password) {
    results.value.auth = {
      success: false,
      message: 'Por favor ingresa usuario y contraseña'
    }
    return
  }

  loading.value.auth = true
  try {
    const data = await authService.login(testCredentials.value)
    results.value.auth = {
      success: true,
      message: `Login exitoso!\nToken recibido: ${data.token ? '✅' : '❌'}\nUsuario: ${JSON.stringify(data.user, null, 2)}`
    }
  } catch (error) {
    results.value.auth = {
      success: false,
      message: `Error de login: ${error.message}`
    }
  } finally {
    loading.value.auth = false
  }
}

const testMinerals = async () => {
  loading.value.minerals = true
  try {
    const data = await mineralService.getMineralByFosil()
    results.value.minerals = {
      success: true,
      message: `Fósiles obtenidos: ${data.length} registros\nPrimeros 2 registros:\n${JSON.stringify(data.slice(0, 2), null, 2)}`
    }
  } catch (error) {
    results.value.minerals = {
      success: false,
      message: `Error al obtener fósiles: ${error.message}`
    }
  } finally {
    loading.value.minerals = false
  }
}
</script>

<style scoped>
.diagnostico-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.test-section {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.test-section h2 {
  margin-top: 0;
  color: #333;
}

.auth-form {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.auth-form input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
  min-width: 150px;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.result {
  margin-top: 15px;
  padding: 15px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.result.success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.result.error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.info-section {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #bee5eb;
  border-radius: 8px;
  background: #d1ecf1;
}

.config-info p {
  margin: 8px 0;
  color: #0c5460;
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
}
</style>