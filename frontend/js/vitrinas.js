// src/api/vitrinas.js
import { salaService } from '../src/services/api.js'

export async function obtenerVitrinasPorSala(idSala) {
  try {
    console.log('🔍 Obteniendo vitrinas para sala:', idSala)
    
    // Usar el servicio de salas para obtener información de la sala
    const sala = await salaService.getSalaById(idSala)
    
    console.log('📊 Respuesta de la sala:', sala)
    
    // Extraer el número de vitrinas
    const numVitrinas = sala?.num_vitrinas || 0
    
    console.log('🏛️ Número de vitrinas encontradas:', numVitrinas)
    
    return numVitrinas
  } catch (error) {
    console.error('❌ Error al obtener vitrinas:', error)
    return 0
  }
}
