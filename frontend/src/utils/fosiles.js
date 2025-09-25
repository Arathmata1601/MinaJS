import { mineralService } from '../services/api.js'

export async function obtenerMineralesTipo() {
  try {
    // Usar el servicio centralizado para obtener fósiles
    const response = await mineralService.getMineralByFosil()
    
    if (!response || !Array.isArray(response)) return []

    return response.map(item => {
      // Convertir imagen Buffer a Base64 string si existe
      let imagenString = null
      if (item.imagen_mineral) {
        if (typeof item.imagen_mineral === 'object' && item.imagen_mineral.type === 'Buffer') {
          // Convertir Buffer a Base64
          const uint8Array = new Uint8Array(item.imagen_mineral.data)
          const binary = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '')
          imagenString = `data:image/jpeg;base64,${btoa(binary)}`
        } else if (typeof item.imagen_mineral === 'string') {
          // Ya es string, usarla directamente
          imagenString = item.imagen_mineral
        }
      }

      return {
        id_mineral: item.id_mineral || null,
        clave_mineral: item.clave_mineral || 'Sin clave',
        nombre_mineral: item.nombre_mineral || 'Sin nombre',
        procedencia_mineral: item.procedencia_mineral || 'Desconocida',
        descripcion_mineral: item.descripcion_mineral || 'Sin descripción',
        imagen_mineral: imagenString
      }
    })
  } catch (error) {
    console.error('Error al obtener minerales:', error)
    return []
  }
}
