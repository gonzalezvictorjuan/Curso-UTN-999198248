# 📖 Clase 24: Integrando Back y Front End (PoC Web Full Stack)

## 🎯 Objetivos de la Clase

- Comprender el concepto y utilidad de una Proof of Concept (PoC) y la arquitectura de Monorepo.
- Implementar un Backend completo utilizando Node.js, TypeScript y arquitectura MVC.
- Consumir una API externa (PokeAPI) desde el servidor y exponer los datos.
- Desarrollar un Frontend en React que consuma los endpoints de nuestro Backend.
- Manejar variables de entorno (.env) tanto en Backend como en Frontend y preparar el proyecto para despliegue.

---

## 📚 ¿Qué es una PoC y un Monorepo?

### 🔍 Definiciones

**Proof of Concept (PoC)** o Prueba de Concepto es una implementación parcial o pequeña de un software realizada para verificar que una idea técnica es factible o para demostrar su potencial. No está destinada a ser el producto final, sino un punto de partida.

**Monorepo** es una estrategia de desarrollo de software donde el código de varios proyectos (por ejemplo, frontend y backend) se almacena en el mismo repositorio de control de versiones.

### 🏗️ Características Principales

- **PoC:**
  - Enfocada en funcionalidad clave, no en perfección o detalles menores.
  - Rápida de desarrollar.
  - Permite fallar rápido y barato (Fail fast).

- **Monorepo:**
  - Código compartido fácilmente.
  - Gestión de dependencias unificada (en algunos casos).
  - Facilita el despliegue atómico (deploy de todo junto).

---

### Resultado Final: [PoC-Vercel-Monorepo](https://github.com/gonzalezvictorjuan/PoC-Vercel-Monorepo)

---

## 🏛️ Integración Full Stack Básica

### 📝 Flujo de Datos

El flujo típico que implementaremos es:
`Frontend (React) -> Pide datos a -> Backend (Express) -> Pide datos a -> API Externa (PokeAPI)`

El Backend actúa como intermediario (proxy) o procesador, agregando lógica de negocio o seguridad (como ocultar API Keys de terceros), antes de enviar la respuesta al Frontend.

---

## 🚀 Ejercicio Práctico: Armado de Monorepo Full Stack

Vamos a armar de principio a fin un monorepo que contenga nuestro Backend y Frontend.

### 🏁 Paso 1: Estructura del Proyecto (Monorepo)

Crearemos una carpeta raíz para nuestro proyecto.

```bash
mkdir clase-24-poc-monorepo
cd clase-24-poc-monorepo
npm init -y
```

Estructura deseada:

```
/clase-24-poc-monorepo
  /backend
  /frontend
  package.json
```

---

### 📦 Paso 1.5: Automatización del Monorepo (Opcional pero Recomendado)

Para no tener que entrar a cada carpeta y abrir múltiples terminales, configuraremos el `package.json` de la **raíz** para controlar todo el proyecto.

1. Instalar `concurrently` en la raíz:

```bash
npm install concurrently --save-dev
```

2. Modificar el `package.json` de la raíz:

```json
{
  "name": "poc-vercel-monorepo",
  "version": "1.0.0",
  "description": "",
  "workspaces": ["backend", "frontend"],
  "scripts": {
    "dev:backend": "npm run dev -w backend",
    "dev:frontend": "npm run dev -w frontend",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "build:backend": "npm run build -w backend",
    "build:frontend": "npm run build -w frontend",
    "build": "npm run build:backend && npm run build:frontend"
  },
  "devDependencies": {
    "concurrently": "^9.2.1"
  }
}
```

Ahora podrás usar `npm run dev` desde la raíz para levantar ambos proyectos a la vez.

---

### 🔙 Paso 2: Backend (Node.js + TS + MVC)

#### 1. Inicialización y Dependencias

Dentro de la raíz, creamos la carpeta `backend` e inicializamos.

```bash
mkdir backend
cd backend
npm init -y
# Dependencias de producción
npm install express dotenv cors
# Dependencias de desarrollo
npm install -D typescript ts-node @types/express @types/node @types/cors nodemon

```

#### 2. Configuración TypeScript

Crear `tsconfig.json` en `/backend`:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

Configurar scripts en `package.json` del backend:

```json
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc"
  }
```

#### 3. Estructura de Archivos

```
/backend
  /src
    /controllers
    /services
    /routes
    index.ts
  .env
  vercel.json
```

