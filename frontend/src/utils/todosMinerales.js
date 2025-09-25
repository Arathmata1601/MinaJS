import { mineralService } from '../services/api.js'

export async function obtenerMinerales() {
  try {
    // Obtener todos los minerales y filtrar por estatus "Almacen"
    const response = await mineralService.getAllMinerals()
    
    if (!response || !Array.isArray(response)) return []

    // Filtrar por estatus "Almacen"
    const mineralesEnAlmacen = response.filter(item => item.estatus === 'Almacen')

    return mineralesEnAlmacen.map(item => ({
      id_mineral: item.id_mineral || null,
      clave_mineral: item.clave_mineral || 'Sin clave',
      nombre_mineral: item.nombre_mineral || 'Sin nombre',
      //procedencia_mineral: item.procedencia_mineral || 'Desconocida',
      //descripcion_mineral: item.descripcion_mineral || 'Sin descripción',
      //imagen_mineral: item.imagen_mineral || null
    }))
  } catch (error) {
    console.error('Error al obtener minerales:', error)
    return []
  }
}
