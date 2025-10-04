// Configuración base de la API
 const API_BASE_URL = 'http://localhost:5020/api'; // Configuración local comentada para uso posterior
 export { API_BASE_URL };

// Forzar el uso de la URL de producción
//const API_BASE_URL = 'https://minajs-715x.onrender.com/api'; // Backend desplegado en Render

// Verificar que la URL esté configurada correctamente
console.log('🔧 API_BASE_URL configurada:', API_BASE_URL);

// Clase para manejar las peticiones HTTP
class ApiService {
  constructor(endpoint = '') {
    this.baseURL = API_BASE_URL + endpoint;
  }

  // Método para obtener headers con token
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    console.log('🔐 Token desde localStorage:', token ? token.slice(0, 50) + '...' : 'NO TOKEN');
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔐 Header Authorization configurado:', headers['Authorization'].slice(0, 50) + '...');
    } else {
      console.warn('⚠️  NO HAY TOKEN EN LOCALSTORAGE');
    }
    
    return headers;
  }

  // Método genérico para peticiones GET
  async get(endpoint) {
    try {
      const fullURL = `${this.baseURL}${endpoint}`;
      console.log('🔍 Haciendo petición GET a:', fullURL);
      
      const response = await fetch(fullURL, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Método genérico para peticiones POST
  async post(endpoint, data) {
    try {
      const fullURL = `${this.baseURL}${endpoint}`;
      const headers = this.getAuthHeaders();
      
      console.log('🔍 POST Request Details:');
      console.log('  📍 URL:', fullURL);
      console.log('  📋 Headers:', headers);
      console.log('  📦 Data:', data);
      
      const response = await fetch(fullURL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      });
      
      console.log('📥 Response status:', response.status, response.statusText);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('💥 Network error:', error);
      throw this.handleError(error);
    }
  }

  // Método para POST multipart/form-data (file upload) con posibilidad de progreso
  async postMultipart(endpoint, formData, onProgress) {
    try {
      const fullURL = `${this.baseURL}${endpoint}`;
      console.log('🔍 POST multipart to:', fullURL);

      const token = localStorage.getItem('token');

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Usamos XMLHttpRequest para reportar progreso
      return await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', fullURL, true);
        Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && typeof onProgress === 'function') {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent, event.loaded, event.total);
          }
        };

        xhr.onreadystatechange = async () => {
          if (xhr.readyState === 4) {
            const contentType = xhr.getResponseHeader('content-type');
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                if (contentType && contentType.includes('application/json')) {
                  const json = JSON.parse(xhr.responseText || '{}');
                  resolve(json);
                } else {
                  resolve(xhr.responseText);
                }
              } catch (err) {
                resolve(xhr.responseText);
              }
            } else {
              let errMsg = `HTTP ${xhr.status}`;
              try { errMsg = JSON.parse(xhr.responseText).error || xhr.responseText || errMsg } catch(e){}
              reject(new Error(errMsg));
            }
          }
        };

        xhr.onerror = () => reject(new Error('Network error during file upload'));
        xhr.send(formData);
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Método genérico para peticiones PUT
  async put(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Método genérico para peticiones DELETE
  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Manejo de respuestas
  async handleResponse(response) {
    console.log('Response status:', response.status);
    console.log('Response URL:', response.url);
    
    // Verificar el content-type
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      // Si es 401 (no autorizado), limpiar token y redirigir al login
      if (response.status === 401) {
        console.error('🚨 ERROR 401 - No autorizado');
        console.error('🚨 Token actual:', localStorage.getItem('token'));
        console.error('🚨 Usuario actual:', localStorage.getItem('user'));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      // Intentar obtener mensaje de error
      try {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || `HTTP Error: ${response.status}`);
        } else {
          const errorText = await response.text();
          throw new Error(`HTTP Error: ${response.status} - ${errorText || response.statusText}`);
        }
      } catch (parseError) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }
    }
    
    // Respuesta exitosa - verificar si tiene JSON
    if (contentType && contentType.includes('application/json')) {
      try {
        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        // Para la mayoría de casos, devolver solo data si existe (para compatibilidad con arrays de minerales)
        if (responseData && typeof responseData === 'object' && Object.prototype.hasOwnProperty.call(responseData, 'data')) {
          return responseData.data;
        }
        return responseData;
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        // Intentar obtener el texto de la respuesta para debug
        try {
          const text = await response.clone().text();
          console.log('Response text:', text);
        } catch {}
        throw new Error('Invalid JSON response from server');
      }
    } else {
      return {}; // Respuesta sin JSON válida
    }
  }

  // Manejo de errores
  handleError(error) {
    console.error('API Error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new Error('Error de conexión. Verifica que el servidor esté ejecutándose.');
    }
    
    return error;
  }
}

