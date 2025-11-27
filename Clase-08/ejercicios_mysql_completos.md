# 📚 Ejercicios Completos de MySQL - Sistema de Biblioteca

## 🎯 Objetivo

Este documento contiene ejercicios progresivos para aprender MySQL desde cero, trabajando con un esquema de base de datos de una biblioteca que se irá construyendo y modificando a lo largo de los ejercicios.

---

## 📋 Ejercicio 1: Creación de Tablas

### 🎯 Objetivo del Ejercicio

Crear todas las tablas necesarias para el sistema de gestión de una biblioteca.

### 📝 Descripción

Crea una base de datos llamada `biblioteca` y dentro de ella las siguientes tablas relacionadas:

### ✅ Tareas a Realizar

1. **Crea la base de datos**:

   ```sql
   CREATE DATABASE biblioteca;
   USE biblioteca;
   ```

2. **Crea la tabla `autores`** con los siguientes campos:

   - `id` - INT, PRIMARY KEY, AUTO_INCREMENT
   - `nombre` - VARCHAR(100), NOT NULL
   - `apellido` - VARCHAR(100), NOT NULL
   - `nacionalidad` - VARCHAR(50)
   - `fecha_nacimiento` - DATE
   - `biografia` - TEXT

3. **Crea la tabla `editoriales`** con los siguientes campos:

   - `id` - INT, PRIMARY KEY, AUTO_INCREMENT
   - `nombre` - VARCHAR(150), NOT NULL, UNIQUE
   - `pais` - VARCHAR(50)
   - `direccion` - VARCHAR(255)
   - `telefono` - VARCHAR(20)

4. **Crea la tabla `libros`** con los siguientes campos:

   - `id` - INT, PRIMARY KEY, AUTO_INCREMENT
   - `titulo` - VARCHAR(200), NOT NULL
   - `isbn` - VARCHAR(20), UNIQUE
   - `anio_publicacion` - INT
   - `paginas` - INT
   - `precio` - DECIMAL(10,2)
   - `autor_id` - INT, NOT NULL
   - `editorial_id` - INT, NOT NULL
   - **FOREIGN KEY**: `autor_id` referencia a `autores(id)`
   - **FOREIGN KEY**: `editorial_id` referencia a `editoriales(id)`

5. **Crea la tabla `usuarios`** con los siguientes campos:

   - `id` - INT, PRIMARY KEY, AUTO_INCREMENT
   - `nombre` - VARCHAR(100), NOT NULL
   - `apellido` - VARCHAR(100), NOT NULL
   - `email` - VARCHAR(150), NOT NULL, UNIQUE
   - `telefono` - VARCHAR(20)
   - `fecha_registro` - DATE, NOT NULL
   - `activo` - BOOLEAN, DEFAULT TRUE

6. **Crea la tabla `prestamos`** con los siguientes campos:
   - `id` - INT, PRIMARY KEY, AUTO_INCREMENT
   - `usuario_id` - INT, NOT NULL
   - `libro_id` - INT, NOT NULL
   - `fecha_prestamo` - DATE, NOT NULL
   - `fecha_devolucion_esperada` - DATE, NOT NULL
   - `fecha_devolucion_real` - DATE, NULL
   - `estado` - ENUM('activo', 'devuelto', 'vencido'), DEFAULT 'activo'
   - **FOREIGN KEY**: `usuario_id` referencia a `usuarios(id)`
   - **FOREIGN KEY**: `libro_id` referencia a `libros(id)`

### 🔍 Verificación

- [ ] La base de datos `biblioteca` existe
- [ ] La tabla `autores` existe con todos los campos especificados
- [ ] La tabla `editoriales` existe con todos los campos especificados
- [ ] La tabla `libros` existe con todos los campos y FOREIGN KEYS
- [ ] La tabla `usuarios` existe con todos los campos especificados
- [ ] La tabla `prestamos` existe con todos los campos y FOREIGN KEYS

---

## 📋 Ejercicio 2: Inserción de Datos

### 🎯 Objetivo del Ejercicio

Popular todas las tablas creadas con datos de ejemplo para poder trabajar con ellas en los siguientes ejercicios.

