# 📖 Clase 5: Aplicación Práctica (TypeScript)

## 🎯 Objetivos de la Clase

- Aplicar los conceptos de TypeScript aprendidos en ejercicios prácticos desde la terminal
- Resolver problemas de complejidad incremental usando tipos, interfaces y clases
- Desarrollar habilidades de depuración y resolución de problemas en TypeScript
- Practicar la implementación de funciones, clases y estructuras de datos tipadas
- Consolidar el conocimiento de TypeScript mediante ejercicios reales

---

## 📚 ¿Qué es la Práctica de TypeScript?

### 🔍 Definición

**La práctica de TypeScript** consiste en aplicar los conceptos teóricos aprendidos mediante ejercicios prácticos que se ejecutan desde la terminal. Estos ejercicios permiten consolidar el conocimiento, identificar áreas de mejora y desarrollar habilidades de programación con tipado estático.

### 🏗️ Características Principales

- **Ejecución en Terminal:** Los ejercicios se ejecutan directamente desde la línea de comandos
- **Dificultad Incremental:** Los ejercicios aumentan en complejidad gradualmente
- **Tipado Estático:** Todos los ejercicios requieren el uso correcto de tipos de TypeScript
- **Solución Guiada:** Cada ejercicio incluye una solución detallada para referencia

---

## 🚀 Ejercicios Prácticos

### 📝 Ejercicio 1: Tipos Básicos y Variables

**Problema:** Crea un programa que declare variables de diferentes tipos básicos (string, number, boolean) y las muestre en consola. El programa debe incluir:

- Una variable `nombre` de tipo string con tu nombre
- Una variable `edad` de tipo number con tu edad
- Una variable `esEstudiante` de tipo boolean indicando si eres estudiante
- Muestra todas las variables en un mensaje formateado

<details>
<summary>🔍 Ver Solución</summary>

```typescript
// ejercicio1.ts
let nombre: string = 'Juan';
let edad: number = 25;
let esEstudiante: boolean = true;

console.log(`Nombre: ${nombre}`);
console.log(`Edad: ${edad}`);
console.log(`Es estudiante: ${esEstudiante}`);
console.log(
  `Resumen: ${nombre} tiene ${edad} años y ${
    esEstudiante ? 'es' : 'no es'
  } estudiante.`
);
```

**Para ejecutar:**

```bash
tsc ejercicio1.ts
node ejercicio1.js
```

</details>

---

### 📝 Ejercicio 2: Funciones con Tipos

**Problema:** Crea una función que calcule el área de un rectángulo. La función debe:

- Recibir dos parámetros: `ancho` (number) y `alto` (number)
- Retornar el área calculada (number)
- Incluir validación para asegurar que los valores sean positivos
- Mostrar el resultado en consola

<details>
<summary>🔍 Ver Solución</summary>

```typescript
// ejercicio2.ts
function calcularAreaRectangulo(ancho: number, alto: number): number {
  if (ancho <= 0 || alto <= 0) {
    throw new Error('El ancho y el alto deben ser valores positivos');
  }
  return ancho * alto;
}

const ancho: number = 10;
const alto: number = 5;
const area: number = calcularAreaRectangulo(ancho, alto);

console.log(`El área de un rectángulo de ${ancho}x${alto} es: ${area}`);
```

**Para ejecutar:**

```bash
tsc ejercicio2.ts
node ejercicio2.js
```

</details>

---

### 📝 Ejercicio 3: Arrays y Tipos

**Problema:** Crea un programa que maneje un array de números y realice las siguientes operaciones:

- Declara un array de números con al menos 5 elementos
- Calcula la suma de todos los elementos
- Encuentra el número mayor y el menor
- Muestra todos los resultados en consola

<details>
<summary>🔍 Ver Solución</summary>

```typescript
// ejercicio3.ts
function procesarNumeros(numeros: number[]): void {
  if (numeros.length === 0) {
    console.log('El array está vacío');
    return;
  }

  const suma: number = numeros.reduce((acc, num) => acc + num, 0);
  const mayor: number = Math.max(...numeros);
  const menor: number = Math.min(...numeros);

  console.log(`Array: [${numeros.join(', ')}]`);
  console.log(`Suma: ${suma}`);
  console.log(`Mayor: ${mayor}`);
  console.log(`Menor: ${menor}`);
}

const numeros: number[] = [10, 5, 20, 15, 8];
procesarNumeros(numeros);
```

