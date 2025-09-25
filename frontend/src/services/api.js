// Configuración base de la API
// const API_BASE_URL = 'http://localhost:5020/api'; // Configuración local comentada para uso posterior

// Forzar el uso de la URL de producción
const API_BASE_URL = 'https://minajs-715x.onrender.com/api'; // Backend desplegado en Render

// Verificar que la URL esté configurada correctamente
console.log('🔧 API_BASE_URL configurada:', API_BASE_URL);

// Clase para manejar las peticiones HTTP
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método para obtener headers con token
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
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
      console.log('🔍 Haciendo petición POST a:', fullURL);
      
      const response = await fetch(fullURL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      return await this.handleResponse(response);
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
        const data = await response.json();
        console.log('Response data:', data);
        return data;
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
  async getAllUsers() {
    return await this.get('/users');
  }

  async createUser(userData) {
    return await this.post('/users', userData);
  }
}

class MineralService extends ApiService {
  async getAllMinerals() {
    return await this.get('/mineral');
  }

  async getMineralById(id) {
    return await this.get(`/mineral/${id}`);
  }
  async getMineralByMineral() {
    return await this.get(`/mineral/mineral`);
  }

  async getMineralByFosil() {
    return await this.get(`/mineral/fosil`);
  }

  async createMineral(mineralData) {
    return await this.post('/mineral', mineralData);
  }

  async updateMineral(id, mineralData) {
    return await this.put(`/mineral/${id}`, mineralData);
  }

  async deleteMineral(id) {
    return await this.delete(`/mineral/${id}`);
  }
}

class InventarioService extends ApiService {
  async getAllInventario() {
    return await this.get('/inventario');
  }

  async getInventarioById(id) {
    return await this.get(`/inventario/${id}`);
  }

  async createInventario(inventarioData) {
    return await this.post('/inventario', inventarioData);
  }

  async updateInventario(id, inventarioData) {
    return await this.put(`/inventario/${id}`, inventarioData);
  }

  async deleteInventario(id) {
    return await this.delete(`/inventario/${id}`);
  }

  async getMineralesDisponibles() {
    return await this.get('/inventario/minerales-disponibles');
  }

  async searchInventario(filters) {
    const queryParams = new URLSearchParams(filters).toString();
    return await this.get(`/inventario/search?${queryParams}`);
  }
}

class VentasService extends ApiService {
  async getAllVentas() {
    return await this.get('/ventas');
  }

  async getVentaById(id) {
    return await this.get(`/ventas/${id}`);
  }

  async createVenta(ventaData) {
    return await this.post('/ventas', ventaData);
  }

  async updateVenta(id, ventaData) {
    return await this.put(`/ventas/${id}`, ventaData);
  }

  async deleteVenta(id) {
    return await this.delete(`/ventas/${id}`);
  }

  async getMineralesVenta() {
    return await this.get('/ventas/minerales');
  }

  async createMineralVenta(mineralData) {
    return await this.post('/ventas/minerales', mineralData);
  }

  async searchVentas(filters) {
    const queryParams = new URLSearchParams(filters).toString();
    return await this.get(`/ventas/search?${queryParams}`);
  }

  async getVentasStats() {
    return await this.get('/ventas/stats');
  }
}

class SalaService extends ApiService {
  async getAllSalas() {
    return await this.get('/salas');
  }

  async getSalaById(id) {
    return await this.get(`/salas/${id}`);
  }

  async createSala(salaData) {
    return await this.post('/salas', salaData);
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