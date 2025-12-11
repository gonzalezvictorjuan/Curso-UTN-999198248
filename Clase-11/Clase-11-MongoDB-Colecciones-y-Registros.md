# 📖 Clase 11: MongoDB Colecciones y Registros

## 🎯 Objetivos de la Clase

- Practicar operaciones CRUD completas sobre colecciones en MongoDB.
- Dominar consultas con `find()` usando filtros, proyección, orden y paginación.
- Aplicar operadores de comparación, lógicos, arrays, regex y existencia/tipo.
- Usar buenas prácticas de modelado y diseño de documentos simples.
- Preparar el terreno para integrar con Mongoose en la próxima clase.

---

## 📚 ¿Qué son Colecciones y Registros en MongoDB?

### 🔍 Definición

- Una **colección** es un conjunto de documentos (similar a una tabla en relacionales, pero sin esquema rígido).
- Un **registro** es un **documento** BSON (JSON binario) con campos flexibles.

### 🏗️ Características Principales

- **Esquema flexible:** Los documentos de una misma colección pueden variar en campos.
- **Índices:** Mejora de rendimiento en búsquedas y ordenamientos.
- **Relaciones flexibles:** Estrategias embebidas o referenciadas.
- **Agregaciones:** Pipeline para transformar/relacionar datos.

### 📖 Historia Breve

- 2009: lanzamiento de MongoDB.
- 2013-2017: consolidación de Aggregation Framework y `$lookup`.
- 2020+: transacciones, rendimiento e integración cloud (Atlas).

---

## 🏛️ Operaciones Básicas en colecciones

### 📝 Crear base de datos y colecciones

```javascript
use curso_mongo_clase11;
// Crear explícitamente (opcional)
db.createCollection('authors');
db.createCollection('books');
```

### 📝 Insertar documentos

```javascript
// Insertar múltiples autores
db.authors.insertMany([
  { name: 'Gabriel García Márquez', birthYear: 1927, country: 'Colombia' },
  { name: 'Isabel Allende', birthYear: 1942, country: 'Chile' },
  { name: 'J. R. R. Tolkien', birthYear: 1892, country: 'Reino Unido' },
]);

// Insertar libros (rellenar con ObjectId reales de authors)
db.books.insertMany([
  {
    title: 'Cien años de soledad',
    pages: 471,
    publishedAt: new Date('1967-05-30'),
    tags: ['ficción', 'realismo mágico'],
    authorId: ObjectId('REEMPLAZAR_ID_MARQUEZ'),
  },
  {
    title: 'La casa de los espíritus',
    pages: 433,
    publishedAt: new Date('1982-01-01'),
    tags: ['ficción', 'familia'],
    authorId: ObjectId('REEMPLAZAR_ID_ALLENDE'),
  },
]);
```

### 📝 Lectura (find) con proyección, orden, paginación

```javascript
// Proyección (incluir)
db.books.find({}, { title: 1, pages: 1 });
// Proyección (excluir)
db.books.find({}, { tags: 0 });
// Orden asc/desc
db.books.find().sort({ pages: 1 });
db.books.find().sort({ pages: -1 });
// Paginación
db.books.find().skip(5).limit(5);
```

### 📝 Actualización y borrado

```javascript
// Actualizar uno
db.books.updateOne({ title: 'Cien años de soledad' }, { $set: { pages: 480 } });
// Actualizar muchos con operadores
db.books.updateMany({ tags: 'ficción' }, { $inc: { pages: 10 } });
// Borrar
db.books.deleteOne({ title: 'La casa de los espíritus' });
db.books.deleteMany({ pages: { $lt: 200 } });
```

### 📝 Operadores útiles

```javascript
// Comparación
db.books.find({ pages: { $gt: 400 } });
db.books.find({ pages: { $gte: 300, $lte: 500 } });
// Lógicos
db.books.find({ $or: [{ title: /amor/i }, { pages: { $gt: 450 } }] });
// Arrays
db.books.find({ tags: 'ficción' });
db.books.find({ tags: { $all: ['ficción', 'familia'] } });
db.books.find({ tags: { $size: 2 } });
// Regex
db.books.find({ title: { $regex: /^el/i } });
// Existencia y tipo
db.books.find({ publishedAt: { $exists: true } });
db.books.find({ pages: { $type: 'number' } });
```

---

## 🏗️ Conceptos Avanzados

### 📄 Índices básicos

Los índices aceleran búsquedas y ordenamientos a costa de espacio en disco y mayor costo al escribir (insert/update). Un índice simple como `{ title: 1 }` ayuda a `find({ title })` y a `sort({ title: 1 })`. Los índices compuestos optimizan consultas que filtran/ordenan por múltiples campos respetando el prefijo del índice.

```javascript
// Índice simple
db.books.createIndex({ title: 1 });
// Índice compuesto
db.books.createIndex({ authorId: 1, publishedAt: -1 });
// Ver índices
db.books.getIndexes();
```

### 📄 Validación simple de colecciones (JSON Schema)

La validación garantiza que los documentos insertados o actualizados cumplan un esquema mínimo en el servidor, preservando la integridad de datos más allá de las validaciones de la aplicación. Puede definirse al crear la colección o aplicarse luego con `collMod`.

Cuándo se hace:

- Al crear: `db.createCollection('nombre', { validator })`.
- En una existente: `db.runCommand({ collMod: 'nombre', validator })`.

Severidad y alcance:

- `validationAction`: `'error'` (bloquea) o `'warn'` (solo registra).
- `validationLevel`: `'strict'` (todos los docs) o `'moderate'` (solo nuevos/actualizados).

