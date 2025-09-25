// js/asignarSala.js
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL + '/api/addinventario';


export async function asignarSalaVitrina(data) {
  const token = localStorage.getItem('token')

  const response = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}
