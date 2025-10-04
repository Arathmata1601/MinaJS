// Worker para convertir datos binarios a Base64
self.onmessage = async (e) => {
  try {
    const payload = e.data
    let buffer
    // payload puede ser Array, ArrayBuffer, o {data: [bytes]}
    if (payload instanceof ArrayBuffer) {
      buffer = new Uint8Array(payload)
    } else if (Array.isArray(payload)) {
      buffer = new Uint8Array(payload)
    } else if (payload && payload.data && Array.isArray(payload.data)) {
      buffer = new Uint8Array(payload.data)
    } else if (payload && payload.data && payload.data.buffer) {
      buffer = new Uint8Array(payload.data.buffer)
    } else {
      throw new Error('Formato de payload no soportado por worker')
    }

    // Convertir a binario string
    let binary = ''
    const chunkSize = 0x8000
    for (let i = 0; i < buffer.length; i += chunkSize) {
      const slice = buffer.subarray(i, i + chunkSize)
      binary += String.fromCharCode.apply(null, slice)
    }

    const base64 = btoa(binary)
    self.postMessage({ success: true, base64 })
  } catch (err) {
    self.postMessage({ success: false, error: err.message })
  }
}
