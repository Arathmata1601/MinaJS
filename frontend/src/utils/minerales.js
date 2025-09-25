import { mineralService } from '../services/api.js'

export async function obtenerMineralesTipo() {
  console.log('=== OBTENIENDO MINERALES POR TIPO ===');
  
  try {
    console.log('Llamando a mineralService.getMineralByMineral()...');
    // Usar el servicio centralizado en lugar de axios directo
    const response = await mineralService.getMineralByMineral()
    
    console.log('Respuesta recibida:', response);
    
    if (!response || !Array.isArray(response)) {
      console.warn('Respuesta no es un array válido:', response);
      return []
    }

    const processedData = response.map(item => {
      console.log('Procesando item:', item);
      
      // Convertir imagen Buffer a Base64 string si existe
      let imagenString = null
      if (item.imagen_mineral) {
        if (typeof item.imagen_mineral === 'object' && item.imagen_mineral.type === 'Buffer') {
          // Convertir Buffer a Base64
          const uint8Array = new Uint8Array(item.imagen_mineral.data)
          const binary = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '')
          imagenString = `data:image/jpeg;base64,${btoa(binary)}`
          console.log('Imagen convertida de Buffer a Base64');
        } else if (typeof item.imagen_mineral === 'string') {
          // Ya es string, usarla directamente
          imagenString = item.imagen_mineral
          console.log('Imagen ya es string');
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
    });
    
    console.log('Datos procesados:', processedData);
    return processedData;
    
  } catch (error) {
    console.error('Error al obtener minerales:', error)
    console.error('Error stack:', error.stack);
    return []
  }
}