### 📝 Descripción

Inserta datos de ejemplo en todas las tablas del sistema de biblioteca, respetando las relaciones entre ellas.

### ✅ Tareas a Realizar

1. **Inserta datos en la tabla `autores`**:

   ```sql
   INSERT INTO autores (nombre, apellido, nacionalidad, fecha_nacimiento, biografia) VALUES
   ('Gabriel', 'García Márquez', 'Colombiana', '1927-03-06', 'Escritor, novelista, cuentista, guionista y periodista colombiano'),
   ('Mario', 'Vargas Llosa', 'Peruana', '1936-03-28', 'Escritor peruano, uno de los más importantes novelistas y ensayistas de Latinoamérica'),
   ('Isabel', 'Allende', 'Chilena', '1942-08-02', 'Escritora chilena, considerada la novelista más leída en español'),
   ('Julio', 'Cortázar', 'Argentina', '1914-08-26', 'Escritor, traductor e intelectual argentino'),
   ('Jorge Luis', 'Borges', 'Argentina', '1899-08-24', 'Escritor, poeta, ensayista y traductor argentino');
   ```

2. **Inserta datos en la tabla `editoriales`**:

   ```sql
   INSERT INTO editoriales (nombre, pais, direccion, telefono) VALUES
   ('Editorial Sudamericana', 'Argentina', 'Av. Corrientes 1543, Buenos Aires', '+54-11-4371-2000'),
   ('Alfaguara', 'España', 'Calle Torrelaguna 60, Madrid', '+34-91-744-9000'),
   ('Planeta', 'España', 'Av. Diagonal 662-664, Barcelona', '+34-93-228-0800'),
   ('Seix Barral', 'España', 'Calle Provenza 260, Barcelona', '+34-93-496-7000');
   ```

3. **Inserta datos en la tabla `libros`**:

   ```sql
   INSERT INTO libros (titulo, isbn, anio_publicacion, paginas, precio, autor_id, editorial_id) VALUES
   ('Cien años de soledad', '978-84-376-0494-7', 1967, 471, 19.95, 1, 2),
   ('El amor en los tiempos del cólera', '978-84-376-0495-4', 1985, 464, 18.50, 1, 2),
   ('La ciudad y los perros', '978-84-376-0500-5', 1963, 408, 16.90, 2, 3),
   ('La casa de los espíritus', '978-84-376-0501-2', 1982, 499, 20.00, 3, 2),
   ('Rayuela', '978-84-376-0502-9', 1963, 736, 22.50, 4, 1),
   ('Ficciones', '978-84-376-0503-6', 1944, 192, 15.00, 5, 1),
   ('El Aleph', '978-84-376-0504-3', 1949, 180, 14.50, 5, 1),
   ('Crónica de una muerte anunciada', '978-84-376-0505-0', 1981, 120, 12.00, 1, 2);
   ```

4. **Inserta datos en la tabla `usuarios`**:

   ```sql
   INSERT INTO usuarios (nombre, apellido, email, telefono, fecha_registro, activo) VALUES
   ('Ana', 'Martínez', 'ana.martinez@email.com', '555-0101', '2024-01-10', TRUE),
   ('Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '555-0102', '2024-01-15', TRUE),
   ('María', 'González', 'maria.gonzalez@email.com', '555-0103', '2024-02-01', TRUE),
   ('Luis', 'Fernández', 'luis.fernandez@email.com', '555-0104', '2024-02-05', FALSE),
   ('Sofía', 'López', 'sofia.lopez@email.com', '555-0105', '2024-02-10', TRUE);
   ```

5. **Inserta datos en la tabla `prestamos`**:
   ```sql
   INSERT INTO prestamos (usuario_id, libro_id, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, estado) VALUES
   (1, 1, '2024-03-01', '2024-03-15', NULL, 'activo'),
   (1, 3, '2024-03-05', '2024-03-19', '2024-03-18', 'devuelto'),
   (2, 2, '2024-03-10', '2024-03-24', NULL, 'activo'),
   (2, 5, '2024-02-20', '2024-03-06', NULL, 'vencido'),
   (3, 4, '2024-03-12', '2024-03-26', NULL, 'activo'),
   (3, 6, '2024-03-01', '2024-03-15', '2024-03-14', 'devuelto'),
   (5, 7, '2024-03-08', '2024-03-22', NULL, 'activo');
   ```

