import fs from 'fs';

// Leer el archivo
const csvContent = fs.readFileSync('pureba.csv', 'utf-8');

// Dividir en líneas
const lines = csvContent.split('\n');

// Procesar cada línea
const fixedLines = lines.map(line => {
  if (!line.trim()) return line; // Líneas vacías
  
  // Separar por comas, pero mantener las que están entre comillas
  const fields = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
      currentField += char;
    } else if (char === ',' && !inQuotes) {
      fields.push(currentField.trim());
      currentField = '';
    } else {
      currentField += char;
    }
  }
  
  // Agregar el último campo
  if (currentField) {
    fields.push(currentField.trim());
  }
  
  // Envolver cada campo en comillas dobles si no las tiene
  const fixedFields = fields.map(field => {
    // Si ya tiene comillas, mantenerlo
    if (field.startsWith('"') && field.endsWith('"')) {
      return field;
    }
    // Si está vacío
    if (!field) {
      return '""';
    }
    // Escapar comillas internas y envolver
    const escaped = field.replace(/"/g, '""');
    return `"${escaped}"`;
  });
  
  return fixedFields.join(',');
});

// Escribir el archivo corregido
fs.writeFileSync('pureba_fixed.csv', fixedLines.join('\n'));
console.log('✅ Archivo CSV corregido guardado como: pureba_fixed.csv');