**Para ejecutar:**

```bash
tsc ejercicio3.ts
node ejercicio3.js
```

</details>

---

### 📝 Ejercicio 4: Interfaces Básicas

**Problema:** Crea una interfaz `Persona` con las propiedades: `nombre` (string), `edad` (number) y `email` (string). Luego:

- Crea un objeto que implemente esta interfaz
- Crea una función `mostrarValores` que reciba una `Persona` y muestre su información formateada
- Ejecuta la función con el objeto creado

- 🔥 ¿y si les pido que `mostrarValores` pueda recibir cualquier objeto y mostrar sus claves y valores?

<details>
<summary>🔍 Ver Solución</summary>

```typescript
// ejercicio4.ts
interface Persona {
  nombre: string;
  edad: number;
  email: string;
}

function mostrarPersona(persona: Persona): void {
  console.log('=== Información de la Persona ===');
  console.log(`Nombre: ${persona.nombre}`);
  console.log(`Edad: ${persona.edad} años`);
  console.log(`Email: ${persona.email}`);
}

const persona1: Persona = {
  nombre: 'María',
  edad: 30,
  email: 'maria@example.com',
};

mostrarPersona(persona1);
```

**Para ejecutar:**

```bash
tsc ejercicio4.ts
node ejercicio4.js
```

</details>

---

### 📝 Ejercicio 5: Funciones con Parámetros Opcionales

**Problema:** Crea una función `saludar` que reciba un `nombre` (string) y un `titulo` opcional (string). La función debe:

- Si se proporciona el título, mostrar: "Hola, [título] [nombre]"
- Si no se proporciona el título, mostrar: "Hola, [nombre]"
- Probar la función con y sin título

<details>
<summary>🔍 Ver Solución</summary>

```typescript
// ejercicio5.ts
function saludar(nombre: string, titulo?: string): void {
  if (titulo) {
    console.log(`Hola, ${titulo} ${nombre}`);
  } else {
    console.log(`Hola, ${nombre}`);
  }
}

saludar('Pedro');
saludar('Ana', 'Dr.');
saludar('Carlos', 'Ing.');
```

**Para ejecutar:**

```bash
tsc ejercicio5.ts
node ejercicio5.js
```

</details>

---

### 📝 Ejercicio 6: Enums

**Problema:** Crea un enum `DiaSemana` con los días de la semana. Luego:

- Crea una función que reciba un `DiaSemana` y retorne si es día laboral o fin de semana
- Prueba la función con diferentes días
- Muestra los resultados en consola

<details>
<summary>🔍 Ver Solución</summary>

```typescript
// ejercicio6.ts
enum DiaSemana {
  Lunes = 'Lunes',
  Martes = 'Martes',
  Miercoles = 'Miércoles',
  Jueves = 'Jueves',
  Viernes = 'Viernes',
  Sabado = 'Sábado',
  Domingo = 'Domingo',
}

function esDiaLaboral(dia: DiaSemana): boolean {
  return dia !== DiaSemana.Sabado && dia !== DiaSemana.Domingo;
}

function obtenerTipoDia(dia: DiaSemana): string {
  return esDiaLaboral(dia) ? 'día laboral' : 'fin de semana';
}

const dias: DiaSemana[] = [
  DiaSemana.Lunes,
  DiaSemana.Miercoles,
  DiaSemana.Sabado,
  DiaSemana.Domingo,
];

dias.forEach((dia) => {
  console.log(`${dia} es ${obtenerTipoDia(dia)}`);
});
```

**Para ejecutar:**

```bash
tsc ejercicio6.ts
node ejercicio6.js
```

</details>

---

### 📝 Ejercicio 7: Tipos Union

**Problema:** Crea una función que pueda recibir un parámetro que puede ser `string` o `number`. La función debe:

- Si recibe un string, retornar su longitud
- Si recibe un number, retornar su valor al cuadrado
- Probar la función con ambos tipos

<details>
<summary>🔍 Ver Solución</summary>

