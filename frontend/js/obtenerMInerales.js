import axios from 'axios'

//const API_URL = 'http://localhost:5020/api/inventario/sala/'
const API_URL = import.meta.env.VITE_API_URL + '/api/inventario/sala/';

/**
 * Obtiene todos los minerales y su información asociada para una sala específica
 * @param {number|string} idSala - El ID de la sala a consultar
 * @returns {Promise<Array>} Array de objetos con información completa de minerales
 */
export async function obtenerMineralesPorSala(idSala) {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No se encontró token de autenticación')
    }

    const response = await axios.get(`${API_URL}${idSala}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    // Validación básica de la respuesta
    if (!response.data || !Array.isArray(response.data)) {
      return []
    }

    // Mapeamos directamente la estructura que devuelve la API
    return response.data.map(item => ({
      id_invent: item.id_invent || null,
      mineral: {
        id_mineral: item.mineral?.id_mineral || null,
        nombre_mineral: item.mineral?.nombre_mineral || 'Mineral sin nombre',
        procedencia_mineral: item.mineral?.procedencia_mineral || 'Procedencia desconocida',
        descripcion_mineral: item.mineral?.descripcion_mineral || 'Sin descripción disponible',
        imagen_mineral: item.mineral?.imagen_mineral || null
      },
      vitrina: item.vitrina || 'N/D',
      ubicacion: item.ubicacion || 'Ubicación no especificada',
      estatus: item.estatus || 'Desconocido'
    }))

  } catch (error) {
    console.error('Error al obtener minerales por sala:', error)
    return []
  }
}