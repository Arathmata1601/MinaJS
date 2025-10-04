-- Eliminar columna id_user de la tabla venta
-- EJECUTA ESTO EN TU BASE DE DATOS:

ALTER TABLE venta DROP COLUMN id_user;

-- Verificar que se eliminó correctamente:
DESCRIBE venta;