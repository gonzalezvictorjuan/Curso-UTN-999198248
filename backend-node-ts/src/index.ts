import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, '..', 'public')));

// Todos los endpoints van a ir desde /api/

/**
 * Endpoint raíz que responde con un mensaje JSON
 *
 * GET /api
 *
 * req: Request - Objeto de solicitud de Express
 * res: Response - Objeto de respuesta de Express
 *
 * Respuesta:
 * {
 *   "message": "¡Hola, mundo! Este es un servidor Express con TypeScript. 🚀"
 * }
 */
app.get('/api', (req: Request, res: Response) => {
  console.log('¡Alguien accedió al endpoint raíz! 🌐');
  res.json({
    message: '¡Hola, mundo! Este es un servidor Express con TypeScript. 🚀',
  });
});

app.get('/api/saludo', (req: Request, res: Response) => {
  res.json({ mensaje: 'Hola desde la API 🚀' });
});

// Iniciar el servidor HTTP
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT} 🚀`);
});

// https://localhost:3000/   >> ¡Hola, mundo! Este es un servidor Express con TypeScript. 🚀
