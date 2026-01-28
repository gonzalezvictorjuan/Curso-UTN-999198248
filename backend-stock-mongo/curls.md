# API Endpoints - Ejemplos de CURL

Este archivo contiene ejemplos de CURL para todos los endpoints del proyecto backend-stock-mongo.

**URL Base:** `http://localhost:3000`

---

## 🔐 Autenticación (Auth)

### 1. Registrar un nuevo usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### 2. Login (obtener token JWT)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
		"email": "pepe@example.com", "password":"Password123!"
  }'
```

**Respuesta esperada:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 📂 Categorías

### 3. Obtener todas las categorías (sin autenticación)

```bash
curl -X GET http://localhost:3000/api/categoria
```

### 4. Obtener una categoría por ID (sin autenticación)

```bash
curl -X GET http://localhost:3000/api/categoria/ID_DE_CATEGORIA
```

### 5. Crear una nueva categoría (requiere admin)

```bash
curl -X POST http://localhost:3000/api/categoria \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_JWT" \
  -d '{
    "name": "Electrónica",
    "description": "Productos electrónicos en general"
  }'
```

### 6. Actualizar una categoría (requiere admin)

```bash
curl -X PUT http://localhost:3000/api/categoria/ID_DE_CATEGORIA \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_JWT" \
  -d '{
    "name": "Electrónica Actualizada",
    "description": "Nueva descripción"
  }'
```

### 7. Eliminar una categoría (requiere admin)

```bash
curl -X DELETE http://localhost:3000/api/categoria/ID_DE_CATEGORIA \
  -H "Authorization: Bearer TOKEN_JWT"
```

---

## 📦 Productos

### 8. Obtener todos los productos (sin autenticación)

```bash
curl -X GET http://localhost:3000/api/producto
```

### 9. Obtener un producto por ID (sin autenticación)

```bash
curl -X GET http://localhost:3000/api/producto/ID_DE_PRODUCTO
```

### 10. Crear un nuevo producto (requiere admin)

```bash
curl -X POST http://localhost:3000/api/producto \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_JWT" \
  -d '{
    "name": "Laptop Dell",
    "description": "Laptop de alto rendimiento",
    "price": 1500,
    "stock": 10,
    "categoryId": "ID_DE_CATEGORIA"
  }'
```

### 11. Actualizar un producto (requiere admin)

```bash
curl -X PUT http://localhost:3000/api/producto/ID_DE_PRODUCTO \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_JWT" \
  -d '{
    "name": "Laptop Dell Actualizada",
    "description": "Nueva descripción",
    "price": 1600,
    "stock": 8,
    "categoryId": "ID_DE_CATEGORIA"
  }'
```

### 12. Eliminar un producto (requiere admin)

```bash
curl -X DELETE http://localhost:3000/api/producto/ID_DE_PRODUCTO \
  -H "Authorization: Bearer TOKEN_JWT"
```

---

## 🔒 Rutas Protegidas

### 13. Acceso público (sin autenticación)

```bash
curl -X GET http://localhost:3000/public
```

### 14. Ruta protegida (requiere token JWT)

```bash
curl -X GET http://localhost:3000/protected \
  -H "Authorization: Bearer TOKEN_JWT"
```

### 15. Ruta de administrador (requiere token JWT y rol admin)

```bash
curl -X GET http://localhost:3000/admin \
  -H "Authorization: Bearer TOKEN_JWT"
```

---

## 🎯 Ruta de prueba

### 16. Saludo de la API

```bash
curl -X GET http://localhost:3000/api/saludo
```

**Respuesta esperada:**

```json
{
  "mensaje": "Hola desde la API 🚀"
}
```

---

## 📝 Notas importantes

- **TOKEN_JWT**: Reemplaza con el token obtenido del endpoint de login
- **ID_DE_CATEGORIA**: Reemplaza con el ID de una categoría existente (MongoDB ObjectId)
- **ID_DE_PRODUCTO**: Reemplaza con el ID de un producto existente (MongoDB ObjectId)
- **Autenticación**: Endpoints que requieren autenticación deben incluir el header: `Authorization: Bearer <TOKEN>`
- **Rol Admin**: Solo usuarios con rol "admin" pueden crear, actualizar o eliminar recursos
- **Content-Type**: Todos los endpoints POST y PUT requieren `Content-Type: application/json`

---

## 🧪 Ejemplo de flujo completo

1. Registrar usuario:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "email": "admin@example.com", "password": "admin1234"}'
```

2. Login y obtener token:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin1234"}'
```

3. Crear una categoría con el token (reemplaza TOKEN con el obtenido):

```bash
curl -X POST http://localhost:3000/api/categoria \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"name": "Electrónica", "description": "Productos electrónicos"}'
```

4. Obtener todas las categorías:

```bash
curl -X GET http://localhost:3000/api/categoria
```
