const ExcelJS = require('exceljs')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { pool } = require('../config/db')

// Multer in-memory storage (we'll stream buffers) with file size limit
const storage = multer.memoryStorage()
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } }) // 100 MB

// Helper: ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
}

// Save buffer as file (auto-generate name)
function saveImageBuffer(buffer, destDir, ext = 'jpg') {
  ensureDir(destDir)
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`
  const filePath = path.join(destDir, fileName)
  fs.writeFileSync(filePath, buffer)
  return fileName
}

// Detect image extension from buffer header
function detectImageExt(buffer) {
  if (!buffer || buffer.length < 4) return 'jpg'
  const hex = buffer.toString('hex', 0, 4).toUpperCase()
  if (hex.startsWith('FFD8')) return 'jpg'
  if (hex.startsWith('89504E47')) return 'png'
  if (hex.startsWith('47494638')) return 'gif'
  return 'jpg'
}

// Main controller handler: expects multipart/form-data with field 'file'
exports.importExcel = [
  upload.single('file'),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded (field name: file)' })

    const workbook = new ExcelJS.Workbook()
    try {
      await workbook.xlsx.load(req.file.buffer)
    } catch (err) {
      console.error('Failed to read workbook', err)
      return res.status(400).json({ error: 'Invalid Excel file' })
    }

    // Images are stored in workbook.media as WorkbookMedia objects in exceljs
    // We'll build a map of imageId -> {buffer, extension}
    const mediaMap = new Map()
    try {
      if (workbook.creator) {
        // workbook model exists
      }
      // exceljs stores images in workbook.media (array)
      if (Array.isArray(workbook.media)) {
        workbook.media.forEach((m, idx) => {
          if (m && m.buffer) {
            const ext = detectImageExt(m.buffer)
            mediaMap.set(idx + 1, { buffer: m.buffer, ext })
          }
        })
      }
    } catch (err) {
      console.warn('Error while enumerating media', err)
    }

    // We'll take the first worksheet
    const worksheet = workbook.worksheets[0]
    if (!worksheet) return res.status(400).json({ error: 'Workbook contains no sheets' })

    // Build rows as objects using header row (first row)
    const rows = []
    const headerRow = worksheet.getRow(1)
    const headers = []
    headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      headers[colNumber] = String(cell.value).trim()
    })

    // Map images from ExcelJS: each image has ranges; we map by row
    const imageByRow = new Map()
    try {
      const images = worksheet.getImages ? worksheet.getImages() : []
      images.forEach(img => {
        // img: {imageId, range}
        const { imageId, range } = img
        // range may be {tl: {row, col}, br: {row, col}} or {tl, br}
        let row = null
        if (range && range.tl && typeof range.tl.row === 'number') row = range.tl.row
        else if (range && range.native && range.native.tl && range.native.tl.r) row = range.native.tl.r + 1 // best-effort
        if (row) {
          imageByRow.set(row, imageId)
        }
      })
    } catch (err) {
      console.warn('Could not map worksheet images via getImages()', err)
    }

    // Iterate data rows (starting from row 2)
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return
      const obj = {}
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const key = headers[colNumber] || `col_${colNumber}`
        obj[key] = cell.value
      })
      // attach image id if present
      if (imageByRow.has(rowNumber)) obj.__imageId = imageByRow.get(rowNumber)
      rows.push(obj)
    })

    // Destination folder for saved images
    const imagesDir = path.join(__dirname, '..', '..', 'public', 'images', 'minerales')
    ensureDir(imagesDir)

    // Prepare DB insertion batches
    const batchSize = 200
    let inserted = 0
    const failedRows = []

    // We'll assume columns in DB: nombre, descripcion, imagen_mineral (we'll store path), precio, etc.
    // Since schema may vary, user may need to adjust the mapping below.

    // Helper to map a row object to DB values (adjust as your table schema)
    function mapRowToDbValues(rowObj, savedImageFileName) {
      // Example mapping: change according to your `minerales` table
      // We'll try to detect common fields: nombre, descripcion, precio, stock
      const nombre = rowObj['nombre'] || rowObj['Nombre'] || ''
      const descripcion = rowObj['descripcion'] || rowObj['Descripcion'] || ''
      const precio = rowObj['precio'] || rowObj['Precio'] || null
      const stock = rowObj['stock'] || rowObj['Stock'] || null
      const imagen_path = savedImageFileName ? `/images/minerales/${savedImageFileName}` : null
      return { nombre, descripcion, precio, stock, imagen_path }
    }

    // Build an array of mapped rows with image saved file name
    const mappedRows = []
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]
      let savedFileName = null
      if (r.__imageId && mediaMap.has(r.__imageId)) {
        try {
          const media = mediaMap.get(r.__imageId)
          const ext = media.ext || detectImageExt(media.buffer)
          savedFileName = saveImageBuffer(media.buffer, imagesDir, ext)
        } catch (err) {
          console.warn('Failed saving image for row', i + 2, err)
        }
      }
      mappedRows.push(mapRowToDbValues(r, savedFileName))
    }

    // Insert in batches
    try {
      for (let i = 0; i < mappedRows.length; i += batchSize) {
        const chunk = mappedRows.slice(i, i + batchSize)
        // Build bulk insert SQL based on available keys
        // We'll insert into 'minerales' table with columns (nombre, descripcion, precio, stock, imagen_mineral)
        const columns = ['nombre', 'descripcion', 'precio', 'stock', 'imagen_mineral']
        const values = []
        const placeholders = []
        chunk.forEach(row => {
          placeholders.push('(?, ?, ?, ?, ?)')
          values.push(row.nombre)
          values.push(row.descripcion)
          values.push(row.precio)
          values.push(row.stock)
          values.push(row.imagen_path)
        })
        const sql = `INSERT INTO minerales (${columns.join(',')}) VALUES ${placeholders.join(',')}`
        await pool.query(sql, values)
        inserted += chunk.length
      }
    } catch (err) {
      console.error('Batch insert failed', err)
      return res.status(500).json({ error: 'Database insert failed', detail: err.message })
    }

    return res.json({ inserted, total: mappedRows.length, failed: failedRows.length })
  }
]
