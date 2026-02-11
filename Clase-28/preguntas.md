## 1. JWT
---
admin, veterinario, el cliente NO.
post /api/client/
get /api/client/
get /api/client/:id
put /api/client/:id
delete /api/client/:id

JWT Tiene asociado dos cosas: 
Middlewares:
a. Verificar que el token sea válido
b. Verificar que el token sea válido y que el usuario sea admin/veterinario
- authenticate
- authorize(["admin", "veterinario"]) <- solucion simple y no es escalable, la escalable es la de roles y permisos (Clase 18.2)


Y ESTO EN EL FRONTEND? COMO LO USO?

TRES DORITOS DESPUES:

1. El user se registra (primera vez)
2. Hace Login (user & pass) <- el backend le da un token
3. El user hace una operacion que requiere autenticacion (con el token)
    a. guardar ese token en el localStorage
    b. enviar el token en cada request
    c. cuando el token expire, el user debe hacer login de nuevo


```javascript

// Esto seria en el frontend cuando tenes la page del login,
// cuando el usuario hace submit del form el cual le pide sus credenciales (user & pass)

// 🧙‍♂️ antes va una magia arcana la cual extrae de ese form los datos

// post login /api/login
fetch('https://api.example.com/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'usuario',
    password: 'contraseña'
  })
})
.then(response => response.json())
.then(data => {console.log(data); localStorage.setItem('token', JSON.stringify(response.data.token));})
.catch(error => console.error('Error:', error));

/// >>> (3 doritos despues)

// con esto lo traigo para usarlo en cada request
const token = localStorage.getItem('token');

// con esto lo envio en cada request, la parte del headers es la que importa
fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

---

## 2. Middleware errores
que es un middleware? es codigo que se inyecta entre el flujo de la peticion y la respuesta

Tienen un ejemplo en el archivo index.ts linea 62, archivo error.middleware.ts


## 3. integracion de Frontend y Backend ( handelbars y/o vanilla)

La parte logica de la integracion radica en los llamados fetch que son los que hacen la peticion al backend, ya sea para obtener datos, crear, actualizar o eliminar.

2 caminos para manejar el frontend:
1. interno
    a. Vanilla
    b. Handelbars
2. externo
    a. React
    b. Angular
    c. Vue
    d. etc

yo puedo tener directamente una carpeta la cual contiene todo el frontend y otra carpeta la cual contiene todo el backend

```text
mi-proyecto/
├── backend/
├── frontend/
├── .env
├── package.json
└── package-lock.json
```

dentro de fronted tendria mi vanilla, angular, vue, react, etc

La otra manera es que el frontend este dentro de nuestro backend:

```text
mi-proyecto/
   ├── public/
   │   ├── index.html  
   │   ├── style.css
   │   └── script.js
   ├── .env
   ├── package.json
   └── package-lock.json
```

usando el siguiente codigo en mi index.ts:

```typescript
import express from 'express';
import path from 'path';

const app = express();

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir index.html en la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de ejemplo para API
app.get('/api/data', (req, res) => {
  res.json({ message: 'Datos desde el backend' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
```

La otra manera mas complicada es usar handlebars, pero no lo recomiendo porque es mas complicado de manejar.


## 4. ¿por donde arranco? de idea a codigo...

lo primero por el tp anterior, osea por el backend, una vez que tengas el backend funcionando, te pones con el frontend y haces varios crud para:
- un form para cargar clientes/dueños
- una tabla para mostrar clientes/dueños

- un form para cargar mascotas
- una tabla para mostrar mascotas

- un form para cargar consultas_clinicas
- una tabla para mostrar consultas_clinicas

donde tengas tablas tendrias la forma de editar, actualizar y eliminar los datos
buscar en google tabla crud imagenes 


Lo que pide el profe es que tenga un front end que se conecte con el backend y que tenga un crud para cada modelo que tenga el backend, basicamente un login que te redirija a una pagina que tenga un crud para cada modelo que tenga el backend. Nada muy rebuscado, todo en una page y va a estar bien, lo que le importa al profe de todo esto son los fetch y la visualizacion de los datos.

pueden armar **SI QUIEREN** un archivo seed, el cual consiste en un script con el codigo para crear usuarios, roles, permisos, etc. para no tener que crearlos manualmente.
El script puede ser un simple js, ts, etc.

```markdown
![Diagrama de páginas](./pages.svg)
```