### 🔍 Verificación

- [ ] Se insertaron correctamente 5 autores
- [ ] Se insertaron correctamente 4 editoriales
- [ ] Se insertaron correctamente 8 libros
- [ ] Se insertaron correctamente 5 usuarios
- [ ] Se insertaron correctamente 7 préstamos
- [ ] Todas las relaciones FOREIGN KEY se respetan correctamente

---

## 📋 Ejercicio 3: Actualización de Datos

### 🎯 Objetivo del Ejercicio

Aprender a actualizar datos específicos en las tablas usando la sentencia UPDATE.

### 📝 Descripción

Realiza actualizaciones en diferentes tablas, modificando datos específicos de filas concretas.

### ✅ Tareas a Realizar

1.  **Actualiza el estado de un préstamo específico**:

    - El préstamo con `id = 1` (usuario Ana Martínez, libro "Cien años de soledad") fue devuelto el día de hoy.
    - Actualiza `fecha_devolucion_real` con la fecha actual y cambia el `estado` a 'devuelto'.

2.  **Actualiza el precio de un libro específico**:

    - El libro "Rayuela" (id = 5) ahora tiene un precio de 24.50 en lugar de 22.50.

3.  **Actualiza la información de un usuario**:

    - El usuario Luis Fernández (id = 4) cambió su teléfono a '555-9999' y ahora está activo.

4.  **Actualiza múltiples registros con una condición**:

    - Todos los préstamos que están en estado 'vencido' deben actualizarse para agregar una multa de 5.00 (necesitarás agregar un campo primero, pero por ahora solo actualiza el estado a 'activo' si se pagó la multa).
    - Primero, marca el préstamo vencido (id = 4) como devuelto con fecha de devolución real de hoy.

5.  **Actualiza la biografía de un autor**:
    - Actualiza la biografía de Gabriel García Márquez (id = 1) para que incluya que ganó el Premio Nobel de Literatura en 1982.
      EJ: biografia = 'Escritor, novelista, cuentista, guionista y periodista colombiano. Ganador del Premio Nobel de Literatura en 1982'

### 🔍 Verificación

- [ ] El préstamo con id = 1 tiene `fecha_devolucion_real` y `estado = 'devuelto'`
- [ ] El libro "Rayuela" tiene precio actualizado a 24.50
- [ ] El usuario Luis Fernández tiene teléfono actualizado y está activo
- [ ] El préstamo vencido fue actualizado correctamente
- [ ] La biografía de García Márquez incluye la información del Nobel

---

## 📋 Ejercicio 4: Modificación de Estructura con ALTER TABLE

### 🎯 Objetivo del Ejercicio

Aprender a modificar la estructura de las tablas existentes usando ALTER TABLE.

### 📝 Descripción

Realiza modificaciones en la estructura de las tablas para agregar campos, modificar tipos de datos, agregar restricciones y crear índices.

### ✅ Tareas a Realizar

1.  **Agrega un campo nuevo a la tabla `libros`**:

    - Agrega un campo `disponible` de tipo BOOLEAN con valor por defecto TRUE para indicar si el libro está disponible para préstamo.

    <details>
    <summary>🔍 Ver Solución</summary>

        ```sql
        ALTER TABLE libros
        ADD COLUMN disponible BOOLEAN DEFAULT TRUE;
        ```

    </details>

2.  **Agrega un campo de multa a la tabla `prestamos`**:

    - Agrega un campo `multa` de tipo DECIMAL(10,2) con valor por defecto 0.00 para registrar multas por retraso.

    <details>
    <summary>🔍 Ver Solución</summary>
    			```sql
    			ALTER TABLE prestamos
    			ADD COLUMN multa DECIMAL(10,2) DEFAULT 0.00;
    			```
    </details>

