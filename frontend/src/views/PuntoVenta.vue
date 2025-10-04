<script>
import Nav from '../components/Nav.vue'
import Header from '../components/Header.vue'
</script>

<template>
    <Header />
  <div class="container mt-4">
    <h2>Punto de Venta - Minerales</h2>

    <div class="row">
      <div class="col-md-7">
        <div class="mb-3 d-flex">
          <input v-model="search" class="form-control me-2" placeholder="Buscar mineral por nombre o clave" />
          <select v-model="filter" class="form-select" style="width:180px">
            <option value="">Todos</option>
            <option value="">Disponibles</option>
          </select>
        </div>

        <div v-if="loading" class="alert alert-info">Cargando minerales...</div>
        <div v-else>
          <div class="list-group">
            <div v-for="item in filteredMinerales" :key="item.id_mineral" class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{{ item.nombre }}</strong>
                <div class="text-muted small">{{ item.clave }}</div>
                <div class="text-success small" v-if="item.cantidad">Stock: {{ item.cantidad }}</div>
              </div>
              <div class="text-end">
                <div class="mb-1">{{ formatCurrency(item.precio_final || item.precio) }}</div>
                <button 
                  class="btn btn-sm btn-primary" 
                  @click="addToCart(item)"
                  :disabled="!item.cantidad || item.cantidad <= 0"
                >
                  {{ item.cantidad > 0 ? 'Agregar' : 'Sin stock' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-5">
        <h5>Carrito</h5>
        <div v-if="cart.length === 0" class="alert alert-secondary">Carrito vacío</div>

        <div v-else>
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Artículo</th>
                <th style="width:100px">Cant</th>
                <th style="width:120px">Precio</th>
                <th style="width:80px">Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, idx) in cart" :key="c.id_mineral">
                <td>{{ c.nombre }}</td>
                <td>
                  <input type="number" v-model.number="c.qty" min="1" class="form-control form-control-sm" />
                </td>
                <td>{{ formatCurrency(c.precio_final || c.precio) }}</td>
                <td>{{ formatCurrency((c.precio_final || c.precio) * c.qty) }}</td>
                <td><button class="btn btn-sm btn-danger" @click="removeFromCart(idx)">✕</button></td>
              </tr>
            </tbody>
          </table>

          <div class="mt-2">
            <div class="d-flex justify-content-between"><span>Subtotal</span><strong>{{ formatCurrency(subtotal) }}</strong></div>
            <div class="d-flex justify-content-between"><span>IVA (16%)</span><strong>{{ formatCurrency(iva) }}</strong></div>
            <div class="d-flex justify-content-between"><span>Total</span><strong>{{ formatCurrency(total) }}</strong></div>
          </div>

          <div class="mt-3">
            <div class="mb-2">
              <label class="form-label">Usuario:</label>
              <div>{{ currentUser && (currentUser.nombre || currentUser.name || currentUser.username) ? (currentUser.nombre || currentUser.name || currentUser.username) : 'Invitado' }}</div>
            </div>
            <button class="btn btn-success w-100" :disabled="cart.length===0 || processing" @click="checkout">Cobrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ventasService, authService } from '../services/api.js'

const minerales = ref([])
const loading = ref(false)
const search = ref('')
const filter = ref('')
const cart = ref([])
const processing = ref(false)
const currentUser = ref(null)

onMounted(async () => {
  loading.value = true
  try {
  const data = await ventasService.getMineralesVenta()
  minerales.value = data || []
  const user = authService.getCurrentUser()
  if (user) currentUser.value = user
  } catch (err) {
    console.error('Error cargando minerales para venta:', err)
  } finally {
    loading.value = false
  }
})

const filteredMinerales = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return minerales.value
  return minerales.value.filter(m => (
    (m.nombre || '').toLowerCase().includes(q) ||
    (m.clave || '').toLowerCase().includes(q)
  ))
})

function addToCart(item) {
  const existing = cart.value.find(c => c.id_mineral === item.id_mineral)
  if (existing) existing.qty++
  else cart.value.push({ ...item, qty: 1 })
}

function removeFromCart(index) {
  cart.value.splice(index, 1)
}

const subtotal = computed(() => {
  return cart.value.reduce((s, it) => s + (it.precio_final || it.precio || 0) * (it.qty || 1), 0)
})

const iva = computed(() => +(subtotal.value * 0.16).toFixed(2))
const total = computed(() => +(subtotal.value + iva.value).toFixed(2))

function formatCurrency(v) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v || 0)
}

async function checkout() {
  console.log('🛒 INICIANDO CHECKOUT');
  console.log('🛒 Token en localStorage:', localStorage.getItem('token'));
  console.log('🛒 Usuario en localStorage:', localStorage.getItem('user'));
  console.log('🛒 currentUser.value:', currentUser.value);

  processing.value = true
  try {
    // Build minerales array expected by backend: array of { id_mineral_venta }
    const items = []
    for (const it of cart.value) {
      const id = it.id_mineral || it.id_mineral_venta || it.id_mineral
      for (let i = 0; i < (it.qty || 1); i++) items.push({ id_mineral_venta: id })
    }

    const payload = {
      subtotal: +subtotal.value.toFixed(2),
      iva: +iva.value.toFixed(2),
      total: +total.value.toFixed(2),
      minerales: items
    }

    console.log('🛒 Enviando payload:', payload);
    const res = await ventasService.createVenta(payload)
    console.log('🛒 Respuesta recibida:', res);
    
    if (res && res.success) {
      alert('Venta registrada correctamente' + (res.data && res.data.id_ventas ? ` (ID ${res.data.id_ventas})` : ''))
      cart.value = []
    } else {
      console.error('🛒 Respuesta no exitosa:', res);
      alert('Error al registrar la venta: ' + (res && res.error ? res.error : 'Respuesta inesperada'))
    }
  } catch (err) {
    console.error('Error creating sale:', err)
    alert('Error al crear venta: ' + (err.message || err))
  } finally {
    processing.value = false
  }
}
</script>

<style scoped>
.list-group-item { cursor: default }
</style>