#### 4. Código del Backend

**Servicio (`src/services/pokemonService.ts`):**
Obtiene un Pokémon random de PokeAPI.

```typescript
export class PokemonService {
  private static get baseUrl() {
    return process.env.POKEAPI_URL || 'empty';
  }

  static async getRandomPokemon() {
    // ID random entre 1 y 151 (Primera gen)
    const randomId = Math.floor(Math.random() * 151) + 1;

    const response = await fetch(`${this.baseUrl}/${randomId}`);
    if (!response.ok) {
      throw new Error('Error fetching pokemon from PokeAPI');
    }
    const data = await response.json();

    return {
      id: data.id,
      name: data.name,
      image: data.sprites.front_default,
      types: data.types.map((t: any) => t.type.name),
    };
  }
}
```

**Controlador (`src/controllers/pokemonController.ts`):**

```typescript
import { Request, Response } from 'express';
import { PokemonService } from '../services/pokemonService';

export class PokemonController {
  static async getRandom(req: Request, res: Response) {
    try {
      const pokemon = await PokemonService.getRandomPokemon();
      res.json(pokemon);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
```

**Rutas (`src/routes/pokemonRoutes.ts`):**

```typescript
import { Router } from 'express';
import { PokemonController } from '../controllers/pokemonController';

const router = Router();

router.get('/random', PokemonController.getRandom);

export default router;
```

**Punto de Entrada (`src/index.ts`):**

```typescript
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pokemonRoutes from './routes/pokemonRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Importante para que el frontend pueda conectarse
app.use(express.json());

app.use('/api/pokemon', pokemonRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

export default app;
```

**Archivo `.env`:**

```env
PORT=3000
POKEAPI_URL=https://pokeapi.co/api/v2/pokemon
```

**Configuración para Vercel (`vercel.json`):**
Crear este archivo en la raíz de `backend/` para que Vercel sepa cómo manejar las rutas y usar la versión compilada.

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/dist/index.js"
    }
  ]
}
```

---

### 🖥️ Paso 3: Frontend (React)

Volvemos a la raíz del monorepo y creamos el frontend con Vite.

```bash
cd ..
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

#### 1. Variables de Entorno

En Vite, las variables de entorno deben empezar con `VITE_`.
Crear archivo `.env` en `/frontend`:

```env
VITE_API_URL=http://localhost:3000/api/pokemon
```

#### 2. Código del Frontend

**Componente de Badge de Tipo (`src/components/TypeBadge.tsx`):**

Crea la carpeta `src/components` y dentro el archivo `TypeBadge.tsx`. Este componente le dará estilo a los tipos de Pokémon.

```tsx
import React from 'react';

interface TypeConfig {
  color: string;
  icon: string;
}

const TYPE_CONFIGS: Record<string, TypeConfig> = {
  normal: {
    color: '#9FA19F',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/a/ae/Normal_icon.png/20px-Normal_icon.png',
  },
  fire: {
    color: '#E62829',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/5/5e/Fire_icon.png/20px-Fire_icon.png',
  },
  fighting: {
    color: '#FF8000',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/7/7d/Fighting_icon.png/20px-Fighting_icon.png',
  },
  water: {
    color: '#2980EF',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/7/7f/Water_icon.png/20px-Water_icon.png',
  },
  flying: {
    color: '#81B9EF',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/f/f0/Flying_icon.png/20px-Flying_icon.png',
  },
  grass: {
    color: '#3FA129',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/c/cb/Grass_icon.png/20px-Grass_icon.png',
  },
  poison: {
    color: '#9141CB',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/8/84/Poison_icon.png/20px-Poison_icon.png',
  },
  electric: {
    color: '#FAC000',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/a/af/Electric_icon.png/20px-Electric_icon.png',
  },
  ground: {
    color: '#915121',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/5/58/Ground_icon.png/20px-Ground_icon.png',
  },
  psychic: {
    color: '#EF4179',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/a/a6/Psychic_icon.png/20px-Psychic_icon.png',
  },
  rock: {
    color: '#AFA981',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/f/ff/Rock_icon.png/20px-Rock_icon.png',
  },
  ice: {
    color: '#3DCEF3',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/8/83/Ice_icon.png/20px-Ice_icon.png',
  },
  bug: {
    color: '#91A119',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/7/79/Bug_icon.png/20px-Bug_icon.png',
  },
  dragon: {
    color: '#5060E1',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/9/91/Dragon_icon.png/20px-Dragon_icon.png',
  },
  ghost: {
    color: '#704170',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/8/82/Ghost_icon.png/20px-Ghost_icon.png',
  },
  dark: {
    color: '#624D4E',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/3/33/Dark_icon.png/20px-Dark_icon.png',
  },
  steel: {
    color: '#60A1B8',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/b/b8/Steel_icon.png/20px-Steel_icon.png',
  },
  fairy: {
    color: '#EF70EF',
    icon: 'https://archives.bulbagarden.net/media/upload/thumb/5/5a/Fairy_icon.png/20px-Fairy_icon.png',
  },
};

interface Props {
  type: string;
}

const TypeBadge: React.FC<Props> = ({ type }) => {
  const config = TYPE_CONFIGS[type.toLowerCase()] || TYPE_CONFIGS.normal;

  return (
    <div style={{ margin: '2px' }}>
      <span
        style={{
          backgroundColor: '#5A5A5A',
          padding: '2px 2px 2px 4px',
          borderRadius: '15px',
          display: 'inline-flex',
          whiteSpace: 'nowrap',
          backgroundImage: `linear-gradient(105deg, ${config.color} 30px, #5A5A5A 31px, #5A5A5A)`,
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        <img src={config.icon} alt={type} width='20' height='20' />
        <span
          style={{
            margin: '0 5px 0 10px',
            display: 'inline-block',
            minWidth: '50px',
            textAlign: 'center',
            color: '#FFF',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'capitalize',
          }}
        >
          {type}
        </span>
      </span>
    </div>
  );
};

