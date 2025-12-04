# 📖 Clase 10: Introducción a MongoDB

## 🎯 Objetivos de la Clase

- Comprender qué es MongoDB y su modelo de documentos.
- Crear una base de datos y colecciones desde el mongo shell.
- Realizar operaciones CRUD básicas en colecciones `authors` y `books`.
- Consultar con `find()` usando operadores de comparación y lógicos.
- Trabajar con arrays (tags), proyecciones, ordenamiento y paginación.
- Relacionar colecciones con `$lookup` (equivalente a populate en Mongoose).
- Aplicar agregaciones avanzadas: `$expr`, `$cond`, `$facet`, `$addFields`, `$group`.
- Identificar buenas prácticas de rendimiento e indexación.

---

## 📚 ¿Qué es MongoDB?

### 🔍 Definición

**MongoDB** es una base de datos NoSQL orientada a documentos, donde los registros se almacenan como documentos BSON (JSON binario) dentro de colecciones, con esquema flexible.

### 🏗️ Características Principales

- **Documental y flexible:** no requiere esquemas rígidos.
- **Colecciones e índices:** estructura por colecciones con soporte de índices compuestos y de texto.
- **Escalabilidad:** replicación y sharding nativos.
- **Agregaciones poderosas:** pipeline para transformar y combinar datos.

### 📖 Historia Breve

- **2009:** Lanzamiento inicial de MongoDB.
- **2013-2017:** Maduración del framework de agregación y `$lookup`.
- **2020+:** Enfoque en rendimiento, transacciones y herramientas en la nube (Atlas).
- **Actualidad:** Amplio uso en aplicaciones web y microservicios.

---

## 🏛️ Fundamentos de MongoDB en el shell

### 📝 Crear base de datos y colecciones

Conectarse y seleccionar base de datos:

```javascript
use tutorial_mongo;
```

Crear colecciones (opcional, se crean al insertar):

```javascript
db.createCollection('authors');
db.createCollection('books');
```

### 📝 Insertar documentos (authors & books)

Insertar autores:

```javascript
db.authors.insertMany([
  {
    name: 'Gabriel García Márquez',
    birthYear: 1927,
    bio: 'Escritor colombiano',
  },
  { name: 'Isabel Allende', birthYear: 1942, bio: 'Escritora chilena' },
  { name: 'J. R. R. Tolkien', birthYear: 1892, bio: 'Autor británico' },
]);
```

Obtener los `_id` creados:

```javascript
db.authors.find().pretty();
```

Insertar libros referenciando autores:

```javascript
db.books.insertMany([
  {
    title: 'Cien años de soledad',
    pages: 471,
    publishedAt: new Date('1967-05-30'),
    tags: ['ficción', 'realismo mágico'],
    authorId: ObjectId('REEMPLAZAR_POR_ID_MARQUEZ'),
  },
  {
    title: 'El amor en los tiempos del cólera',
    pages: 348,
    publishedAt: new Date('1985-01-01'),
    tags: ['ficción', 'amor'],
    authorId: ObjectId('REEMPLAZAR_POR_ID_MARQUEZ'),
  },
  {
    title: 'La casa de los espíritus',
    pages: 433,
    publishedAt: new Date('1982-01-01'),
    tags: ['ficción', 'familia'],
    authorId: ObjectId('REEMPLAZAR_POR_ID_ALLENDE'),
  },
  {
    title: 'El hobbit',
    pages: 310,
    publishedAt: new Date('1937-09-21'),
    tags: ['fantasía', 'aventura'],
    authorId: ObjectId('REEMPLAZAR_POR_ID_TOLKIEN'),
  },
]);
```

### 📝 CRUD básico

Crear:

```javascript
db.authors.insertOne({
  name: 'Borges',
  birthYear: 1899,
  bio: 'Escritor argentino',
});
db.books.insertOne({
  title: 'Poemas',
  pages: 120,
  authorId: ObjectId('ID_BORGES'),
});
```

Leer:

```javascript
db.books.find();
db.books.find().pretty();
db.books.find({ title: 'El hobbit' });
```

Actualizar:

```javascript
db.books.updateOne({ title: 'El hobbit' }, { $set: { pages: 320 } });
```

Actualizar varios:

```javascript
db.books.updateMany({ tags: 'fantasía' }, { $inc: { pages: 20 } }); // incrementar 20 páginas a todos los libros con tag 'fantasía'
db.books.updateMany(
  { publishedAt: { $lt: new Date('1970-01-01') } }, // libros publicados antes del 1970
  { $set: { classic: true } } // agregar campo 'classic' con valor true
); // actualizar libros publicados antes del 1970
```

