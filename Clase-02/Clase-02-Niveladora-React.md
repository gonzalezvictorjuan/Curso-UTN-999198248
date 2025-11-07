# 📖 Clase 2: Clase Niveladora React

## 🎯 Objetivos de la Clase

- Comprender los conceptos fundamentales de React: componentes, JSX y props
- Aprender a manejar el estado local con el hook useState
- Dominar el uso de hooks esenciales: useEffect, useContext y hooks personalizados
- Aplicar el patrón de componentes funcionales y hooks en lugar de clases
- Crear componentes reutilizables y mantener un estado reactivo

---

## 📚 ¿Qué es React?

### 🔍 Definición

**React** es una biblioteca de JavaScript desarrollada por Facebook (Meta) para construir interfaces de usuario interactivas y dinámicas. Permite crear componentes reutilizables que gestionan su propio estado y se actualizan eficientemente cuando los datos cambian.

### 🏗️ Características Principales

- **Componentes:** Arquitectura basada en componentes reutilizables y modulares
- **Virtual DOM:** Sistema eficiente que actualiza solo las partes necesarias de la interfaz
- **Unidireccional:** Flujo de datos unidireccional que facilita el debugging
- **Declarativo:** Describe cómo debe verse la UI en cada estado
- **JSX:** Sintaxis que permite escribir HTML-like dentro de JavaScript

### 📖 Historia Breve

- **2011:** Facebook desarrolla React internamente para resolver problemas de escalabilidad
- **2013:** React se lanza como open source en JSConf US
- **2015:** Se introduce React Native para desarrollo móvil multiplataforma
- **2018:** Lanzamiento de React Hooks, revolucionando el manejo de estado y efectos
- **2024:** React continúa evolucionando con mejoras de rendimiento y nuevas características

---

## 🏛️ React Básico

### 📝 Componentes y JSX

Los componentes son la unidad básica de React. Pueden ser funciones o clases.

```javascript
// Componente funcional básico
function Saludo() {
  return <h1>¡Hola desde React!</h1>;
}

// JSX permite combinar HTML y JavaScript
function Usuario({ nombre, edad }) {
  return (
    <div>
      <h2>{nombre}</h2>
      <p>Tiene {edad} años</p>
      {edad >= 18 && <p>Es mayor de edad</p>}
    </div>
  );
}

// Exportar componente
export default Saludo;
```

### 📝 Props (Propiedades)

Las props permiten pasar datos de componentes padres a hijos.

```javascript
// Componente padre
function App() {
  const usuario = {
    nombre: "María",
    email: "maria@example.com"
  };

  return (
    <div>
      <TarjetaUsuario 
        nombre={usuario.nombre} 
        email={usuario.email}
        mostrarEmail={true}
      />
    </div>
  );
}

// Componente hijo que recibe props
function TarjetaUsuario({ nombre, email, mostrarEmail }) {
  return (
    <div className="tarjeta">
      <h3>{nombre}</h3>
      {mostrarEmail && <p>{email}</p>}
    </div>
  );
}
```

### 📝 useState - Estado Local

El hook useState permite agregar estado a componentes funcionales.

```javascript
import { useState } from 'react';

function Contador() {
  // useState retorna [valor, función para actualizar]
  const [contador, setContador] = useState(0);

  const incrementar = () => {
    setContador(contador + 1);
  };

  const decrementar = () => {
    setContador(contador - 1);
  };

  const resetear = () => {
    setContador(0);
  };

  return (
    <div>
      <p>Contador: {contador}</p>
      <button onClick={incrementar}>+</button>
      <button onClick={decrementar}>-</button>
      <button onClick={resetear}>Reset</button>
    </div>
  );
}
```

### 📝 Manejo de Eventos

React usa eventos sintéticos que funcionan de manera similar a los eventos del DOM.

```javascript
function Formulario() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto
    console.log('Nombre:', nombre);
    console.log('Email:', email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

---

## 🏗️ React Avanzado - Hooks

### 📄 useEffect - Efectos Secundarios

useEffect permite ejecutar código cuando el componente se monta, actualiza o desmonta.

```javascript
import { useState, useEffect } from 'react';

