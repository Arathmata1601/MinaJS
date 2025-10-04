import fs from 'fs';

const csvContent = fs.readFileSync('pureba_fixed.csv', 'utf-8');

// Cambiar formato de fecha de DD/MM/YYYY a YYYY-MM-DD
const fixedContent = csvContent.replace(/29\/01\/2025/g, '2025-01-29');

fs.writeFileSync('pureba_final.csv', fixedContent);
console.log('✅ Fecha corregida a formato MySQL: 2025-01-29');