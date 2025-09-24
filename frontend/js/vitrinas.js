// src/api/vitrinas.js
import axios from 'axios'

//const API_URL = 'http://localhost:5020/api/vitrinas/por-sala/' // ajusta si es necesario
const API_URL = import.meta.env.VITE_API_URL + '/api/vitrinas/por-sala/';


export async function obtenerVitrinasPorSala(idSala) {
  try {
    const token = localStorage.getItem('token') // o sessionStorage si lo guardaste ahí

    const response = await axios.get(`${API_URL}${idSala}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    console.log('Respuesta cruda desde la API:', response.data)
    return response.data[0]?.num_vitrinas || 0
  } catch (error) {
    console.error('Error al obtener vitrinas:', error)
    return []
  }
}