Cuándo usarla: cuando hay múltiples escritores/servicios, querés asegurar calidad de datos en el servidor o endurecer un esquema ya estabilizado. En migraciones, iniciar con `warn/moderate` y luego pasar a `error/strict`.

```javascript
db.runCommand({
  collMod: 'authors',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'birthYear'],
      properties: {
        name: { bsonType: 'string' },
        birthYear: { bsonType: 'int' },
        country: { bsonType: 'string' },
      },
    },
  },
  validationAction: 'error', // o 'warn' para solo registrar
  validationLevel: 'strict', // o 'moderate' para docs nuevos/actualizados
});
```

---

## 🚀 Ejercicios Prácticos (10)

> Trabaja en `curso_mongo_clase11`. Crea datos de prueba según sea necesario. Usa `pretty()` cuando te ayude a leer.

1. Insertar 5 autores y 12 libros con al menos 2 tags por libro.

<details>
<summary>🔍 Ver Solución</summary>

```javascript
// Usa insertMany en authors y books.
```

</details>

---

2. Obtener los 5 libros con más páginas mostrando `title`, `pages` y ocultando `_id`.

<details>
<summary>🔍 Ver Solución</summary>

```javascript
db.books.find({}, { _id: 0, title: 1, pages: 1 }).sort({ pages: -1 }).limit(5);
```

</details>

---

3. Listar libros publicados entre 1970 y 1990 (inclusive) ordenados por `publishedAt` asc.

<details>
<summary>🔍 Ver Solución</summary>

```javascript
db.books
  .find({
    publishedAt: { $gte: new Date('1970-01-01'), $lte: new Date('1990-12-31') },
  })
  .sort({ publishedAt: 1 });
```

</details>

---

4. Agregar el campo `classic: true` a libros con `publishedAt < 1975`.

<details>
<summary>🔍 Ver Solución</summary>

```javascript
db.books.updateMany(
  { publishedAt: { $lt: new Date('1975-01-01') } },
  { $set: { classic: true } }
);
```

</details>

---

5. Subir 50 páginas a todos los libros con tag `fantasía`.

<details>
<summary>🔍 Ver Solución</summary>

```javascript
db.books.updateMany({ tags: 'fantasía' }, { $inc: { pages: 50 } });
```

</details>

---

6. Borrar libros con menos de 150 páginas y verificar cuántos fueron eliminados.

<details>
<summary>🔍 Ver Solución</summary>

```javascript
db.books.deleteMany({ pages: { $lt: 150 } });
```

</details>

---

7. Buscar libros cuyo título contenga "amor" o "soledad", ignorando mayúsculas.

<details>
<summary>🔍 Ver Solución</summary>

```javascript
db.books.find({ title: /amor|soledad/i }, { title: 1 });
```

</details>

---

8. Traer solo libros con exactamente 2 tags y proyectar `title` y `tags`.

<details>
<summary>🔍 Ver Solución</summary>

```javascript
db.books.find({ tags: { $size: 2 } }, { title: 1, tags: 1 });
```

</details>

---

9. Crear un índice compuesto `{ authorId: 1, pages: -1 }` y correr una consulta que lo use.
<details>
<summary>🔍 Ver Solución</summary>

```javascript
db.books.createIndex({ authorId: 1, pages: -1 });
db.books.find({ authorId: ObjectId('REEMPLAZAR') }).sort({ pages: -1 });
```

</details>

---

10. Paginación: traer página 2 de tamaño 5 (registros 6–10) ordenados por `title` asc.

<details>
<summary>🔍 Ver Solución</summary>

```javascript
const page = 2;
const size = 5;
db.books
  .find()
  .sort({ title: 1 })
  .skip((page - 1) * size)
  .limit(size);
```

</details>

---

## 🏠 Tarea para la Próxima Clase

### ✅ Ejercicio

Construye un mini-conjunto de consultas y actualizaciones sobre `books` y `authors` que incluya:

1. Paginación con `skip/limit` y `sort` por `publishedAt`.
2. Uso de operadores `$and`, `$or`, `$in` y `$nin`.
3. Actualizaciones con `$set`, `$inc` y `$unset`.
4. Borrados selectivos con filtros por `pages` y `tags`.
5. Creación y verificación de un índice que beneficie una consulta concreta.

**Requisitos técnicos:**

- Documenta cada consulta con un comentario breve.
- Incluye resultados de ejemplo o `explain("executionStats")` de una consulta clave.
- Mantén proyecciones reducidas para bajar payload.

---

## 📚 Recursos Adicionales

### 🔗 Enlaces Útiles

- https://www.mongodb.com/docs/manual/crud/ - CRUD
- https://www.mongodb.com/docs/manual/reference/operator/query/ - Operadores de consulta
- https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex/ - Índices
- https://www.mongodb.com/docs/manual/core/schema-validation/ - Validación de esquema

### 📖 Conceptos para Investigar

- Modelado: embebido vs referenciado
- Índices compuestos y orden de campos
- Proyección y reducción de payload
- Diseño de documentos y evolución de esquema

---

## ❓ Preguntas Frecuentes

### ¿Debo crear colecciones antes de insertar?

- No es obligatorio; se crean al insertar. Úsalo si querés validator o configuración previa.

### ¿Cómo evitar traer campos innecesarios?

- Usá proyecciones y `project` (en agregaciones) para limitar los campos.

### ¿Cuándo conviene crear índices?

- Cuando filtrás/ordenás frecuentemente por los mismos campos y el volumen lo amerita.

---

## 🎉 ¡Colecciones y Registros Dominados!

Excelente trabajo. Ya dominás CRUD, consultas y operadores centrales en MongoDB. En la próxima clase integraremos estos conceptos con Mongoose en TypeScript. 🚀
