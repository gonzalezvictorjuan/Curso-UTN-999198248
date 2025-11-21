# 📖 Clase 6: Introducción a Bases de Datos (MySQL)

## 🎯 Objetivos de la Clase

- Comprender qué son las bases de datos relacionales y su importancia en el desarrollo backend
- Aprender los conceptos fundamentales: tablas, columnas, registros y tipos de datos
- Entender las relaciones entre tablas en bases de datos relacionales
- Dominar los tipos de datos disponibles en MySQL
- Aplicar los conceptos aprendidos mediante ejercicios prácticos con SQL

---

## 📚 ¿Qué son las Bases de Datos?

### 🔍 Definición

**Una base de datos** es un sistema organizado para almacenar, gestionar y recuperar información de manera eficiente. Las bases de datos relacionales, como MySQL, organizan los datos en tablas que se relacionan entre sí mediante claves, permitiendo almacenar grandes cantidades de información de forma estructurada y accesible.

### 🏗️ Características Principales

- **Persistencia de Datos:** Los datos se almacenan de forma permanente en el disco
- **Integridad Referencial:** Garantiza la consistencia de los datos mediante relaciones
- **Consultas SQL:** Permite realizar consultas complejas para recuperar información específica
- **Transacciones:** Soporta operaciones atómicas que garantizan la consistencia de los datos
- **Escalabilidad:** Puede manejar grandes volúmenes de datos y múltiples usuarios simultáneamente

### 📖 Historia Breve

- **1970:** Edgar F. Codd propone el modelo relacional de bases de datos
- **1986:** Se estandariza el lenguaje SQL (Structured Query Language)
- **1995:** Se lanza MySQL como sistema de gestión de bases de datos relacional de código abierto
- **2000:** MySQL se convierte en una de las bases de datos más populares del mundo
- **2025:** MySQL es una de las bases de datos relacionales más utilizadas, especialmente en aplicaciones web

---

## 🏛️ Conceptos Fundamentales de Bases de Datos

### 📝 ¿Qué son las Bases de Datos?

Una base de datos es una colección organizada de información estructurada que se almacena y gestiona electrónicamente. En el contexto de desarrollo backend, las bases de datos son esenciales para:

- **Almacenar información de usuarios:** credenciales, perfiles, preferencias
- **Gestionar contenido:** artículos, productos, comentarios
- **Mantener relaciones:** conexiones entre diferentes entidades (usuarios-productos, pedidos-items)
- **Garantizar persistencia:** los datos permanecen disponibles incluso después de reiniciar la aplicación

**Ejemplo de uso:**

```sql
-- Crear una base de datos
CREATE DATABASE mi_aplicacion;

-- Usar la base de datos
USE mi_aplicacion;
```

### 📝 Tablas

Una **tabla** es una estructura bidimensional que organiza los datos en filas y columnas. Cada tabla representa una entidad del mundo real (por ejemplo: usuarios, productos, pedidos).

**Características de las tablas:**

- Cada tabla tiene un nombre único dentro de la base de datos
- Las tablas contienen filas (registros) y columnas (campos)
- Cada tabla debe tener al menos una columna
- Las tablas pueden relacionarse entre sí mediante claves foráneas

**Ejemplo de creación de tabla:**

```sql
-- Crear una tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 📝 Columnas

Las **columnas** (también llamadas campos o atributos) definen el tipo de datos que se almacenará en cada posición de la tabla. Cada columna tiene:

- **Nombre:** identificador único dentro de la tabla
- **Tipo de dato:** define qué tipo de información puede almacenar
- **Restricciones:** reglas que deben cumplir los datos (NOT NULL, UNIQUE, etc.)

**Ejemplo de definición de columnas:**

```sql
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,                    -- Columna de tipo INT (auto-incremental)
    nombre VARCHAR(200) NOT NULL,                         -- Columna de texto, obligatoria
    precio DECIMAL(10, 2) NOT NULL,                      -- Columna numérica decimal
    descripcion TEXT,                                     -- Columna de texto largo, opcional
    stock INT DEFAULT 0,                                  -- Columna numérica con valor por defecto
    activo BOOLEAN DEFAULT TRUE                           -- Columna booleana
);
```

### 📝 Registros

Un **registro** (también llamado fila o tupla) es una instancia individual de datos dentro de una tabla. Cada registro representa una entidad específica y contiene valores para cada columna definida.

**Características de los registros:**

- Cada registro debe tener valores compatibles con el tipo de dato de cada columna
- Los registros pueden tener valores NULL (si la columna lo permite)
- Cada registro debe ser único (generalmente mediante una clave primaria)

**Ejemplo de inserción de registros:**

```sql
-- Insertar un registro en la tabla usuarios
INSERT INTO usuarios (nombre, email)
VALUES ('Juan Pérez', 'juan@example.com');