Borrar:

```javascript
db.books.deleteOne({ title: 'El hobbit' });
db.authors.deleteOne({ name: 'Borges' });
```

Borrar varios:

```javascript
db.books.deleteMany({ pages: { $lt: 150 } }); // borrar libros con menos de 150 páginas
db.authors.deleteMany({ birthYear: { $lt: 1900 } }); // borrar autores nacidos antes del 1900
```

### 📝 Consultas con find(), proyección y paginación

Proyección incluir/excluir:

```javascript
db.books.find({}, { title: 1, pages: 1 }); // incluir title y pages
db.books.find({}, { tags: 0 }); // excluir tags
```

Orden, límite y paginación:

```javascript
db.books.find().sort({ pages: 1 }); // asc
db.books.find().sort({ pages: -1 }); // desc
db.books.find().limit(3);
db.books.find().skip(2).limit(2);
```

### 📝 Operadores de comparación y lógicos

Comparación:

```javascript
db.books.find({ pages: { $gt: 400 } }); // mayor que
db.books.find({ pages: { $gte: 400 } }); // mayor o igual que
db.books.find({ pages: { $lt: 350 } }); // menor que
db.books.find({ pages: { $lte: 350 } }); // menor o igual que
db.books.find({ pages: { $ne: 471 } }); // no igual a
```

Lógicos:

```javascript
db.books.find({
  $and: [{ pages: { $gt: 300 } }, { pages: { $lt: 450 } }], // libros con páginas entre 300 y 450
});

db.books.find({
  $or: [{ title: /soledad/i }, { title: /espíritus/i }], // libros con título que contenga "soledad" o "espíritus"
});

db.books.find({ pages: { $not: { $gt: 350 } } }); // libros con páginas no mayores a 350

db.books.find({
  $nor: [{ title: /soledad/i }, { pages: { $lte: 250 } }], // libros que no cumplan con las condiciones anteriores
});
```

### 📝 Trabajo con arrays y regex

Arrays:

```javascript
db.books.find({ tags: 'fantasía' }); // libros con tag 'fantasía'
db.books.find({ tags: { $in: ['ficción', 'realismo mágico'] } }); // libros con tag 'ficción' o 'realismo mágico'
db.books.find({ tags: { $nin: ['fantasía', 'terror'] } }); // libros sin tag 'fantasía' ni 'terror'
db.books.find({ tags: { $size: 2 } }); // libros con 2 tags
db.books.find({ tags: { $all: ['ficción', 'amor'] } }); // libros con tags 'ficción' y 'amor'
```

Texto/regex:

```javascript
db.books.find({ title: /amor/i }); // buscar títulos que contengan "amor" (insensible a mayúsculas)
db.books.find({ title: { $regex: /^el/i } }); // títulos que empiezan con "el"
db.books.find({ title: { $regex: /(amor|espíritus|soledad)/i } }); // títulos que contienen cualquiera de las palabras
```

### 📝 Existencia y tipos

```javascript
db.books.find({ publishedAt: { $exists: true } }); // documentos que tienen el campo publishedAt
db.books.find({ pages: { $type: 'number' } }); // documentos donde pages es un número
```

---

## 🏗️ Agregaciones y relaciones ($lookup)

En esta sección usamos el Aggregation Pipeline para unir y transformar datos entre `books` y `authors`.
El pipeline permite realizar operaciones avanzadas como filtrado, proyección y unión de colecciones. Proyección es la forma de seleccionar y transformar los campos resultantes, permitiendo mostrar solo la información necesaria para el análisis o la presentación.

### 📄 $lookup simple: agregar autor a cada libro

Une cada libro con su autor (`authorId` → `_id`) y agrega un array `author` con el/los autores coincidentes, facilitando el acceso a datos relacionados sin necesidad de múltiples consultas.

```javascript
db.books
  .aggregate([
    {
      $lookup: {
        from: 'authors',
        localField: 'authorId',
        foreignField: '_id',
        as: 'author',
      },
    },
  ])
  .pretty(); // Muestra el resultado formateado
```

### 📄 $lookup con proyección

Después del `lookup`, usamos `$project` para mostrar solo campos relevantes (por ejemplo, `title`, `pages` y `author.name`).

```javascript
db.books.aggregate([
  {
    $lookup: {
      from: 'authors',
      localField: 'authorId',
      foreignField: '_id',
      as: 'author',
    },
  },
  {
    $project: { title: 1, pages: 1, author: { name: 1 } },
  },
]);
```

### 📄 Lookup inverso: autores con sus libros

