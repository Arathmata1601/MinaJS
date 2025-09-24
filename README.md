# Sistema Mina - Frontend + Backend

## 🚀 Configuración y Ejecución

### Backend (Node.js + Express)

1. **Navegar al directorio del backend:**
   ```bash
   cd backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar la base de datos:**
   - Asegúrate de que MySQL esté ejecutándose
   - Importa el archivo `src/config/mina.sql` en tu base de datos MySQL
   - Verifica la configuración en `src/config/db.js`

4. **Ejecutar el backend:**
   ```bash
   node index.js
   ```
   
   El servidor estará disponible en: `http://localhost:5020`

### Frontend (Vue.js)

1. **Navegar al directorio del frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar el frontend:**
   ```bash
   npm run dev
   ```
   
   La aplicación estará disponible en: `http://localhost:5173`

## 📋 Funcionalidades Implementadas

### 🔐 Autenticación
- **Login:** `POST /api/auth/login`
- **Middleware JWT** para rutas protegidas
- **Roles de usuario:** admin, supervisor, vendedor, curator

### 👥 Usuarios
- **Listar usuarios:** `GET /api/users`
- **Crear usuario:** `POST /api/users` (solo admin)

### 💎 Minerales
- **Listar minerales:** `GET /api/mineral`
- **Crear mineral:** `POST /api/mineral`
- **Actualizar mineral:** `PUT /api/mineral/:id`
- **Eliminar mineral:** `DELETE /api/mineral/:id`

### 📦 Inventario
- **Listar inventario:** `GET /api/inventario`
- **Crear registro:** `POST /api/inventario`
- **Buscar:** `GET /api/inventario/search`
- **Minerales disponibles:** `GET /api/inventario/minerales-disponibles`

### 💰 Ventas
- **Listar ventas:** `GET /api/ventas`
- **Crear venta:** `POST /api/ventas`
- **Estadísticas:** `GET /api/ventas/stats`
- **Minerales para venta:** `GET /api/ventas/minerales`

## 🔧 Configuración de Base de Datos

**Credenciales por defecto:**
- **Host:** localhost
- **Usuario:** MinaUser
- **Contraseña:** 95RPR0pfqsG2j8!8
- **Base de datos:** mina

## 👤 Usuario por Defecto

Para probar el login:
- **Usuario:** claudia.rosales
- **Contraseña:** (la contraseña que esté hasheada en la BD)

## 🛠️ Estructura del Proyecto

```
├── backend/
│   ├── src/
│   │   ├── config/         # Configuración de BD
│   │   ├── controllers/    # Controladores
│   │   ├── models/         # Modelos de datos
│   │   ├── routes/         # Rutas de la API
│   │   └── middlewares/    # Middlewares (auth)
│   └── index.js           # Punto de entrada
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes Vue
│   │   ├── views/         # Vistas/Páginas
│   │   ├── services/      # Servicios API
│   │   └── router/        # Configuración de rutas
```

## 🔍 Características Técnicas

- **Backend:** Node.js, Express, MySQL2, JWT, bcrypt
- **Frontend:** Vue 3, Composition API, Vite
- **Seguridad:** CORS habilitado, autenticación JWT, roles de usuario
- **Base de datos:** MySQL con transacciones y relaciones

## 🐛 Solución de Problemas

1. **Error de CORS:** El CORS ya está configurado para localhost:5173
2. **Error de conexión:** Verifica que ambos servidores estén ejecutándose
3. **Error 401:** El token puede haber expirado, vuelve a iniciar sesión
4. **Error de BD:** Verifica que MySQL esté ejecutándose y las credenciales sean correctas