-- Insertar múltiples registros
INSERT INTO usuarios (nombre, email)
VALUES
    ('María García', 'maria@example.com'),
    ('Carlos López', 'carlos@example.com');
```

### 📝 Tipos de Datos

Los **tipos de datos** definen qué tipo de información puede almacenar una columna. MySQL ofrece una amplia variedad de tipos de datos:

**Tipos de texto:**

- `VARCHAR(n)`: Texto de longitud variable (máximo n caracteres)
- `TEXT`: Texto de longitud variable (hasta 65,535 caracteres)
- `CHAR(n)`: Texto de longitud fija (exactamente n caracteres)
- `LONGTEXT`: Texto de longitud variable (hasta 4GB)

**Tipos numéricos:**

- `INT` o `INTEGER`: Números enteros (32 bits)
- `BIGINT`: Números enteros grandes (64 bits)
- `AUTO_INCREMENT`: Entero auto-incremental (común para IDs)
- `DECIMAL(p, s)`: Números decimales con precisión (p dígitos totales, s decimales)
- `FLOAT`: Números de punto flotante de precisión simple
- `DOUBLE`: Números de punto flotante de doble precisión

**Tipos de fecha y hora:**

- `DATE`: Fecha (año, mes, día)
- `TIME`: Hora (horas, minutos, segundos)
- `DATETIME`: Fecha y hora combinadas
- `TIMESTAMP`: Fecha y hora con zona horaria automática
- `YEAR`: Año (1 o 4 dígitos)

**Tipos booleanos:**

- `BOOLEAN` o `BOOL`: Valores TRUE o FALSE (equivalente a TINYINT(1))

**Tipos especiales:**

- `JSON`: Datos en formato JSON (MySQL 5.7+)
- `ENUM`: Lista de valores predefinidos
- `SET`: Conjunto de valores predefinidos

**Ejemplo de uso de diferentes tipos:**

```sql
CREATE TABLE ejemplo_tipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    edad INT,
    salario DECIMAL(10, 2),
    fecha_nacimiento DATE,
    hora_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN,
    preferencias JSON
);
```

### 📝 Relaciones

Las **relaciones** conectan tablas entre sí mediante claves foráneas, permitiendo modelar conexiones del mundo real entre diferentes entidades. Los tipos principales de relaciones son:

**1. Relación Uno a Uno (1:1):**
Cada registro de una tabla se relaciona con exactamente un registro de otra tabla.

```sql
-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Tabla de perfiles (relación 1:1 con usuarios)
CREATE TABLE perfiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL,
    biografia TEXT,
    foto_url VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

**2. Relación Uno a Muchos (1:N):**
Un registro de una tabla se relaciona con múltiples registros de otra tabla.

```sql
-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de pedidos (relación 1:N: un usuario tiene muchos pedidos)
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

**3. Relación Muchos a Muchos (N:M):**
Múltiples registros de una tabla se relacionan con múltiples registros de otra tabla. Requiere una tabla intermedia.

```sql
-- Tabla de estudiantes
CREATE TABLE estudiantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de cursos
CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla intermedia para relación N:M
CREATE TABLE estudiantes_cursos (
    estudiante_id INT NOT NULL,
    curso_id INT NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (estudiante_id, curso_id),
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
);
```

---

## 🚀 Ejercicio Práctico

### 📝 Crear una Base de Datos con Tablas Relacionadas

**Objetivo:** Crear tu primera base de datos con tablas relacionadas aplicando todos los conceptos aprendidos.

**Pasos a seguir:**

1. **Conectarse a MySQL** (asumiendo que ya tienes el entorno configurado):

```bash
docker exec -it curso_mysql mysql -u root -proot123 curso_backend
```

2. **Crear una tabla de usuarios:**

```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. **Crear una tabla de productos:**

```sql
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE
);
```

4. **Crear una tabla de pedidos (con relación):**

```sql
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

5. **Insertar datos de ejemplo:**

```sql
-- Insertar usuarios
INSERT INTO usuarios (nombre, email)
VALUES
    ('Juan Pérez', 'juan@example.com'),
    ('María García', 'maria@example.com');

-- Insertar productos
INSERT INTO productos (nombre, precio, stock)
VALUES
    ('Laptop', 999.99, 10),
    ('Mouse', 29.99, 50);

-- Insertar pedidos
INSERT INTO pedidos (usuario_id, total)
VALUES
    (1, 1029.98),
    (2, 29.99);
```

6. **Consultar los datos:**

```sql
-- Ver todos los usuarios
SELECT * FROM usuarios;

