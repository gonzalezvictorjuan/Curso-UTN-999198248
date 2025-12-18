# 📖 Clase 14: Express + Archivos Estáticos

## 🎯 Objetivos de la Clase

- Comprender qué son los archivos estáticos y para qué se utilizan en un backend.
- Entender el concepto de **aplicación monolítica**.
- Configurar Express para servir archivos estáticos.
- Ampliar el backend creado en la clase anterior.
- Mantener una estructura de proyecto clara y progresiva.

---

## 📚 ¿Qué son los Archivos Estáticos?

### 🔍 Definición

Los **archivos estáticos** son archivos que el servidor entrega tal cual están almacenados, sin procesamiento previo.

Ejemplos comunes:

- HTML
- CSS
- JavaScript del frontend
- Imágenes

Express permite servir estos archivos fácilmente.

---

## 🏛️ Concepto de Aplicación Monolítica

### 🧱 ¿Qué es un monolito?

Una **aplicación monolítica** es aquella donde:

- Backend y frontend viven en el mismo proyecto
- Un solo servidor maneja lógica y archivos
- El despliegue se hace como una única unidad

### 🆚 Comparación rápida

- **Monolito:** simple, ideal para proyectos chicos y educativos
- **Microservicios:** más complejo, escalable, varios servicios separados

En esta clase trabajaremos con un **monolito simple**.

---

## 🚀 Extensión del Proyecto Existente

Partimos del backend creado en la **Clase 13**.

---

## 📂 Creación de Carpetas y Archivos

```bash
# Carpeta para archivos públicos (frontend)
mkdir public

# Archivo HTML principal
touch public/index.html
```

La carpeta `public` contendrá todos los archivos estáticos.

---

## 🧩 Servir Archivos Estáticos con Express

### 📄 Modificación de `src/index.ts`

```ts
// Importamos express y path
import express, { Request, Response } from 'express';
import path from 'path';

// Creamos la aplicación Express
const app = express();

// Definimos el puerto del servidor
const PORT = 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Middleware para servir archivos estáticos
// __dirname representa la carpeta actual compilada
app.use(express.static(path.join(__dirname, '..', 'public')));

// Endpoint de prueba API
app.get('/api/saludo', (req: Request, res: Response) => {
  res.json({ mensaje: 'Hola desde la API 🚀' });
});

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
```

### 📝 Explicación clave

- `express.static()` indica qué carpeta exponer públicamente
- Todo archivo dentro de `public/` será accesible desde el navegador
- No es necesario crear rutas manuales para HTML

---

## 🌐 Creando el Frontend Estático

### 📄 Archivo `public/index.html`

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Servidor Node + Express</title>
  </head>
  <body>
    <h1>Backend + Frontend en un Monolito</h1>
    <p>Este HTML es servido directamente por Express.</p>

    <script>
      // Llamada simple a la API
      fetch('/api/saludo')
        .then((res) => res.json())
        .then((data) => console.log(data));
    </script>
  </body>
</html>
```

---

## ▶️ Probar el Proyecto

```bash
npm run dev
```

Abrir en el navegador:

- [http://localhost:3000](http://localhost:3000)

Resultado esperado:

- Se muestra el HTML
- En consola del navegador se ve la respuesta de la API

---

## 🏠 Tarea para la Próxima Clase

### ✅ Ejercicio

1. Agregar un archivo `style.css` dentro de `public/`
2. Vincular el CSS desde el HTML
3. Crear un nuevo endpoint `/api/info`
4. Consumir ese endpoint desde el frontend

**Requisitos técnicos:**

- Express
- TypeScript
- Uso correcto de archivos estáticos

---

## 📚 Recursos Adicionales

### 🔗 Enlaces Útiles

- [https://expressjs.com/en/starter/static-files.html](https://expressjs.com/en/starter/static-files.html) - Express static files
- [https://developer.mozilla.org](https://developer.mozilla.org) - Documentación HTML/CSS/JS

### 📖 Conceptos para Investigar

- **SPA**: Single Page Application
- **CSR vs SSR**: Renderizado del lado cliente y servidor
- **CORS**: Seguridad en APIs

---

## ❓ Preguntas Frecuentes

### ¿Esto es un backend real?

- Sí, es un backend funcional
- Incluye API y frontend en el mismo servidor

### ¿Se usa así en producción?

- A veces sí, para proyectos chicos
- En proyectos grandes suele separarse

---

## 🎉 ¡Monolito en Marcha!

Excelente trabajo. Ahora tu backend no solo responde APIs, sino que también sirve un frontend completo. En la próxima clase veremos **organización de rutas y separación de responsabilidades**.

---

_📧 **Contacto:** Ante dudas sobre Express o archivos estáticos, consultá durante la clase o por los canales habituales._