export default TypeBadge;
```

**Modificación de `src/App.tsx`:**

```tsx
import { useState, useEffect } from 'react';
import TypeBadge from './components/TypeBadge';
import './App.css';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

function App() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPokemon = async () => {
    setLoading(true);
    try {
      // Usamos la variable de entorno
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/random`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setPokemon(data);
    } catch (error) {
      console.error('Error fetching pokemon', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  return (
    <div className='card'>
      <h1>PoC Full Stack Pokemon</h1>
      <div className='card-content'>
        {loading ? (
          <p>Cargando...</p>
        ) : pokemon ? (
          <>
            <h2>
              {pokemon.name} (#{pokemon.id})
            </h2>
            <img src={pokemon.image} alt={pokemon.name} width='200' />
            <div
              className='types'
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {pokemon.types.map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
            </div>
          </>
        ) : (
          <p>No se pudo cargar el pokemon</p>
        )}
      </div>
      <button onClick={fetchPokemon} disabled={loading}>
        ¡Nuevo Pokemon!
      </button>
    </div>
  );
}

export default App;
```

### 🔁 Paso 4: Ejecución

Ahora tienes dos formas de ejecutar el proyecto:

#### Opción A: Desde la raíz (Recomendado)

Gracias a la configuración de `concurrently`, simplemente ejecuta en la raíz:

```bash
npm run dev
```

#### Opción B: Terminales separadas

1. **Terminal 1 (Backend):**
   ```bash
   cd backend
   npm run dev
   ```
2. **Terminal 2 (Frontend):**

   ```bash
   cd frontend
   npm run dev
   ```

3. Abrir el link que muestra Vite (ej: `http://localhost:5173`) y verás tu aplicación consumiendo datos de tu backend, el cual a su vez los trae de PokeAPI.

---

## 🚀 Paso 5: Preparación y Despliegue (Web)

¡Vamos a publicar nuestra app sin instalar herramientas extras en tu computadora! Usaremos **Vercel** tanto para el Frontend como para el Backend.

### 📦 1. Subir a GitHub

Lo primero es tener tu código en la nube.

1. Crea un repositorio **público** en GitHub (ej: `poc-monorepo`).
2. Sube tus cambios:
   ```bash
   git status
   git add .
   git commit -m "Initial commit PoC Full Stack"
   git status
   git push
   ```

### ☁️ 2. Desplegar Backend en Vercel

1. Ve a [Vercel](https://vercel.com) e inicia sesión con GitHub.
2. Click en **"Add New..."** -> **"Project"**.
3. Selecciona tu repositorio `poc-monorepo` y dale a **"Import"**.
4. **Configuración del Proyecto:**
   - **Framework Preset:** Other
   - **Root Directory:** Edit -> Selecciona la carpeta `backend`.
   - **Build Command:** `npm run build` (Debería detectarlo por el package.json).
   - **Output Directory:** `dist` (Déjalo por defecto o configuralo si falla).
   - **Environment Variables:**
     - `PORT`: `3000` (Opcional, Vercel lo maneja).
5. Click en **"Deploy"**.
6. Una vez desplegado, copia la URL que te da Vercel (ej: `https://poc-backend.vercel.app`).
   - Verifica entrando a `https://poc-backend.vercel.app/api/pokemon/random`.

### ⚡ 3. Desplegar Frontend en Vercel

1. Vuelve al Dashboard de Vercel.
2. Click en **"Add New..."** -> **"Project"** de nuevo.
3. Selecciona el **mismo repositorio** `poc-monorepo`.
4. **Configuración del Proyecto:**
   - **Framework Preset:** Vite
   - **Root Directory:** Edit -> Selecciona la carpeta `frontend`.
   - **Environment Variables:**
     - `VITE_API_URL`: Pega la URL de tu backend **SIN** la barra al final (ej: `https://poc-backend.vercel.app/api/pokemon`).
5. Click en **"Deploy"**.
6. ¡Listo! Tu frontend ahora vive en internet y consume datos de tu backend en la nube.

> **Nota:** Si tienes problemas de CORS, asegúrate de que tu backend tenga `app.use(cors())`. Para mayor seguridad en producción, deberías configurar CORS para aceptar solo el dominio de tu frontend.

---

## 🏠 Tarea para la Próxima Clase

### ✅ Ejercicio: Extender la PoC

1. **Búsqueda por Nombre Backend**: Agregar un endpoint `/search/:name` en el backend que busque un pokémon específico en PokeAPI.
2. **Validación**: Si el pokémon no existe, devolver un 404 manejado correctamente.
3. **Frontend Input**: Agregar un input text y un botón en el frontend para buscar por nombre usando el nuevo endpoint.
4. **Historial**: (Opcional) Mostrar una lista debajo con los últimos 3 pokémons buscados.

**Requisitos técnicos:**

- El backend debe seguir usando Controller/Service.
- El frontend debe manejar el estado de `loading` y `error` para la búsqueda.

---

## 📚 Recursos Adicionales

### 🔗 Enlaces Útiles

- [Documentación PokeAPI](https://pokeapi.co/) - API pública de Pokémon.
- [Vitejs.dev](https://vitejs.dev/) - Entorno de desarrollo frontend rápido.
- [Express.js](https://expressjs.com/es/) - Framework web para Node.js.
- [Express.js](https://expressjs.com/es/) - Framework web para Node.js.
- [MDN Fetch API](https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch) - Documentación oficial de Fetch.

### 📖 Conceptos para Investigar

- **CORS (Cross-Origin Resource Sharing):** ¿Por qué es necesario configurarlo en el backend?
- **Variables de Entorno:** Importancia de no subir el archivo `.env` a GitHub.
- **Turborepo / Nx:** Herramientas avanzadas para gestión de Monorepos.

---

## ❓ Preguntas Frecuentes

### ¿Por qué mi frontend no conecta con el backend?

- **CORS:** Verifica que tengas `app.use(cors())` en tu `index.ts` del backend.
- **Puertos:** Asegúrate que el backend corre en el puerto 3000 (o el que definiste) y que el frontend apunta a esa URL exacta.
- **Variables de Entorno:** Si cambiaste el `.env` del frontend, recuerda reiniciar el servidor de Vite (`npm run dev`) para que tome los cambios.

### ¿Por qué usamos `fetch` y no librerías extra?

Para una PoC y proyectos modernos, `fetch` es nativo en el navegador y en Node.js (desde v18). Esto significa menos dependencias que instalar y mantener, haciendo el proyecto más ligero.

---

## 🎉 ¡PoC Full Stack Dominada!

¡Excelente trabajo! Has construido una aplicación completa desde cero, conectando un frontend moderno con un backend estructurado. En la próxima clase veremos cómo desplegar todo esto para que el mundo pueda verlo.

**Recuerda:** "Divide y vencerás". Separar la lógica en Backend y Frontend te permite escalar y mantener mejor tus aplicaciones. ¡Sigue experimentando! 🚀

---

_📧 **Contacto:** Si tienes dudas sobre la integración o el monorepo, no dudes en consultar durante la clase o por los canales de comunicación establecidos._
