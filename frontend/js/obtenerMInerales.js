import { inventarioService } from '../src/services/api.js'

/**
 * Obtiene todos los minerales y su información asociada para una sala específica
 * @param {number|string} idSala - El ID de la sala a consultar
 * @returns {Promise<Array>} Array de objetos con información completa de minerales
 */
export async function obtenerMineralesPorSala(idSala) {
  try {
    console.log('🔍 Obteniendo minerales para sala:', idSala)
    
    // Usar búsqueda de inventario con filtro de sala
    const response = await inventarioService.searchInventario({ sala: idSala })
    
    console.log('📊 Respuesta de minerales por sala:', response)
    
    // Verificar si la respuesta tiene la estructura esperada
    let data = response
    if (response.success && response.data) {
      data = response.data
    }

    // Validación básica de la respuesta
    if (!data || !Array.isArray(data)) {
      console.warn('⚠️ Respuesta no es un array válido:', data)
      return []
    }

    console.log('✅ Datos válidos encontrados:', data.length, 'items')

    // Mapeamos la estructura que devuelve la API (campos aplanados del JOIN)
    const processedData = data.map((item, index) => {
      console.log(`🔍 [${index + 1}/${data.length}] Procesando item del inventario:`, item);
      
      const processed = {
        id_invent: item.id_invent || null,
        mineral: {
          id_mineral: item.id_mineral || null,
          nombre_mineral: item.nombre_mineral || 'Mineral sin nombre',
          procedencia_mineral: item.procedencia_mineral || 'Procedencia desconocida', 
          descripcion_mineral: item.descripcion_mineral || 'Sin descripción disponible',
          imagen_mineral: item.imagen_mineral || null,
          clave_mineral: item.clave_mineral || null,
          tipo: item.tipo || null
        },
        vitrina: item.vitrina || 'N/D',
        ubicacion: item.ubicacion || 'Ubicación no especificada',
        estatus: item.estatus_inventario || item.estatus || 'Desconocido',
        sala: item.sala || null
      }
      
      console.log(`✅ [${index + 1}/${data.length}] Item procesado:`, processed);
      return processed;
    })
    
    console.log('🎯 RESULTADO FINAL - Minerales procesados para retornar:', processedData);
    return processedData;

  } catch (error) {
    console.error('Error al obtener minerales por sala:', error)
    return []
  }
}