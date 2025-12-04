// Seleccionar base de datos
db = db.getSiblingDB('tutorial_mongo');

// ===== Seed: autores =====
const authors = [
  {
    name: 'Gabriel García Márquez',
    birthYear: 1927,
    bio: 'Escritor colombiano',
  },
  { name: 'Isabel Allende', birthYear: 1942, bio: 'Escritora chilena' },
  { name: 'J. R. R. Tolkien', birthYear: 1892, bio: 'Autor británico' },
  { name: 'Jorge Luis Borges', birthYear: 1899, bio: 'Escritor argentino' },
  { name: 'Haruki Murakami', birthYear: 1949, bio: 'Escritor japonés' },
  {
    name: 'Ursula K. Le Guin',
    birthYear: 1929,
    bio: 'Escritora estadounidense',
  },
  { name: 'Julio Cortázar', birthYear: 1914, bio: 'Escritor argentino' },
  { name: 'Ray Bradbury', birthYear: 1920, bio: 'Escritor estadounidense' },
];

db.authors.insertMany(authors);
const authorIds = db.authors
  .find({}, { _id: 1 })
  .toArray()
  .map((a) => a._id);
const tagPool = [
  'ficción',
  'realismo mágico',
  'amor',
  'familia',
  'fantasía',
  'aventura',
  'ciencia ficción',
  'clásico',
  'misterio',
  'drama',
];

const titles = [
  'Cien años de soledad',
  'El amor en los tiempos del cólera',
  'La casa de los espíritus',
  'El hobbit',
  'El señor de los anillos',
  'Kafka en la orilla',
  'Crónica del pájaro que da cuerda al mundo',
  'La mano izquierda de la oscuridad',
  'Un mago de Terramar',
  'Fahrenheit 451',
  'Rayuela',
  'El Aleph',
  'Bestiario',
  'El jardín de senderos que se bifurcan',
  'Ciudad',
  'Crónicas marcianas',
  'Los funerales de la Mamá Grande',
  'Doce cuentos peregrinos',
  'De amor y de sombra',
  'Paula',
  'Hijos de la medianoche',
  'Tokio Blues',
  'La insoportable levedad del ser',
  '1984',
  'Animal Farm',
  'Solaris',
  'La invención de Morel',
  'Las armas secretas',
  'El Silmarillion',
  'Cuentos de hielo y fuego',
];

// Generación determinista de 30 libros
for (let i = 0; i < 30; i++) {
  const pages = 120 + ((i * 17) % 500); // rango 120-619
  const year = 1930 + (i % 91); // 1930..2020
  const month = i % 12; // 0..11
  const day = (i % 28) + 1; // 1..28
  const doc = {
    title: titles[i],
    pages: pages,
    publishedAt: new Date(year, month, day),
    tags: [tagPool[i % tagPool.length], tagPool[(i + 3) % tagPool.length]],
    authorId: authorIds[i % authorIds.length],
  };
  db.books.insertOne(doc);
}

db.books.createIndex({ authorId: 1 });
db.books.createIndex({ publishedAt: 1 });

// ===== Ejercicios: queries =====
// 2) Filtros: pages y publishedAt
print('\n==== 2) Filtros: pages y publishedAt ====');
print('Libros con pages > 400');
printjson(
  db.books
    .find({ pages: { $gt: 400 } }) // libros con más de 400 páginas
    .limit(5)
    .toArray()
);

print('Publicados después de 1970-01-01');
printjson(
  db.books
    .find({ publishedAt: { $gt: new Date('1970-01-01') } }) // libros publicados después de 1970
    .limit(5)
    .toArray()
);

print('Entre 1950-01-01 y 1980-12-31');
printjson(
  db.books
    .find({
      publishedAt: {
        $gte: new Date('1950-01-01'), // libros publicados desde 1950
        $lte: new Date('1980-12-31'), // hasta 1980
      },
    })
    .limit(5)
    .toArray()
);

// 3) Paginación y sort por publishedAt
print('\n==== 3) Paginación y sort por publishedAt ====');
const page = 1; // 0-index
const pageSize = 5;
printjson(
  db.books
    .find({}, { title: 1, publishedAt: 1 }) // solo campos necesarios
    .sort({ publishedAt: -1 }) // orden descendente por fecha
    .skip(page * pageSize) // salta los libros de las páginas anteriores
    .limit(pageSize)
    .toArray()
);

// 4) $lookup: libros con datos de autor
print('\n==== 4) $lookup: libros con datos de autor ====');
printjson(
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
      { $project: { title: 1, pages: 1, publishedAt: 1, 'author.name': 1 } }, // solo campos necesarios
      { $limit: 5 },
    ])
    .toArray()
);

// 5) Reporte por autor
print('\n==== 5) Reporte por autor (totalLibros, promedioPaginas) ====');
printjson(
  db.books
    .aggregate([
      {
        $group: {
          _id: '$authorId',
          totalLibros: { $sum: 1 }, // cuenta libros por autor
          promedioPaginas: { $avg: '$pages' }, // promedio de páginas por autor
        },
      },
      {
        $lookup: {
          from: 'authors',
          localField: '_id',
          foreignField: '_id',
          as: 'author',
        },
      },
      { $unwind: '$author' },
      {
        $project: {
          _id: 0,
          author: '$author.name',
          totalLibros: 1,
          promedioPaginas: { $round: ['$promedioPaginas', 2] }, // redondea a 2 decimales
        },
      },
      { $sort: { totalLibros: -1, author: 1 } },
    ])
    .toArray()
);