```typescript
// ejercicio7.ts
function procesarValor(valor: string | number): number {
  if (typeof valor === 'string') {
    return valor.length;
  } else {
    return valor * valor;
  }
}

console.log(`Longitud de "Hola": ${procesarValor('Hola')}`);
console.log(`Cuadrado de 5: ${procesarValor(5)}`);
console.log(`Longitud de "TypeScript": ${procesarValor('TypeScript')}`);
console.log(`Cuadrado de 10: ${procesarValor(10)}`);
```

**Para ejecutar:**

```bash
tsc ejercicio7.ts
node ejercicio7.js
```

</details>

---

### 📝 Ejercicio 8: Clases Básicas

**Problema:** Crea una clase `Calculadora` con:

- Propiedades privadas: `resultado` (number)
- Constructor que inicialice `resultado` en 0
- Métodos: `sumar(num)`, `restar(num)`, `multiplicar(num)`, `dividir(num)`, `obtenerResultado()`
- Crea una instancia y realiza varias operaciones

<details>
<summary>🔍 Ver Solución</summary>

```typescript
// ejercicio8.ts
class Calculadora {
  private resultado: number;

  constructor() {
    this.resultado = 0;
  }

  sumar(numero: number): void {
    this.resultado += numero;
  }

  restar(numero: number): void {
    this.resultado -= numero;
  }

  multiplicar(numero: number): void {
    this.resultado *= numero;
  }

  dividir(numero: number): void {
    if (numero === 0) {
      throw new Error('No se puede dividir por cero');
    }
    this.resultado /= numero;
  }

  obtenerResultado(): number {
    return this.resultado;
  }

  reset(): void {
    this.resultado = 0;
  }
}

const calc = new Calculadora();
calc.sumar(10);
calc.multiplicar(2);
calc.restar(5);
console.log(`Resultado: ${calc.obtenerResultado()}`); // 15

calc.reset();
calc.sumar(100);
calc.dividir(4);
console.log(`Resultado: ${calc.obtenerResultado()}`); // 25
```

**Para ejecutar:**

```bash
tsc ejercicio8.ts
node ejercicio8.js
```

</details>

---

### 📝 Ejercicio 9: Interfaces con Métodos

**Problema:** Crea una interfaz `Vehiculo` con propiedades `marca` (string), `modelo` (string) y métodos `acelerar()` y `frenar()`. Luego:

- Crea una clase `Auto` que implemente esta interfaz
- Implementa los métodos para mostrar mensajes en consola
- Crea una instancia y prueba los métodos

<details>
<summary>🔍 Ver Solución</summary>

```typescript
// ejercicio9.ts
interface Vehiculo {
  marca: string;
  modelo: string;
  acelerar(): void;
  frenar(): void;
}

class Auto implements Vehiculo {
  marca: string;
  modelo: string;
  private velocidad: number = 0;

  constructor(marca: string, modelo: string) {
    this.marca = marca;
    this.modelo = modelo;
  }

  acelerar(): void {
    this.velocidad += 10;
    console.log(
      `${this.marca} ${this.modelo} aceleró. Velocidad: ${this.velocidad} km/h`
    );
  }

  frenar(): void {
    this.velocidad = Math.max(0, this.velocidad - 10);
    console.log(
      `${this.marca} ${this.modelo} frenó. Velocidad: ${this.velocidad} km/h`
    );
  }
}

const miAuto = new Auto('Toyota', 'Corolla');
miAuto.acelerar();
miAuto.acelerar();
miAuto.frenar();
```

**Para ejecutar:**

```bash
tsc ejercicio9.ts
node ejercicio9.js
```

</details>

---

### 📝 Ejercicio 10: Generics Básicos

**Problema:** Crea una función genérica `obtenerPrimerElemento` que:

- Reciba un array de cualquier tipo
- Retorne el primer elemento del array
- Funcione con arrays de strings, numbers y objetos
- Prueba la función con diferentes tipos de arrays

<details>
<summary>🔍 Ver Solución</summary>

```typescript
// ejercicio10.ts
function obtenerPrimerElemento<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined;
}

const numeros: number[] = [1, 2, 3, 4, 5];
const palabras: string[] = ['hola', 'mundo', 'typescript'];
const personas: { nombre: string; edad: number }[] = [
  { nombre: 'Juan', edad: 25 },
  { nombre: 'María', edad: 30 },
];

console.log(`Primer número: ${obtenerPrimerElemento(numeros)}`);
console.log(`Primera palabra: ${obtenerPrimerElemento(palabras)}`);
console.log(`Primera persona:`, obtenerPrimerElemento(personas));
```