3.  **Modifica el tipo de dato de un campo existente**:

    - Cambia el campo `telefono` de la tabla `usuarios` de VARCHAR(20) a VARCHAR(30) para permitir números más largos.

4.  **Agrega una restricción UNIQUE**:

    - Agrega una restricción UNIQUE al campo `email` de la tabla `usuarios` (si no existe ya).

    <details>
    <summary>🔍 Ver Solución</summary>

          ```sql
          ALTER TABLE usuarios
          ADD CONSTRAINT unique_email UNIQUE (email);
          ```
        </details>

    _Nota: Si ya existe la restricción UNIQUE, este comando fallará. Verifica primero la estructura de la tabla._

5.  **Agrega un índice para mejorar el rendimiento**:

    - Crea un índice en el campo `fecha_prestamo` de la tabla `prestamos` para acelerar las búsquedas por fecha.
    <details>
    <summary>🔍 Ver Solución</summary>

    ```sql
    CREATE INDEX idx_fecha_prestamo ON prestamos(fecha_prestamo);
    ```

    </details>

6.  **Agrega un campo de fecha de última actualización**:

    - Agrega un campo `fecha_actualizacion` de tipo TIMESTAMP que se actualice automáticamente cuando se modifique un registro en la tabla `libros`.

    <details>
    <summary>🔍 Ver Solución</summary>
    ```sql
    ALTER TABLE libros
    ADD COLUMN fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
    ```
    </details>

7.  **Renombra un campo** (opcional, si tu versión de MySQL lo permite):
    - Si necesitas renombrar el campo `anio_publicacion` a `año_publicacion`, usa:
    <details>
    <summary>🔍 Ver Solución</summary>
    ```sql
    ALTER TABLE libros
    CHANGE COLUMN anio_publicacion año_publicacion INT;
    ```
    </details>

### 🔍 Verificación

- [ ] La tabla `libros` tiene el campo `disponible` con valor por defecto TRUE
- [ ] La tabla `prestamos` tiene el campo `multa` con valor por defecto 0.00
- [ ] El campo `telefono` en `usuarios` ahora acepta hasta 30 caracteres
- [ ] Existe un índice en `fecha_prestamo` de la tabla `prestamos`
- [ ] La tabla `libros` tiene el campo `fecha_actualizacion` con actualización automática

---

## 📋 Ejercicio 5: Consultas Simples

### 🎯 Objetivo del Ejercicio

Realizar consultas SELECT básicas para recuperar y filtrar información de las tablas.

### 📝 Descripción

Ejecuta diferentes tipos de consultas simples usando SELECT, WHERE, ORDER BY, LIMIT y funciones de agregación.

### ✅ Tareas a Realizar

1.  **Consulta todos los registros de una tabla**:

    - Muestra todos los autores ordenados por apellido.

2.  **Consulta con filtro WHERE**:

    - Muestra todos los libros publicados después del año 1980.

3.  **Consulta con múltiples condiciones**:

    - Muestra los usuarios activos que se registraron en febrero de 2024.

     <details>
     <summary>🔍 Ver Solución</summary>
    ```sql
    SELECT nombre, apellido, email, fecha_registro
    FROM usuarios
    WHERE activo = TRUE
      AND fecha_registro >= '2024-02-01'
      AND fecha_registro < '2024-03-01';
    ```
     </details>

4.  **Consulta con ORDER BY y LIMIT**:

    - Muestra los 3 libros más caros ordenados por precio descendente.

5.  **Consulta con funciones de agregación**:

    - Calcula el precio promedio de todos los libros.

     <details>
     <summary>🔍 Ver Solución</summary>
    ```sql
    SELECT AVG(precio) AS precio_promedio
    FROM libros;
    ```
     </details>

6.  **Consulta con COUNT y GROUP BY**:

    - Cuenta cuántos libros tiene cada autor.

     <details>
     <summary>🔍 Ver Solución</summary>
    ```sql
    SELECT a.nombre, a.apellido, COUNT(l.id) AS total_libros
    FROM autores a
    LEFT JOIN libros l ON a.id = l.autor_id
    GROUP BY a.id, a.nombre, a.apellido;
    ```
     </details>

