import { mineralService } from '../services/api.js'

export async function eliminarMineral(id_mineral) {
  try {
    // Usar el servicio centralizado en lugar de axios directo
    await mineralService.deleteMineral(id_mineral)
    return true; // Mineral eliminado exitosamente
  } catch (error) {
    console.error("Error al eliminar el mineral:", error);
    return false; // Error al eliminar el mineral
  }
}