**Para ejecutar:**

```bash
tsc ejercicio10.ts
node ejercicio10.js
```

</details>

---

### 📝 Ejercicio 11: Herencia de Clases

**Problema:** Crea una clase base `Animal` con propiedades `nombre` (string) y método `hacerSonido()`. Luego:

- Crea clases `Perro` y `Gato` que extiendan `Animal`
- Cada subclase debe implementar su propio `hacerSonido()`
- Crea instancias y prueba los métodos

<details>
<summary>🔍 Ver Solución</summary>

```typescript
// ejercicio11.ts
class Animal {
  protected nombre: string;

  constructor(nombre: string) {
    this.nombre = nombre;
  }

  hacerSonido(): void {
    console.log(`${this.nombre} hace un sonido`);
  }

  obtenerNombre(): string {
    return this.nombre;
  }
}

class Perro extends Animal {
  hacerSonido(): void {
    console.log(`${this.nombre} ladra: ¡Guau guau!`);
  }
}

class Gato extends Animal {
  hacerSonido(): void {
    console.log(`${this.nombre} maúlla: ¡Miau miau!`);
  }
}

const perro = new Perro('Max');
const gato = new Gato('Luna');

perro.hacerSonido();
gato.hacerSonido();
```

**Para ejecutar:**

```bash
tsc ejercicio11.ts
node ejercicio11.js
```

</details>

---

### 📝 Ejercicio 12: Tipos Literales y Const Assertions

**Problema:** Crea una función que use tipos literales para manejar estados. La función debe:

- Recibir un parámetro que solo pueda ser "pendiente", "en-proceso" o "completado"
- Retornar un mensaje diferente según el estado
- Probar con todos los estados posibles

<details>
<summary>🔍 Ver Solución</summary>

```typescript
// ejercicio12.ts
type EstadoTarea = 'pendiente' | 'en-proceso' | 'completado';

function obtenerMensajeEstado(estado: EstadoTarea): string {
  switch (estado) {
    case 'pendiente':
      return 'La tarea está pendiente de iniciar';
    case 'en-proceso':
      return 'La tarea está en proceso de ejecución';
    case 'completado':
      return 'La tarea ha sido completada';
    default:
      const _exhaustive: never = estado;
      return _exhaustive;
  }
}

const estados: EstadoTarea[] = ['pendiente', 'en-proceso', 'completado'];

estados.forEach((estado) => {
  console.log(`${estado}: ${obtenerMensajeEstado(estado)}`);
});
```

**Para ejecutar:**

```bash
tsc ejercicio12.ts
node ejercicio12.js
```

</details>

---

### 📝 Ejercicio 13: Clases Abstractas

**Problema:** Crea una clase abstracta `Forma` con:

- Propiedad abstracta `nombre` (string)
- Método abstracto `calcularArea()` que retorne number
- Método concreto `mostrarInfo()` que muestre nombre y área
- Crea clases `Circulo` y `Rectangulo` que extiendan `Forma`

<details>
<summary>🔍 Ver Solución</summary>

```typescript
// ejercicio13.ts
abstract class Forma {
  abstract nombre: string;

  abstract calcularArea(): number;

  mostrarInfo(): void {
    const area = this.calcularArea();
    console.log(`${this.nombre}: Área = ${area.toFixed(2)}`);
  }
}

class Circulo extends Forma {
  nombre: string = 'Círculo';
  private radio: number;

  constructor(radio: number) {
    super();
    this.radio = radio;
  }

  calcularArea(): number {
    return Math.PI * this.radio * this.radio;
  }
}

class Rectangulo extends Forma {
  nombre: string = 'Rectángulo';
  private ancho: number;
  private alto: number;

  constructor(ancho: number, alto: number) {
    super();
    this.ancho = ancho;
    this.alto = alto;
  }

  calcularArea(): number {
    return this.ancho * this.alto;
  }
}

const circulo = new Circulo(5);
const rectangulo = new Rectangulo(10, 8);

circulo.mostrarInfo();
rectangulo.mostrarInfo();
```

**Para ejecutar:**

```bash
tsc ejercicio13.ts
node ejercicio13.js
```

</details>

---