7.  **Consulta con LIKE para búsqueda de texto**:

    - Busca todos los libros cuyo título contenga la palabra "amor" o "ciudad".

     <details>
     <summary>🔍 Ver Solución</summary>
    ```sql
    SELECT titulo, anio_publicacion
    FROM libros
    WHERE titulo LIKE '%amor%' OR titulo LIKE '%ciudad%';
    ```
     </details>

8.  **Consulta con BETWEEN**:

    - Muestra los préstamos realizados entre el 1 de marzo y el 10 de marzo de 2024.

     <details>
     <summary>🔍 Ver Solución</summary>
    ```sql
    SELECT id, usuario_id, libro_id, fecha_prestamo, estado
    FROM prestamos
    WHERE fecha_prestamo BETWEEN '2024-03-01' AND '2024-03-10';
    ```
     </details>

9.  **Consulta con funciones de fecha**:

    - Muestra los préstamos activos y calcula cuántos días han pasado desde la fecha de préstamo.

     <details>
     <summary>🔍 Ver Solución</summary>
    ```sql
    SELECT id,
           fecha_prestamo,
           DATEDIFF(CURDATE(), fecha_prestamo) AS dias_transcurridos
    FROM prestamos
    WHERE estado = 'activo';
    ```
     </details>

10. **Consulta con DISTINCT**:

    - Muestra las nacionalidades únicas de los autores.

    <details>

    <summary>🔍 Ver Solución</summary>

    ```sql
    SELECT DISTINCT nacionalidad
    FROM autores
    WHERE nacionalidad IS NOT NULL;
    ```

    </details>

### 🔍 Verificación

- [ ] Todas las consultas se ejecutan sin errores
- [ ] Los resultados son correctos según los datos insertados
- [ ] Las funciones de agregación funcionan correctamente
- [ ] Los filtros WHERE aplican las condiciones correctamente
- [ ] El ordenamiento ORDER BY funciona como se espera

---

## 📋 Ejercicio 6: Consultas con JOIN

### 🎯 Objetivo del Ejercicio

Aprender a realizar consultas que combinen datos de múltiples tablas usando diferentes tipos de JOIN.

### 📝 Descripción

Realiza consultas que relacionen datos de varias tablas usando INNER JOIN, LEFT JOIN, RIGHT JOIN y combinaciones de múltiples JOINs.

### ✅ Tareas a Realizar

1. **INNER JOIN básico**:

   - Muestra todos los libros con el nombre completo de su autor y el nombre de la editorial.

    <details>
    <summary>🔍 Ver Solución</summary>
   ```sql
   SELECT l.titulo,
          CONCAT(a.nombre, ' ', a.apellido) AS autor,
          e.nombre AS editorial,
          l.precio
   FROM libros l
   INNER JOIN autores a ON l.autor_id = a.id
   INNER JOIN editoriales e ON l.editorial_id = e.id;
   ```
    </details>

2. **LEFT JOIN para incluir todos los registros**:

   - Muestra todos los autores y cuántos libros tiene cada uno (incluyendo autores sin libros).

    <details>
    <summary>🔍 Ver Solución</summary>
   ```sql
   SELECT a.nombre,
          a.apellido,
          COUNT(l.id) AS total_libros
   FROM autores a
   LEFT JOIN libros l ON a.id = l.autor_id
   GROUP BY a.id, a.nombre, a.apellido;
   ```
    </details>

3. **JOIN con condiciones adicionales**:

   - Muestra los préstamos activos con información del usuario y del libro prestado.

    <details>
    <summary>🔍 Ver Solución</summary>
   ```sql
   SELECT p.id AS prestamo_id,
          CONCAT(u.nombre, ' ', u.apellido) AS usuario,
          l.titulo AS libro,
          p.fecha_prestamo,
          p.fecha_devolucion_esperada
   FROM prestamos p
   INNER JOIN usuarios u ON p.usuario_id = u.id
   INNER JOIN libros l ON p.libro_id = l.id
   WHERE p.estado = 'activo';
   ```
    </details>