-- Ver usuarios con sus pedidos
SELECT u.nombre, u.email, p.fecha_pedido, p.total
FROM usuarios u
JOIN pedidos p ON u.id = p.usuario_id;
```

---

## 🏠 Tarea para la Próxima Clase

### ✅ Ejercicio:

Crea una base de datos completa para un sistema de blog con las siguientes características:

1. **Tabla de Autores:**

   - ID (clave primaria, auto-incremental)
   - Nombre completo (texto, obligatorio)
   - Email (texto único, obligatorio)
   - Biografía (texto largo, opcional)
   - Fecha de registro (timestamp con valor por defecto)

2. **Tabla de Categorías:**

   - ID (clave primaria, auto-incremental)
   - Nombre (texto único, obligatorio)
   - Descripción (texto, opcional)

3. **Tabla de Artículos:**

   - ID (clave primaria, auto-incremental)
   - Título (texto, obligatorio)
   - Contenido (texto largo, obligatorio)
   - Fecha de publicación (timestamp)
   - Autor ID (clave foránea a la tabla de autores)
   - Categoría ID (clave foránea a la tabla de categorías)
   - Estado (booleano, por defecto true)

4. **Tabla de Comentarios:**
   - ID (clave primaria, auto-incremental)
   - Contenido (texto, obligatorio)
   - Fecha de comentario (timestamp con valor por defecto)
   - Artículo ID (clave foránea a la tabla de artículos)
   - Nombre del comentarista (texto, obligatorio)
   - Email del comentarista (texto, obligatorio)

**Requisitos técnicos:**

- Crear todas las tablas con sus relaciones apropiadas
- Insertar al menos 3 registros en cada tabla
- Realizar al menos 5 consultas SQL diferentes que incluyan:
  - SELECT simple
  - SELECT con JOIN
  - SELECT con WHERE
  - SELECT con ORDER BY
  - SELECT con COUNT o funciones de agregación
- Documentar las consultas SQL en un archivo `consultas.sql`
- Capturar pantallas de phpMyAdmin mostrando las tablas creadas

---

## 📚 Recursos Adicionales

### 🔗 Enlaces Útiles

- [Documentación oficial de MySQL](https://dev.mysql.com/doc/) - Guía completa de referencia para MySQL
- [Docker Documentation](https://docs.docker.com/) - Documentación oficial de Docker y Docker Compose
- [MySQL Tutorial](https://www.mysqltutorial.org/) - Tutorial interactivo para aprender MySQL
- [SQLBolt](https://sqlbolt.com/) - Ejercicios interactivos para aprender SQL

### 📖 Conceptos para Investigar

- **Índices en bases de datos:** Optimización de consultas mediante índices
- **Transacciones ACID:** Propiedades que garantizan la integridad de los datos
- **Normalización de bases de datos:** Proceso de organizar datos para reducir redundancia
- **Vistas (Views):** Consultas guardadas que actúan como tablas virtuales

---

## ❓ Preguntas Frecuentes

### ¿Cuál es la diferencia entre VARCHAR y TEXT en MySQL?

- **VARCHAR(n):** Tiene un límite máximo de caracteres (n). Es más eficiente cuando conoces el tamaño aproximado del texto. MySQL optimiza el almacenamiento.
- **TEXT:** No tiene límite de longitud fijo (hasta 65,535 caracteres). Es más flexible pero puede ser menos eficiente para textos muy cortos.
- **Recomendación:** Usa VARCHAR cuando sepas el tamaño máximo (ej: email, teléfono). Usa TEXT para contenido variable (ej: descripciones, artículos).

### ¿Qué es una clave foránea y por qué es importante?

- **Clave foránea (Foreign Key):** Es una columna o conjunto de columnas que hace referencia a la clave primaria de otra tabla.
- **Importancia:**
  - Mantiene la integridad referencial: no permite crear registros huérfanos
  - Garantiza que solo existan relaciones válidas entre tablas
  - Facilita las consultas JOIN entre tablas relacionadas
  - Previene errores de datos inconsistentes

**Ejemplo:**

```sql
-- Esto fallará si intentas insertar un pedido con un usuario_id que no existe
INSERT INTO pedidos (usuario_id, total) VALUES (999, 100.00);
-- Error: foreign key constraint violation
```

---

## 🎉 ¡Bases de Datos Dominadas!

¡Excelente trabajo! Ya conoces los conceptos fundamentales de bases de datos relacionales, cómo estructurar datos en tablas, crear relaciones entre ellas, y trabajar con diferentes tipos de datos en MySQL. En la próxima clase profundizaremos en el modelado de datos y aprenderemos a diseñar esquemas de base de datos más complejos.

**Recuerda:** La práctica constante con SQL y el diseño de bases de datos es clave para dominar el desarrollo backend. Experimenta creando diferentes tipos de relaciones y consultas. ¡Sigue practicando! 🚀

---

_📧 **Contacto:** Si tienes dudas sobre bases de datos relacionales o MySQL, no dudes en consultar durante la clase o por los canales de comunicación establecidos._