### 📝 Ejercicio 14: Tipos Avanzados y Utility Types

**Problema:** Crea una interfaz `Usuario` con propiedades `id`, `nombre`, `email`, `activo`. Luego:

- Crea un tipo `UsuarioParcial` usando `Partial<Usuario>`
- Crea un tipo `UsuarioSoloLectura` usando `Readonly<Usuario>`
- Crea funciones que trabajen con estos tipos
- Muestra ejemplos de uso

<details>
<summary>🔍 Ver Solución</summary>

```typescript
// ejercicio14.ts
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
}

type UsuarioParcial = Partial<Usuario>;
type UsuarioSoloLectura = Readonly<Usuario>;

function crearUsuarioParcial(datos: UsuarioParcial): UsuarioParcial {
  return datos;
}

function mostrarUsuario(usuario: UsuarioSoloLectura): void {
  console.log('=== Usuario (Solo Lectura) ===');
  console.log(`ID: ${usuario.id}`);
  console.log(`Nombre: ${usuario.nombre}`);
  console.log(`Email: ${usuario.email}`);
  console.log(`Activo: ${usuario.activo}`);
}

// Usuario parcial (todas las propiedades son opcionales)
const usuarioParcial: UsuarioParcial = {
  nombre: 'Juan',
  email: 'juan@example.com',
  // id y activo son opcionales
};

// Usuario completo como solo lectura
const usuarioCompleto: UsuarioSoloLectura = {
  id: 1,
  nombre: 'María',
  email: 'maria@example.com',
  activo: true,
};

console.log('Usuario Parcial:', usuarioParcial);
mostrarUsuario(usuarioCompleto);
```

**Para ejecutar:**

```bash
tsc ejercicio14.ts
node ejercicio14.js
```

</details>

---

### 📝 Ejercicio 15: Sistema Completo con Múltiples Clases

**Problema:** Crea un sistema de gestión de productos con:

- Interfaz `Producto` con `id`, `nombre`, `precio`, `stock`
- Clase `Tienda` que maneje un array de productos
- Métodos en `Tienda`: `agregarProducto()`, `buscarProducto()`, `venderProducto()`, `listarProductos()`
- Crea una instancia de `Tienda`, agrega productos y realiza operaciones

<details>
<summary>🔍 Ver Solución</summary>

```typescript
// ejercicio15.ts
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

class Tienda {
  private productos: Producto[] = [];
  private siguienteId: number = 1;

  agregarProducto(nombre: string, precio: number, stock: number): void {
    const producto: Producto = {
      id: this.siguienteId++,
      nombre,
      precio,
      stock,
    };
    this.productos.push(producto);
    console.log(`Producto agregado: ${nombre}`);
  }

  buscarProducto(id: number): Producto | undefined {
    return this.productos.find((p) => p.id === id);
  }

  venderProducto(id: number, cantidad: number): boolean {
    const producto = this.buscarProducto(id);

    if (!producto) {
      console.log(`Producto con ID ${id} no encontrado`);
      return false;
    }

    if (producto.stock < cantidad) {
      console.log(`Stock insuficiente. Disponible: ${producto.stock}`);
      return false;
    }

    producto.stock -= cantidad;
    const total = producto.precio * cantidad;
    console.log(`Venta realizada: ${cantidad}x ${producto.nombre} = $${total}`);
    return true;
  }

  listarProductos(): void {
    console.log('\n=== Productos en Tienda ===');
    if (this.productos.length === 0) {
      console.log('No hay productos disponibles');
      return;
    }

    this.productos.forEach((producto) => {
      console.log(
        `ID: ${producto.id} | ${producto.nombre} | Precio: $${producto.precio} | Stock: ${producto.stock}`
      );
    });
  }
}

// Uso del sistema
const tienda = new Tienda();

tienda.agregarProducto('Laptop', 1200, 5);
tienda.agregarProducto('Mouse', 25, 20);
tienda.agregarProducto('Teclado', 50, 15);

tienda.listarProductos();

tienda.venderProducto(1, 2); // Vender 2 laptops
tienda.venderProducto(2, 5); // Vender 5 mouses

tienda.listarProductos();
```

**Para ejecutar:**

```bash
tsc ejercicio15.ts
node ejercicio15.js
```

</details>

---

## 🏠 Tarea para la Próxima Clase