4. **Múltiples JOINs con filtros**:

   - Muestra los préstamos devueltos con información completa: usuario, libro, autor y editorial.

    <details>
    <summary>🔍 Ver Solución</summary>
   ```sql
   SELECT CONCAT(u.nombre, ' ', u.apellido) AS usuario,
          l.titulo AS libro,
          CONCAT(a.nombre, ' ', a.apellido) AS autor,
          e.nombre AS editorial,
          p.fecha_prestamo,
          p.fecha_devolucion_real
   FROM prestamos p
   INNER JOIN usuarios u ON p.usuario_id = u.id
   INNER JOIN libros l ON p.libro_id = l.id
   INNER JOIN autores a ON l.autor_id = a.id
   INNER JOIN editoriales e ON l.editorial_id = e.id
   WHERE p.estado = 'devuelto';
   ```
    </details>

5. **JOIN con funciones de agregación**:

   - Muestra cada usuario con el total de préstamos que ha realizado y el total de multas pagadas.

    <details>
    <summary>🔍 Ver Solución</summary>
   ```sql
   SELECT CONCAT(u.nombre, ' ', u.apellido) AS usuario,
          COUNT(p.id) AS total_prestamos,
          SUM(COALESCE(p.multa, 0)) AS total_multas
   FROM usuarios u
   LEFT JOIN prestamos p ON u.id = p.usuario_id
   GROUP BY u.id, u.nombre, u.apellido;
   ```
    </details>

6. **JOIN para encontrar datos relacionados**:

   - Muestra todos los libros que nunca han sido prestados.

    <details>
    <summary>🔍 Ver Solución</summary>
   ```sql
   SELECT l.titulo,
          CONCAT(a.nombre, ' ', a.apellido) AS autor
   FROM libros l
   INNER JOIN autores a ON l.autor_id = a.id
   LEFT JOIN prestamos p ON l.id = p.libro_id
   WHERE p.id IS NULL;
   ```
    </details>

7. **JOIN con subconsulta**:

   - Muestra los usuarios que tienen préstamos vencidos con información del libro.

    <details>
    <summary>🔍 Ver Solución</summary>
   ```sql
   SELECT CONCAT(u.nombre, ' ', u.apellido) AS usuario,
          u.email,
          l.titulo AS libro,
          p.fecha_prestamo,
          p.fecha_devolucion_esperada,
          DATEDIFF(CURDATE(), p.fecha_devolucion_esperada) AS dias_vencido
   FROM prestamos p
   INNER JOIN usuarios u ON p.usuario_id = u.id
   INNER JOIN libros l ON p.libro_id = l.id
   WHERE p.estado = 'vencido';
   ```
    </details>

8. **SELF JOIN (opcional - si agregas una tabla de categorías con jerarquía)**:

   - Si tuvieras una tabla de categorías con categorías padre e hijo, podrías hacer un self join. Por ahora, muestra los autores que tienen más de un libro.

   <details>
   <summary>🔍 Ver Solución</summary>
    ```sql
    SELECT a1.nombre,
           a1.apellido,
           COUNT(l.id) AS cantidad_libros
    FROM autores a1
    INNER JOIN libros l ON a1.id = l.autor_id
    GROUP BY a1.id, a1.nombre, a1.apellido
    HAVING COUNT(l.id) > 1;
    ```
   </details>

### 🔍 Verificación

- [ ] El INNER JOIN muestra solo los registros que tienen coincidencias en ambas tablas
- [ ] El LEFT JOIN incluye todos los registros de la tabla izquierda
- [ ] Las consultas con múltiples JOINs combinan correctamente los datos
- [ ] Los filtros WHERE funcionan correctamente con los JOINs
- [ ] Las funciones de agregación con GROUP BY funcionan con los JOINs

---

## 📋 Ejercicio 7: Eliminación de Datos y Problemas de Integridad Referencial

### 🎯 Objetivo del Ejercicio

Entender los problemas que surgen al eliminar registros que tienen relaciones con otras tablas y aprender a manejar la integridad referencial.

### 📝 Descripción

Intenta eliminar registros principales y observa qué sucede con los datos relacionados. Luego, aprende a manejar estas situaciones correctamente.

### ✅ Tareas a Realizar