function UsuarioDetalle({ userId }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // useEffect se ejecuta después del render
  useEffect(() => {
    // Fetch de datos
    fetch(`/api/usuarios/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUsuario(data);
        setCargando(false);
      });

    // Cleanup function (opcional)
    return () => {
      // Limpiar suscripciones, timers, etc.
    };
  }, [userId]); // Dependencias: se ejecuta cuando userId cambia

  if (cargando) return <div>Cargando...</div>;

  return <div>{usuario?.nombre}</div>;
}
```

### 📄 useContext - Contexto Global

useContext permite compartir datos entre componentes sin pasar props manualmente.

```javascript
import { createContext, useContext, useState } from 'react';

// Crear contexto
const TemaContext = createContext();

// Provider component
function TemaProvider({ children }) {
  const [tema, setTema] = useState('claro');

  const toggleTema = () => {
    setTema(tema === 'claro' ? 'oscuro' : 'claro');
  };

  return (
    <TemaContext.Provider value={{ tema, toggleTema }}>
      {children}
    </TemaContext.Provider>
  );
}

// Hook personalizado para usar el contexto
function useTema() {
  const context = useContext(TemaContext);
  if (!context) {
    throw new Error('useTema debe usarse dentro de TemaProvider');
  }
  return context;
}

// Uso en componentes
function BotonTema() {
  const { tema, toggleTema } = useTema();

  return (
    <button onClick={toggleTema}>
      Tema actual: {tema}
    </button>
  );
}
```

### 📄 Hooks Personalizados

Los hooks personalizados permiten reutilizar lógica entre componentes.

```javascript
// Hook personalizado para fetch de datos
function useFetch(url) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCargando(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setDatos(data);
        setCargando(false);
      })
      .catch(err => {
        setError(err);
        setCargando(false);
      });
  }, [url]);

  return { datos, cargando, error };
}

// Uso del hook personalizado
function ComponenteUsandoFetch() {
  const { datos, cargando, error } = useFetch('/api/usuarios');

  if (cargando) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{datos?.map(u => <div key={u.id}>{u.nombre}</div>)}</div>;
}
```

---

## 🚀 Ejercicio Práctico

### 📝 Lista de Tareas Interactiva

Crear una aplicación de tareas (to-do) con React que incluya todas las funcionalidades básicas.

```javascript
import { useState } from 'react';

function App() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [filtro, setFiltro] = useState('todas'); // todas, completadas, pendientes

  const agregarTarea = () => {
    if (nuevaTarea.trim()) {
      const tarea = {
        id: Date.now(),
        texto: nuevaTarea,
        completada: false
      };
      setTareas([...tareas, tarea]);
      setNuevaTarea('');
    }
  };

  const toggleCompletada = (id) => {
    setTareas(tareas.map(tarea =>
      tarea.id === id
        ? { ...tarea, completada: !tarea.completada }
        : tarea
    ));
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter(tarea => tarea.id !== id));
  };

  const tareasFiltradas = tareas.filter(tarea => {
    if (filtro === 'completadas') return tarea.completada;
    if (filtro === 'pendientes') return !tarea.completada;
    return true;
  });

  return (
    <div className="app">
      <h1>Lista de Tareas</h1>
      
      <div className="agregar-tarea">
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && agregarTarea()}
          placeholder="Nueva tarea..."
        />
        <button onClick={agregarTarea}>Agregar</button>
      </div>

      <div className="filtros">
        <button onClick={() => setFiltro('todas')}>Todas</button>
        <button onClick={() => setFiltro('pendientes')}>Pendientes</button>
        <button onClick={() => setFiltro('completadas')}>Completadas</button>
      </div>

      <ul>
        {tareasFiltradas.map(tarea => (
          <li key={tarea.id} className={tarea.completada ? 'completada' : ''}>
            <input
              type="checkbox"
              checked={tarea.completada}
              onChange={() => toggleCompletada(tarea.id)}
            />
            <span>{tarea.texto}</span>
            <button onClick={() => eliminarTarea(tarea.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <p>Total: {tareas.length} | Completadas: {tareas.filter(t => t.completada).length}</p>
    </div>
  );
}

export default App;
```

**Archivo `App.jsx`:**

```jsx
// App.jsx
import { useState } from 'react';
import './App.css';

function App() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [filtro, setFiltro] = useState('todas');

  const agregarTarea = () => {
    if (nuevaTarea.trim()) {
      setTareas([...tareas, {
        id: Date.now(),
        texto: nuevaTarea,
        completada: false
      }]);
      setNuevaTarea('');
    }
  };

  const toggleCompletada = (id) => {
    setTareas(tareas.map(tarea =>
      tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
    ));
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter(tarea => tarea.id !== id));
  };

  const tareasFiltradas = tareas.filter(tarea => {
    if (filtro === 'completadas') return tarea.completada;
    if (filtro === 'pendientes') return !tarea.completada;
    return true;
  });

  return (
    <div className="app">
      <h1>Lista de Tareas</h1>
      
      <div className="agregar-tarea">
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && agregarTarea()}
          placeholder="Nueva tarea..."
        />
        <button onClick={agregarTarea}>Agregar</button>
      </div>

      <div className="filtros">
        <button onClick={() => setFiltro('todas')}>Todas</button>
        <button onClick={() => setFiltro('pendientes')}>Pendientes</button>
        <button onClick={() => setFiltro('completadas')}>Completadas</button>
      </div>

      <ul>
        {tareasFiltradas.map(tarea => (
          <li key={tarea.id} className={tarea.completada ? 'completada' : ''}>
            <input
              type="checkbox"
              checked={tarea.completada}
              onChange={() => toggleCompletada(tarea.id)}
            />
            <span>{tarea.texto}</span>
            <button onClick={() => eliminarTarea(tarea.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <p>Total: {tareas.length} | Completadas: {tareas.filter(t => t.completada).length}</p>
    </div>
  );
}

export default App;
```

---

## 🏠 Tarea para la Próxima Clase

### ✅ Ejercicio:

Crear una aplicación React de gestión de usuarios con las siguientes funcionalidades:

1. **Lista de usuarios** con nombre, email y edad mostrados en tarjetas
2. **Formulario para agregar usuarios** con validación de campos requeridos
3. **Editar usuarios existentes** mediante un formulario modal o inline
4. **Eliminar usuarios** con confirmación antes de borrar
5. **Buscar usuarios** por nombre o email en tiempo real
6. **Filtrar usuarios** por rango de edad (menores de 25, 25-50, mayores de 50)
7. **Persistencia local** usando localStorage para guardar los usuarios

**Requisitos técnicos:**

- Usar hooks de React (useState, useEffect, etc.)
- Componentes funcionales con JSX
- Manejo de eventos y formularios controlados
- Validación de inputs antes de submit
- Estilos CSS o librería de componentes
- Estructura de carpetas organizada (componentes separados)
- Código limpio y comentado

---

## 📚 Recursos Adicionales

### 🔗 Enlaces Útiles

- [React Official Docs](https://react.dev/) - Documentación oficial de React
- [React Hooks API](https://react.dev/reference/react) - Referencia completa de hooks
- [React Patterns](https://reactpatterns.com/) - Patrones comunes en React
- [Overreacted Blog](https://overreacted.io/) - Blog de Dan Abramov sobre React

### 📖 Conceptos para Investigar

- **Virtual DOM** - Sistema de representación del DOM que optimiza las actualizaciones
- **Reconciliation** - Proceso por el cual React compara y actualiza el árbol de componentes
- **Memoization** - Técnicas como useMemo y useCallback para optimizar rendimiento
- **Custom Hooks** - Crear tus propios hooks para compartir lógica entre componentes

---

## ❓ Preguntas Frecuentes

### ¿Cuál es la diferencia entre componentes de clase y funcionales?

- **Componentes funcionales:** Más simples, usan hooks para estado y efectos, son el estándar actual en React
- **Componentes de clase:** Usan `this` y métodos del ciclo de vida, están siendo reemplazados por componentes funcionales con hooks

### ¿Cuándo debo usar useEffect?

- **Usa useEffect para:** Efectos secundarios como llamadas a API, suscripciones, timers, o manipulación del DOM
- **No uses useEffect para:** Cálculos derivados del estado (usa variables), eventos (usa event handlers), o lógica de renderizado

### ¿Qué son las dependencias en useEffect y por qué son importantes?

- Las dependencias indican cuándo debe ejecutarse el efecto nuevamente
- Si omites dependencias, puedes tener bugs de estado obsoleto (stale closures)
- Un array vacío `[]` significa que el efecto solo se ejecuta una vez (al montar)
- Sin array de dependencias, el efecto se ejecuta en cada render (puede causar loops infinitos)

---

## 🎉 ¡React Dominado!

¡Excelente trabajo! Ya conoces los fundamentos de React: componentes, props, estado con useState, y hooks esenciales como useEffect y useContext. En la próxima clase exploraremos TypeScript, donde añadiremos tipado estático a nuestras aplicaciones para mayor seguridad y mejor experiencia de desarrollo.

**Recuerda:** React es una biblioteca poderosa que se vuelve más fácil con la práctica. Construye proyectos pequeños primero, experimenta con los hooks, y poco a poco dominarás todos sus conceptos. ¡Sigue construyendo! 🚀

---

_📧 **Contacto:** Si tienes dudas sobre React, no dudes en consultar durante la clase o por los canales de comunicación establecidos._