// Servicios específicos para cada módulo
class AuthService extends ApiService {
  constructor() {
    super() // Sin endpoint específico
  }
  async login(credentials) {
    return await this.post('/auth/login', credentials);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

class UserService extends ApiService {
  constructor() {
    super('/users')
  }
  async getAllUsers() {
    return await this.get('');
  }

  async createUser(userData) {
    return await this.post('', userData);
  }
}

class MineralService extends ApiService {
  constructor() {
    super('/mineral')
    console.log('🏗️ MineralService initialized with baseURL:', this.baseURL)
  }

  // Método create que llama al endpoint correcto
  async create(data) {
    try {
      console.log('🔄 Creando mineral:', data)
      console.log('🔧 URL completa que se usará:', `${this.baseURL}` + (this.baseURL.endsWith('/mineral') ? '' : '/mineral'))
      console.log('🔧 Headers:', this.getAuthHeaders())
      
      // Asegurar que la URL termine en /mineral si no lo hace
      const response = await this.post('', data)
      console.log('✅ Mineral creado:', response)
      return response
    } catch (error) {
      console.error('❌ Error creando mineral:', error)
      console.error('❌ Error stack:', error.stack)
      throw error
    }
  }

  // Método de prueba sin autenticación
  async createTest(data) {
    try {
      console.log('🧪 Creando mineral (test):', data)
      console.log('🧪 URL de prueba:', `${this.baseURL}/test`)
      const response = await this.post('/test', data)
      console.log('✅ Mineral creado (test):', response)
      return response
    } catch (error) {
      console.error('❌ Error creando mineral (test):', error)
      throw error
    }
  }

  // Asegurar que existe el método post
  async post(endpoint = '', data) {
    return super.post(endpoint, data)
  }

  // Otros métodos existentes...
  async getMineralByMineral() {
    return this.get('/mineral')
  }

  async getMineralByFosil() {
    return this.get('/fosil')
  }

  // Obtener un mineral por id (necesario para ImageDecoder.lazy-load)
  async getMineralById(id) {
    if (!id && id !== 0) throw new Error('getMineralById requiere un id válido')
    return this.get(`/${id}`)
  }

  async searchInventario(params) {
    return this.get('/search', { params })
  }
}

class InventarioService extends ApiService {
  constructor() {
    super('/inventario')
  }
  async getAllInventario() {
    return await this.get('');
  }

  async getInventarioById(id) {
    return await this.get(`/${id}`);
  }

  async createInventario(inventarioData) {
    return await this.post('', inventarioData);
  }

  async updateInventario(id, inventarioData) {
    return await this.put(`/${id}`, inventarioData);
  }

  async deleteInventario(id) {
    return await this.delete(`/${id}`);
  }

  async getMineralesDisponibles() {
    return await this.get('/minerales-disponibles');
  }

  async searchInventario(filters) {
    const queryParams = new URLSearchParams(filters).toString();
    return await this.get(`/search?${queryParams}`);
  }
}

class VentasService extends ApiService {
  constructor() {
    super('/ventas')
  }
  async getAllVentas() {
    return await this.get('');
  }

  async getVentaById(id) {
    return await this.get(`/${id}`);
  }

  async createVenta(ventaData) {
    try {
      const fullURL = `${this.baseURL}`;
      const headers = this.getAuthHeaders();
      
      console.log('🔍 POST Request Details (createVenta):');
      console.log('  📍 URL:', fullURL);
      console.log('  📋 Headers:', headers);
      console.log('  📦 Data:', ventaData);
      
      const response = await fetch(fullURL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(ventaData)
      });
      
      console.log('📥 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('📥 Full response data (createVenta):', responseData);
      
      // Para createVenta, devolver la respuesta completa
      return responseData;
      
    } catch (error) {
      console.error('💥 Network error in createVenta:', error);
      throw error;
    }
  }

  async updateVenta(id, ventaData) {
    return await this.put(`/${id}`, ventaData);
  }

  async deleteVenta(id) {
    return await this.delete(`/${id}`);
  }

  async getMineralesVenta() {
    return await this.get('/minerales');
  }

  async createMineralVenta(mineralData) {
    return await this.post('/minerales', mineralData);
  }

  async searchVentas(filters) {
    const queryParams = new URLSearchParams(filters).toString();
    return await this.get(`/search?${queryParams}`);
  }

  async getVentasStats() {
    return await this.get('/stats');
  }
}

class SalaService extends ApiService {
  constructor() {
    super('/salas')
  }
  async getAllSalas() {
    return await this.get('');
  }

  async getSalaById(id) {
    return await this.get(`/${id}`);
  }

  async createSala(salaData) {
    return await this.post('', salaData);
  }

  async updateSala(id, salaData) {
    return await this.put(`/salas/${id}`, salaData);
  }

  async deleteSala(id) {
    return await this.delete(`/salas/${id}`);
  }
}

// Instancias exportadas
export const authService = new AuthService();
export const userService = new UserService();
export const mineralService = new MineralService();
export const inventarioService = new InventarioService();
export const ventasService = new VentasService();
export const salaService = new SalaService();

export default {
  auth: authService,
  users: userService,
  minerals: mineralService,
  inventario: inventarioService,
  ventas: ventasService,
  salas: salaService
};