1. **Intenta eliminar un autor que tiene libros asociados**:

   - Intenta eliminar el autor con `id = 1` (Gabriel García Márquez) que tiene libros en la tabla `libros`.

   ```sql
   DELETE FROM autores WHERE id = 1;
   ```

   - **¿Qué sucede?** Anota el error que recibes. Esto ocurre porque hay registros en la tabla `libros` que referencian este autor mediante la FOREIGN KEY.

2. **Consulta los datos relacionados antes de eliminar**:

   - Antes de eliminar, siempre verifica qué datos están relacionados. Muestra todos los libros del autor con id = 1.

   ```sql
   SELECT l.id, l.titulo, l.isbn
   FROM libros l
   WHERE l.autor_id = 1;
   ```

3. **Elimina primero los datos relacionados (método manual)**:

   - Para eliminar el autor, primero debes eliminar o actualizar todos los libros que lo referencian.
   - **Opción A**: Eliminar los libros del autor:
     ```sql
     DELETE FROM libros WHERE autor_id = 1;
     DELETE FROM autores WHERE id = 1;
     ```
   - **Opción B**: Actualizar los libros para asignarlos a otro autor (si tiene sentido en tu negocio):
     ```sql
     UPDATE libros SET autor_id = 2 WHERE autor_id = 1;
     DELETE FROM autores WHERE id = 1;
     ```
   - **⚠️ IMPORTANTE**: Si los libros tienen préstamos asociados, también debes manejar esos. Verifica primero:
     ```sql
     SELECT p.id, l.titulo
     FROM prestamos p
     INNER JOIN libros l ON p.libro_id = l.id
     WHERE l.autor_id = 1;
     ```

4. **Intenta eliminar un usuario con préstamos activos**:

   - Intenta eliminar el usuario con `id = 1` (Ana Martínez) que tiene préstamos asociados.

   ```sql
   DELETE FROM usuarios WHERE id = 1;
   ```

   - **¿Qué sucede?** Anota el error. Esto ocurre porque hay registros en `prestamos` que referencian este usuario.

5. **Maneja la eliminación de usuario con préstamos**:

   - Para eliminar un usuario, primero debes manejar sus préstamos. Tienes varias opciones:
   - **Opción A**: Marcar los préstamos como devueltos y luego eliminar:

     ```sql
     UPDATE prestamos
     SET estado = 'devuelto',
         fecha_devolucion_real = CURDATE()
     WHERE usuario_id = 1 AND estado = 'activo';

     DELETE FROM usuarios WHERE id = 1;
     ```

   - **Opción B**: Eliminar todos los préstamos del usuario (si no necesitas el historial):
     ```sql
     DELETE FROM prestamos WHERE usuario_id = 1;
     DELETE FROM usuarios WHERE id = 1;
     ```

6. **Elimina un libro que no tiene préstamos**:

   - Primero verifica qué libros no tienen préstamos asociados:

   ```sql
   SELECT l.id, l.titulo
   FROM libros l
   LEFT JOIN prestamos p ON l.id = p.libro_id
   WHERE p.id IS NULL;
   ```

   - Luego elimina uno de estos libros (por ejemplo, el que tenga el id más bajo de los que no tienen préstamos):

   ```sql
   DELETE FROM libros WHERE id = (SELECT MIN(l2.id)
                                   FROM libros l2
                                   LEFT JOIN prestamos p2 ON l2.id = p2.libro_id
                                   WHERE p2.id IS NULL);
   ```

7. **Problema real: Eliminación en cascada**:

   - **Reflexión**: ¿Qué pasaría si eliminas un préstamo? Los préstamos no tienen datos dependientes, así que se puede eliminar sin problemas.
   - Intenta eliminar un préstamo devuelto:

   ```sql
   DELETE FROM prestamos WHERE id = 2 AND estado = 'devuelto';
   ```

