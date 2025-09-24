// src/js/mineralesAPI.js
import { mineralService } from '../src/services/api.js'

export async function guardarMineral(mineralData) {
  try {
    let imagenBase64 = null

    if (mineralData.imagen_mineral && mineralData.imagen_mineral.length > 0) {
      const uint8Array = new Uint8Array(mineralData.imagen_mineral)
      const binary = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '')
      imagenBase64 = `data:image/jpeg;base64,${btoa(binary)}`
    }

    const datosParaEnviar = {
      clave_mineral: mineralData.clave_mineral,
      nombre_mineral: mineralData.nombre_mineral,
      descripcion_mineral: mineralData.descripcion_mineral,
      procedencia_mineral: mineralData.procedencia_mineral,
      tipo: mineralData.tipo,
      imagen_mineral_base64: imagenBase64
    }

    // Usar el servicio centralizado en lugar de axios directo
    const response = await mineralService.createMineral(datosParaEnviar)
    return response
    
  } catch (error) {
    console.error('Error al guardar el mineral:', error)
    throw error
  }
}


