-- Agregar columna cantidad a la tabla minerales_venta
-- EJECUTA ESTO EN TU BASE DE DATOS:

ALTER TABLE minerales_venta ADD COLUMN cantidad INT DEFAULT 0;

-- Actualizar algunos registros con cantidad para pruebas:
UPDATE minerales_venta SET cantidad = 10 WHERE id_mineral = 1;
UPDATE minerales_venta SET cantidad = 5 WHERE id_mineral = 2;
UPDATE minerales_venta SET cantidad = 8 WHERE id_mineral = 3;

-- Verificar que se agregó correctamente:
DESCRIBE minerales_venta;
SELECT * FROM minerales_venta;