Partiendo de `authors`, traemos el array `books` correspondiente a cada autor (relación inversa por `_id` → `authorId`).

```javascript
db.authors
  .aggregate([
    {
      $lookup: {
        from: 'books',
        localField: '_id',
        foreignField: 'authorId',
        as: 'books',
      },
    },
  ])
  .pretty();
```

### 📄 $lookup con pipeline

Uso avanzado: dentro de `$lookup` definimos un `pipeline` para filtrar/proyectar del lado de `authors` usando variables (`let`) y `$expr`.

```javascript
db.books.aggregate([
  {
    $lookup: {
      from: 'authors',
      let: { idAutor: '$authorId' },
      pipeline: [
        { $match: { $expr: { $eq: ['$_id', '$$idAutor'] } } },
        { $project: { name: 1, birthYear: 1 } },
      ],
      as: 'author',
    },
  },
]);
```

---

## 🚀 Ejercicio Práctico

### 📝 CRUD + Consultas + $lookup

1. Seed de datos (8 autores, 30 libros)
2. Consultas con filtros por pages y publishedAt
3. Paginación con skip/limit y sort por fecha
4. $lookup para traer autor dentro de cada libro
5. Reporte por autor: total de libros y promedio de páginas

**Archivo `mongosh-seed-ejercicios.js`:**

> Pseudoseed: inserta autores y libros con referencia authorId

---

## 🏠 Tarea para la Próxima Clase

### ✅ Ejercicio:

Construir un conjunto de consultas y agregaciones sobre `authors` y `books` que incluya:

1. **Paginación y sort** Implementar paginación con `skip/limit` y ordenar por `publishedAt`.
2. **Operadores avanzados** Usar `$expr` y `$cond` para clasificar libros como "LARGO" o "CORTO".
3. **Relaciones** Obtener autores con sus libros y filtrar por `pages > 400` usando `$lookup` + `$unwind`.

**Requisitos técnicos:**

- Crear índices en `authorId` y `publishedAt` donde corresponda.
- Usar `project` temprano para reducir payload (evitar traer campos innecesarios como `description`).
- Documentar cada consulta con un comentario breve.
- Adjuntar salida de ejemplo (o `explain("executionStats")`).

---

## 📚 Recursos Adicionales

### 🔗 Enlaces Útiles

- https://www.mongodb.com/docs/manual/crud/ - Operaciones CRUD
- https://www.mongodb.com/docs/manual/aggregation/ - Aggregation Pipeline
- https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/ - $lookup
- https://www.mongodb.com/docs/manual/reference/operator/query/ - Operadores de consulta
- https://www.mongodb.com/docs/manual/indexes/ - Índices
- https://www.mongodb.com/docs/manual/reference/explain-results/ - Explain

### 📖 Conceptos para Investigar

- **Normalización vs denormalización** Estrategias y trade-offs en MongoDB.
- **Índices compuestos** Diseño y orden de campos.
- **Rendimiento en agregaciones** Uso de `$match` y `$project` tempranos.
- **Diseño de esquemas** Patrones para 1:N y N:N.

---

## ❓ Preguntas Frecuentes

### ¿Qué diferencia hay entre `populate` (Mongoose) y `$lookup`?

- **`populate`** Es una función de Mongoose que resuelve referencias automáticamente en Node.js.
- **`$lookup`** Es una etapa del Aggregation Pipeline en MongoDB para combinar colecciones.
- **Práctica:** `populate` es cómodo en app; `$lookup` es explícito y muy flexible en el servidor.

### ¿Cómo filtro por campos de documentos relacionados?

- Usa `$lookup` + `$unwind` y luego `$match` con `$expr` si necesitás comparar campos entre colecciones.

### ¿Cuándo conviene referenciar vs. embebido?

- Embebido si el subdocumento se lee siempre junto al padre y no crece sin límite.
- Referenciado si se comparte entre muchos documentos o crece mucho/independiente.

### ¿Cómo mejoro el rendimiento de consultas?

- Crear índices en campos filtrados/ordenados.
- Usar `explain()` para entender costos.
- Reducir documentos temprano con `$project`.

---

## 🎉 ¡MongoDB Dominado!

¡Excelente trabajo! Ya conoces creación de colecciones, CRUD, consultas con operadores, manejo de arrays y regex, `$lookup` y agregaciones avanzadas. En la próxima clase veremos integración con Mongoose y patrones de diseño de datos.

**Recuerda:** practica con tus propios datasets y mide con `explain()`. ¡A experimentar! 🚀

---

_📧 **Contacto:** Si tienes dudas sobre MongoDB, no dudes en consultar durante la clase o por los canales de comunicación establecidos._
