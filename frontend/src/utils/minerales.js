import { mineralService } from '../services/api.js'

export async function obtenerMineralesTipo() {
  console.log('=== OBTENIENDO MINERALES POR TIPO ===');
  
  try {
    console.log('Llamando a mineralService.getMineralByMineral()...');
    const t0 = performance.now();
    // Usar el servicio centralizado en lugar de axios directo
    const response = await mineralService.getMineralByMineral()
    const t1 = performance.now();
    console.log(`API responded in ${(t1 - t0).toFixed(2)} ms`);

    console.log('Respuesta recibida (summary):', Array.isArray(response) ? `Array length=${response.length}` : response);
    
    if (!response || !Array.isArray(response)) {
      console.warn('Respuesta no es un array válido:', response);
      return []
    }

    // IMPORTANTE: para evitar bloquear el hilo principal, NO convertimos aquí Buffers grandes a Base64.
    // En su lugar mantenemos strings si ya vienen en ese formato, o null si vienen como Buffer.
    // Esto acelera la carga. La conversión/descarga de la imagen se debe hacer bajo demanda (lazy-load) o en un Web Worker.
    const startProcess = performance.now();
    const processedData = response.map(item => {
      let imagenString = null
      if (item.imagen_mineral) {
        if (typeof item.imagen_mineral === 'string') {
          // Ya es string (probablemente base64 o URL) — lo usamos directamente
          imagenString = item.imagen_mineral
        } else {
          // Si viene como Buffer u objeto binario, lo saltamos aquí para no bloquear la UI
          imagenString = null
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
    const endProcess = performance.now();
    console.log(`Procesamiento (map) de ${response.length} items: ${(endProcess - startProcess).toFixed(2)} ms`);
    return processedData;
    
  } catch (error) {
    console.error('Error al obtener minerales:', error)
    console.error('Error stack:', error.stack);
    return []
  }
}
