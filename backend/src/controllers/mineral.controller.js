const Mineral = require("../models/mineral.model");

const getAllMinerals = async (req, res) => {
  try {
    const minerals = await Mineral.getAllMinerals();
    // Remove heavy image blobs before sending to client
    const sanitized = minerals.map(m => {
      const copy = { ...m };
      if (copy.hasOwnProperty('imagen_mineral')) {
        copy.has_image = !!copy.imagen_mineral;
        // remove raw blob to avoid huge JSON
        delete copy.imagen_mineral;
      }
      return copy;
    })

    res.json({
      success: true,
      data: sanitized
    });
  } catch (err) {
    console.error("Error al obtener minerales:", err);
    res.status(500).json({ 
      success: false,
      error: "Error al obtener minerales" 
    });
  }
};

const getMineralByMineral = async (req, res) => {
  try {
    const minerals = await Mineral.getMineralByMineral();
    const sanitized = minerals.map(m => {
      const copy = { ...m };
      if (copy.hasOwnProperty('imagen_mineral')) {
        copy.has_image = !!copy.imagen_mineral;
        delete copy.imagen_mineral;
      }
      return copy;
    })

    res.json({
      success: true,
      data: sanitized
    });
  } catch (err) {
    console.error("Error al obtener minerales por tipo:", err);
    res.status(500).json({ 
      success: false,
      error: "Error al obtener minerales" 
    });
  }
};

const getMineralByFosil = async (req, res) => {
  try {
    const fossils = await Mineral.getMineralByFosil();
    const sanitized = fossils.map(m => {
      const copy = { ...m };
      if (copy.hasOwnProperty('imagen_mineral')) {
        copy.has_image = !!copy.imagen_mineral;
        delete copy.imagen_mineral;
      }
      return copy;
    })

    res.json({
      success: true,
      data: sanitized
    });
  } catch (err) {
    console.error("Error al obtener fósiles:", err);
    res.status(500).json({ 
      success: false,
      error: "Error al obtener fósiles" 
    });
  }
};

const createMineral = async (req, res) => {
  try {
    console.log('📥 Recibiendo datos para crear mineral:', req.body)
    
    const result = await Mineral.createMineral(req.body)
    
    console.log('✅ Mineral creado exitosamente:', result)
    res.status(201).json({
      success: true,
      message: 'Mineral creado exitosamente',
      data: result
    })
  } catch (error) {
    console.error('❌ Error creando mineral:', error)
    res.status(500).json({
      success: false,
      message: 'Error al crear mineral',
      error: error.message
    })
  }
};

const getMineralById = async (req, res) => {
  try {
    const mineral = await Mineral.getMineralById(req.params.id);
    if (mineral) {
      const copy = { ...mineral };
      if (copy.hasOwnProperty('imagen_mineral')) {
        copy.has_image = !!copy.imagen_mineral;
        delete copy.imagen_mineral;
      }
      res.json({ success: true, data: copy });
    } else {
      res.status(404).json({ success: false, error: 'Mineral not found' });
    }
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: "Error al obtener mineral" 
    });
  }
};

// Servir la imagen del mineral directamente (content-type apropiado)
const getMineralImage = async (req, res) => {
  try {
    const mineral = await Mineral.getMineralById(req.params.id);
    if (!mineral || !mineral.imagen_mineral) {
      return res.status(404).send('Image not found');
    }

    const img = mineral.imagen_mineral;

    // Helper: detect common base64 image signatures
    const looksLikeBase64 = (s) => {
      if (!s) return false;
      // common JPEG/PNG base64 starts
      return typeof s === 'string' && (s.startsWith('/9j/') || s.startsWith('iVBORw0'));
    }

    // Si ya es una data URL
    if (typeof img === 'string' && img.startsWith('data:image')) {
      const match = img.match(/^data:(image\/[a-zA-Z0-9+-.]+);base64,(.*)$/);
      if (match) {
        const mime = match[1];
        const b64 = match[2];
        const buffer = Buffer.from(b64, 'base64');
        res.setHeader('Content-Type', mime);
        return res.send(buffer);
      }
    }

    // Si es string base64 (sin data: prefix)
    if (typeof img === 'string') {
      // heurística: si parece base64 (inicia con patrón de jpeg/png), decodificar
      if (looksLikeBase64(img)) {
        const buffer = Buffer.from(img, 'base64');
        // intentar detectar tipo por encabezado
        const mime = buffer.slice(0, 4).toString('hex').startsWith('ffd8') ? 'image/jpeg' : 'application/octet-stream';
        res.setHeader('Content-Type', mime);
        return res.send(buffer);
      }
      // fallback: intentar decodificar de todos modos
      try {
        const buffer = Buffer.from(img, 'base64');
        res.setHeader('Content-Type', 'image/jpeg');
        return res.send(buffer);
      } catch (e) {
        // no es base64 válido, seguir
      }
    }

    // Si viene como objeto con data: [bytes]
    if (img && img.data && Array.isArray(img.data)) {
      const buffer = Buffer.from(img.data);
      res.setHeader('Content-Type', 'image/jpeg');
      return res.send(buffer);
    }

    // Si viene como Buffer desde MySQL (BIN)
    if (Buffer.isBuffer(img)) {
      // puede que el Buffer contenga texto base64 (en tu SQL se ve 0x2f396a2f... que es '/9j/...')
      const asString = img.toString('utf8');
      if (looksLikeBase64(asString)) {
        const buffer = Buffer.from(asString, 'base64');
        const mime = buffer.slice(0, 4).toString('hex').startsWith('ffd8') ? 'image/jpeg' : 'application/octet-stream';
        res.setHeader('Content-Type', mime);
        return res.send(buffer);
      }

      // Si es realmente binario JPEG/PNG, enviar tal cual (intentar detectar)
      const headerHex = img.slice(0, 4).toString('hex');
      if (headerHex.startsWith('ffd8')) {
        res.setHeader('Content-Type', 'image/jpeg');
        return res.send(img);
      }
      if (headerHex.startsWith('89504e47')) {
        res.setHeader('Content-Type', 'image/png');
        return res.send(img);
      }

      // Finalmente, si no sabemos, enviar como octet-stream
      res.setHeader('Content-Type', 'application/octet-stream');
      return res.send(img);
    }

    // Fallback: devolver 404
    return res.status(404).send('Image format not supported');
  } catch (err) {
    console.error('Error sirviendo imagen:', err);
    res.status(500).send('Server error');
  }
}

const updateMineral = async (req, res) => {
  try {
    const updatedMineral = await Mineral.updateMineral(req.params.id, req.body);
    res.json({
      success: true,
      data: updatedMineral
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: "Error al actualizar mineral" 
    });
  }
};

const deleteMineral = async (req, res) => {
  try {
    await Mineral.deleteMineral(req.params.id);
    res.json({
      success: true,
      message: "Mineral eliminado exitosamente"
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: "Error al eliminar mineral" 
    });
  }
};

module.exports = {
  getAllMinerals,
  getMineralByMineral,
  getMineralByFosil,
  createMineral,
  getMineralById,
  getMineralImage,
  updateMineral,
  deleteMineral,
};
