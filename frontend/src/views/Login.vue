<script setup>
import Header from '../components/Header.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api.js'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true
  
  try {
    const credentials = {
      username: username.value,
      password: password.value
    };
    
    const data = await authService.login(credentials);

    if (data.token) {
      // Limpiar localStorage primero
      localStorage.clear();
      
      // Guardar nuevos datos
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      successMessage.value = data.message || 'Inicio de sesión exitoso';
      
      // Redirigir con timeout para mostrar mensaje
      setTimeout(() => {
        router.push('/home');
      }, 500);
      
    } else {
      errorMessage.value = 'Error en las credenciales';
    }
  } catch (error) {
    errorMessage.value = error.message || 'Error de conexión con el servidor';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Header />
  <div class="login-container">
    <h1 style="margin-top: 5px;">Iniciar Sesión</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <input 
          type="text" 
          id="username" 
          v-model="username" 
          required 
          placeholder="Usuario"
          :disabled="isLoading" 
        />
      </div>
      <div class="form-group">
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required 
          placeholder="Contraseña"
          :disabled="isLoading" 
        />
      </div>
      <button type="submit" :disabled="isLoading">
        <span v-if="isLoading">Iniciando sesión...</span>
        <span v-else>Iniciar Sesión</span>
      </button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>  
  </div>
</template>

<style scoped>
.error {
  color: red;
  margin-top: 1rem;
}
.success {
  color: green;
  margin-top: 1rem;
}
button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
}
button:hover {
  background-color: #b5f0d2;
}
</style>