### ✅ Ejercicio:

Completa los siguientes ejercicios prácticos de TypeScript:

1. **Ejercicio de Consolidación:** Elige 3 ejercicios de los realizados en clase y mejóralos agregando:

   - Validación de entrada más robusta
   - Manejo de errores con try-catch
   - Comentarios JSDoc para documentar las funciones

2. **Ejercicio Nuevo:** Crea un sistema de gestión de tareas (TODO) con:

   - Interfaz `Tarea` con propiedades: `id`, `titulo`, `descripcion`, `completada`, `fechaCreacion`
   - Clase `GestorTareas` con métodos para agregar, completar, eliminar y listar tareas
   - Funcionalidad para filtrar tareas por estado (completadas/pendientes)

3. **Ejercicio de Tipos:** Crea un sistema de autenticación básico con:
   - Interfaz `Usuario` y `Credenciales`
   - Función que valide credenciales
   - Uso de tipos union para manejar diferentes estados de autenticación

**Requisitos técnicos:**

- Todos los archivos deben tener extensión `.ts`
- Compilar con `tsc` sin errores
- Ejecutar con `node` y mostrar resultados en consola
- Incluir comentarios explicativos en el código
- Usar tipos estrictos de TypeScript (no usar `any`)
- Implementar manejo de errores donde sea apropiado

---

## 📚 Recursos Adicionales

### 🔗 Enlaces Útiles

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - Documentación oficial completa de TypeScript
- [TypeScript Playground](https://www.typescriptlang.org/play) - Editor online para probar código TypeScript
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/) - Guía profunda sobre TypeScript
- [TypeScript Exercises](https://typescript-exercises.github.io/) - Ejercicios interactivos de TypeScript

### 📖 Conceptos para Investigar

- **Type Guards:** Técnicas para verificar tipos en tiempo de ejecución
- **Decorators:** Funcionalidad avanzada para modificar clases y métodos
- **Namespaces y Modules:** Organización de código en TypeScript
- **Type Inference:** Cómo TypeScript infiere tipos automáticamente

---

## ❓ Preguntas Frecuentes

### ¿Por qué usar TypeScript en lugar de JavaScript?

- **Tipado Estático:** Detecta errores antes de ejecutar el código
- **Mejor Autocompletado:** Los editores pueden sugerir código más preciso
- **Refactorización Segura:** Cambios en el código son más seguros con tipos
- **Documentación Implícita:** Los tipos sirven como documentación del código
- **Escalabilidad:** Facilita el mantenimiento en proyectos grandes

### ¿Cómo ejecuto archivos TypeScript desde la terminal?

- **Opción 1:** Compilar y ejecutar:
  ```bash
  tsc archivo.ts
  node archivo.js
  ```
- **Opción 2:** Usar ts-node (requiere instalación):
  ```bash
  npm install -g ts-node
  ts-node archivo.ts
  ```
- **Opción 3:** Usar tsx (alternativa moderna):
  ```bash
  npm install -g tsx
  tsx archivo.ts
  ```

### ¿Cuál es la diferencia entre `interface` y `type` en TypeScript?

- **Interface:** Mejor para definir la forma de objetos, puede extenderse y fusionarse
- **Type:** Más flexible, puede representar uniones, intersecciones y tipos primitivos
- **Recomendación:** Usa `interface` para objetos y `type` para uniones y tipos más complejos
- **Compatibilidad:** Ambos son intercambiables en muchos casos, pero tienen diferencias sutiles

---

## 🎉 ¡TypeScript Práctico Dominado!

¡Excelente trabajo! Ya has completado 15 ejercicios prácticos de TypeScript con dificultad incremental. Has aplicado conceptos desde tipos básicos hasta sistemas completos con clases, interfaces y herencia. En la próxima clase veremos **Introducción a Bases de Datos**, donde aprenderás los fundamentos de almacenamiento de datos.

**Recuerda:** La práctica constante es clave para dominar TypeScript. Intenta resolver los ejercicios sin ver las soluciones primero, y usa las soluciones como referencia cuando te quedes atascado. ¡Sigue practicando y construyendo proyectos! 🚀

---

_📧 **Contacto:** Si tienes dudas sobre los ejercicios prácticos de TypeScript, no dudes en consultar durante la clase o por los canales de comunicación establecidos._