8. **Solución profesional: Usar ON DELETE CASCADE o ON DELETE SET NULL**:

   - Para evitar estos problemas en el futuro, puedes modificar las FOREIGN KEYS para que eliminen o actualicen automáticamente los registros relacionados.
   - **Ejemplo de cómo se haría** (solo para aprendizaje, no lo ejecutes si no quieres cambiar la estructura):

     ```sql
     -- Primero eliminar la foreign key existente
     ALTER TABLE libros
     DROP FOREIGN KEY libros_ibfk_1;  -- El nombre puede variar

     -- Crear la foreign key con ON DELETE CASCADE
     ALTER TABLE libros
     ADD CONSTRAINT libros_autor_fk
     FOREIGN KEY (autor_id) REFERENCES autores(id)
     ON DELETE CASCADE;
     ```

   - **⚠️ ADVERTENCIA**: ON DELETE CASCADE eliminará automáticamente todos los libros si eliminas un autor. Úsalo con precaución.

### 🔍 Verificación y Reflexión

- [ ] ¿Qué error recibiste al intentar eliminar el autor con libros asociados?
- [ ] ¿Qué error recibiste al intentar eliminar el usuario con préstamos?
- [ ] ¿Entiendes por qué ocurren estos errores?
- [ ] ¿Qué estrategia usarías en un sistema real para manejar estas eliminaciones?
- [ ] ¿Cuándo sería apropiado usar ON DELETE CASCADE?
- [ ] ¿Cuándo sería mejor usar ON DELETE SET NULL?

### 📝 Notas Importantes sobre Integridad Referencial

1. **Las FOREIGN KEYS protegen la integridad de los datos**: Evitan que elimines registros que son referenciados por otras tablas.

2. **Estrategias para manejar eliminaciones**:

   - **Eliminación manual**: Eliminar o actualizar primero los registros relacionados
   - **ON DELETE CASCADE**: Elimina automáticamente los registros relacionados (peligroso)
   - **ON DELETE SET NULL**: Establece NULL en la foreign key (requiere que el campo permita NULL)
   - **Soft Delete**: Marcar registros como "eliminados" en lugar de borrarlos realmente (usar un campo `eliminado` BOOLEAN)

3. **En sistemas de producción**: Siempre verifica las relaciones antes de eliminar y considera usar transacciones para asegurar que todas las operaciones se completen o se reviertan.

---

## 🎓 Resumen de Conceptos Aprendidos

### ✅ Conceptos Cubiertos

1. **DDL (Data Definition Language)**:

   - CREATE DATABASE, CREATE TABLE
   - ALTER TABLE (ADD, MODIFY, DROP)
   - FOREIGN KEYS y restricciones
   - Índices

2. **DML (Data Manipulation Language)**:

   - INSERT para agregar datos
   - UPDATE para modificar datos
   - DELETE para eliminar datos
   - SELECT para consultar datos

3. **Consultas**:

   - SELECT básico con WHERE, ORDER BY, LIMIT
   - Funciones de agregación (COUNT, SUM, AVG)
   - GROUP BY y HAVING
   - JOINs (INNER, LEFT, RIGHT)
   - Funciones de fecha y texto

4. **Integridad Referencial**:
   - FOREIGN KEYS
   - Problemas al eliminar registros relacionados
   - Estrategias para manejar eliminaciones

### 💡 Buenas Prácticas

1. **Siempre verifica relaciones antes de eliminar**
2. **Usa transacciones para operaciones complejas**
3. **Crea índices en campos usados frecuentemente en WHERE y JOIN**
4. **Usa nombres descriptivos para tablas y campos**
5. **Documenta tus esquemas de base de datos**
6. **Haz backups antes de operaciones destructivas**

---

## ✅ Checklist Final

- [ ] Ejercicio 1: Creación de todas las tablas
- [ ] Ejercicio 2: Inserción de datos en todas las tablas
- [ ] Ejercicio 3: Actualización de datos específicos
- [ ] Ejercicio 4: Modificación de estructura con ALTER TABLE
- [ ] Ejercicio 5: Consultas simples con SELECT
- [ ] Ejercicio 6: Consultas con JOIN
- [ ] Ejercicio 7: Eliminación de datos y problemas de integridad referencial

¡Felicidades! 🎉 Has completado todos los ejercicios y ahora tienes una comprensión sólida de las operaciones fundamentales de MySQL.
