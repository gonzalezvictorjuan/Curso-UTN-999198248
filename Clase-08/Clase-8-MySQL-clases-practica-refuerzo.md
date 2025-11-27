# 📖 Clase 8: MySQL - Clases Práctica - Refuerzo

## 🎯 Objetivos de la Clase

- Comprender el concepto de llaves foráneas y su importancia en la integridad referencial de las bases de datos relacionales
- Aprender a definir y gestionar llaves foráneas en phpMyAdmin con diferentes opciones de configuración
- Dominar el uso de las opciones ON DELETE y ON UPDATE para controlar el comportamiento de las relaciones entre tablas
- Aplicar consultas avanzadas utilizando JOIN para combinar información de múltiples tablas
- Implementar subconsultas y UNION para realizar búsquedas más específicas y unificar resultados de diferentes consultas

---

## 📚 ¿Qué son las Llaves Foráneas?

### 🔍 Definición

**Las llaves foráneas (Foreign Keys)** son columnas o conjuntos de columnas en una tabla que hacen referencia a la llave primaria (Primary Key) de otra tabla. Estas llaves establecen vínculos entre tablas, garantizando la integridad referencial y facilitando la recuperación de datos mediante consultas más estructuradas y eficientes.

### 🏗️ Características Principales

- **Integridad referencial:** Garantizan que los datos referenciados existan en la tabla relacionada
- **Relaciones entre tablas:** Establecen vínculos lógicos entre diferentes entidades de la base de datos
- **Consistencia de datos:** Previenen la inserción de registros huérfanos o referencias inválidas
- **Facilitan consultas complejas:** Permiten combinar información de múltiples tablas mediante JOIN

### 📖 Historia Breve

- **1970:** Edgar F. Codd introduce el concepto de integridad referencial en el modelo relacional
- **1980s:** Los sistemas de gestión de bases de datos comienzan a implementar soporte para llaves foráneas
- **1990s:** Se estandarizan las opciones ON DELETE y ON UPDATE en SQL
- **2000s:** Los motores de bases de datos mejoran el rendimiento de las validaciones de integridad referencial
- **Actualidad:** Las llaves foráneas son fundamentales en el diseño de bases de datos relacionales modernas

---

## 🏛️ Llaves Foráneas Básicas

### 📝 Definición de Llaves Foráneas

Una llave foránea establece una relación entre dos tablas. La tabla que contiene la llave foránea se denomina "tabla hija" o "tabla referenciadora", mientras que la tabla referenciada se llama "tabla padre" o "tabla referenciada".

**Sintaxis básica:**

```sql
CREATE TABLE tabla_hija (
    id INT PRIMARY KEY AUTO_INCREMENT,
    columna_datos VARCHAR(100),
    tabla_padre_id INT,
    FOREIGN KEY (tabla_padre_id) REFERENCES tabla_padre(id)
);
```

### 📝 Crear Llaves Foráneas en phpMyAdmin

**Pasos para crear una llave foránea en phpMyAdmin:**

1. Seleccionar la tabla que contendrá la llave foránea
2. Ir a la pestaña "Estructura"
3. Hacer clic en "Índices" o "Relaciones"
4. Configurar:
   - **Nombre del índice:** Nombre descriptivo para la relación
   - **Columna:** Seleccionar la columna que será la llave foránea
   - **Tabla referenciada:** Seleccionar la tabla padre
   - **Columna referenciada:** Seleccionar la columna de la tabla padre (generalmente el ID)

```sql
-- Ejemplo: Tabla de pedidos que referencia a clientes
CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT,
    fecha_pedido DATE,
    total DECIMAL(10, 2),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
```

### 📝 Tipos de Relaciones

**Relación Uno a Muchos (1:N):**

- Un registro de la tabla padre puede tener múltiples registros en la tabla hija
- Ejemplo: Un cliente puede tener múltiples pedidos

```sql
-- Tabla padre: clientes
CREATE TABLE clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    email VARCHAR(100)
);

-- Tabla hija: pedidos
CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT,
    fecha DATE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
```

**Relación Muchos a Muchos (N:M):**

- Requiere una tabla intermedia (tabla de unión)
- Ejemplo: Estudiantes y Cursos

```sql
-- Tabla intermedia
CREATE TABLE estudiantes_cursos (
    estudiante_id INT,
    curso_id INT,
    PRIMARY KEY (estudiante_id, curso_id),
    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
);
```

### 🛠️ Scripts de Datos para Clientes y Pedidos

Para probar rápidamente la relación entre `clientes` y `pedidos`, usa los siguientes scripts que incluyen inserciones, actualizaciones y eliminaciones controladas.

```sql
-- Insertar clientes
INSERT INTO clientes (nombre, email) VALUES
('Ana Torres', 'ana.torres@example.com'),
('Luis Ríos', 'luis.rios@example.com'),
('Paula Díaz', 'paula.diaz@example.com');

-- Insertar pedidos vinculados a los clientes anteriores
INSERT INTO pedidos (cliente_id, fecha, total) VALUES
(1, '2025-11-15', 1200.50),
(1, '2025-11-20', 850.00),
(2, '2025-11-18', 640.75);

-- Actualizar el total de un pedido existente
UPDATE pedidos
SET total = total + 100
WHERE id = 2;

-- Reasignar un pedido a otro cliente (por ejemplo, cliente 3)
UPDATE pedidos
SET cliente_id = 3
WHERE id = 3;

-- Eliminar un pedido específico
DELETE FROM pedidos
WHERE id = 1;

-- Intentar eliminar un cliente con pedidos asociados (fallará si la FK es RESTRICT)
DELETE FROM clientes
WHERE id = 2;
```

📝 **Tip:** Ajusta el comportamiento de `ON DELETE` según tu necesidad. Si estableces `ON DELETE CASCADE`, la eliminación del cliente 2 también borrará sus pedidos automáticamente.

---

## 🏗️ Opciones ON DELETE y ON UPDATE

### 📄 ON DELETE

La opción **ON DELETE** define qué sucede cuando se intenta eliminar un registro de la tabla padre.

**Opciones disponibles:**

- **CASCADE:** Elimina automáticamente los registros relacionados en la tabla hija
- **SET NULL:** Establece el valor de la llave foránea como NULL en los registros relacionados
- **RESTRICT / NO ACTION:** Previene la eliminación si existen registros relacionados
- **SET DEFAULT:** Establece el valor por defecto en la columna de la llave foránea

```sql
-- Ejemplo con CASCADE
CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT,
    fecha DATE,
    FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
        ON DELETE CASCADE
);

-- Si eliminamos un cliente, se eliminan automáticamente sus pedidos
DELETE FROM clientes WHERE id = 1; -- Elimina también los pedidos del cliente 1
```

```sql
-- Ejemplo con SET NULL
CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT,
    fecha DATE,
    FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
        ON DELETE SET NULL
);

-- Si eliminamos un cliente, los pedidos quedan con cliente_id = NULL
DELETE FROM clientes WHERE id = 1; -- Los pedidos del cliente 1 quedan sin cliente asignado
```

```sql
-- Ejemplo con RESTRICT (comportamiento por defecto)
CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT,
    fecha DATE,
    FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
        ON DELETE RESTRICT
);

-- No permite eliminar un cliente si tiene pedidos asociados
DELETE FROM clientes WHERE id = 1; -- Error si el cliente tiene pedidos
```

### 📄 ON UPDATE

La opción **ON UPDATE** define qué sucede cuando se modifica la llave primaria de la tabla padre.

**Opciones disponibles:**

- **CASCADE:** Actualiza automáticamente las llaves foráneas en la tabla hija
- **SET NULL:** Establece el valor de la llave foránea como NULL
- **RESTRICT / NO ACTION:** Previene la actualización si existen registros relacionados
- **SET DEFAULT:** Establece el valor por defecto

```sql
-- Ejemplo con CASCADE
CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT,
    fecha DATE,
    FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
        ON UPDATE CASCADE
);

-- Si cambiamos el ID de un cliente, se actualiza automáticamente en los pedidos
UPDATE clientes SET id = 100 WHERE id = 1; -- Los pedidos ahora referencian el ID 100
```

### 🧱 Ejemplos de ALTER TABLE sobre Clientes y Pedidos

Cuando el modelo evoluciona, podemos usar `ALTER TABLE` para agregar columnas, restricciones o índices sin recrear las tablas.

```sql
-- Agregar una columna de teléfono a clientes
ALTER TABLE clientes
ADD COLUMN telefono VARCHAR(20) AFTER email;

-- Incorporar una restricción UNIQUE sobre el email
ALTER TABLE clientes
ADD CONSTRAINT uq_clientes_email UNIQUE (email);

-- Añadir una columna de estado al pedido con valor por defecto
ALTER TABLE pedidos
ADD COLUMN estado ENUM('Pendiente', 'Pagado', 'Cancelado') DEFAULT 'Pendiente';

-- Crear un índice para acelerar búsquedas por fecha
ALTER TABLE pedidos
ADD INDEX idx_pedidos_fecha (fecha);

-- Modificar la llave foránea para aplicar ON DELETE CASCADE y ON UPDATE CASCADE
ALTER TABLE pedidos
DROP FOREIGN KEY pedidos_ibfk_1,
ADD CONSTRAINT fk_pedidos_clientes
    FOREIGN KEY (cliente_id)
    REFERENCES clientes(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
```

⚠️ **Importante:** Antes de modificar llaves foráneas, asegúrate de conocer el nombre actual de la restricción (por ejemplo, usando `SHOW CREATE TABLE pedidos;`) y valida que los cambios reflejen la lógica del negocio.

---

## 🏗️ Consultas Avanzadas con SQL

### 📄 INNER JOIN

**INNER JOIN** devuelve solo los registros que tienen coincidencias en ambas tablas.

```sql
-- Obtener pedidos con información del cliente
SELECT
    p.id AS pedido_id,
    p.fecha,
    p.total,
    c.nombre AS cliente_nombre,
    c.email
FROM pedidos p
INNER JOIN clientes c ON p.cliente_id = c.id;
```

### 📄 LEFT JOIN

**LEFT JOIN** devuelve todos los registros de la tabla izquierda y los coincidentes de la tabla derecha. Si no hay coincidencia, los valores de la tabla derecha serán NULL.

```sql
-- Obtener todos los clientes y sus pedidos (incluso si no tienen pedidos)
SELECT
    c.id AS cliente_id,
    c.nombre,
    p.id AS pedido_id,
    p.fecha,
    p.total
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.cliente_id;
```

### 📄 RIGHT JOIN

**RIGHT JOIN** devuelve todos los registros de la tabla derecha y los coincidentes de la tabla izquierda.

```sql
-- Obtener todos los pedidos y sus clientes (incluso si el cliente fue eliminado)
SELECT
    p.id AS pedido_id,
    p.fecha,
    p.total,
    c.nombre AS cliente_nombre
FROM pedidos p
RIGHT JOIN clientes c ON p.cliente_id = c.id;
```

### 📄 Subconsultas

Las **subconsultas** son consultas anidadas dentro de otra consulta. Pueden usarse en SELECT, FROM, WHERE, etc.

```sql
-- Obtener clientes que han realizado pedidos
SELECT nombre, email
FROM clientes
WHERE id IN (
    SELECT DISTINCT cliente_id
    FROM pedidos
);
```

```sql
-- Obtener el pedido más reciente de cada cliente
SELECT
    c.nombre,
    p.fecha,
    p.total
FROM clientes c
INNER JOIN pedidos p ON c.id = p.cliente_id
WHERE p.fecha = (
    SELECT MAX(fecha)
    FROM pedidos
    WHERE cliente_id = c.id
);
```

### 📄 UNION

**UNION** combina los resultados de dos o más consultas SELECT, eliminando duplicados.

```sql
-- Combinar nombres de clientes y proveedores
SELECT nombre, 'Cliente' AS tipo FROM clientes
UNION
SELECT nombre, 'Proveedor' AS tipo FROM proveedores;
```

**UNION ALL** mantiene todos los registros, incluyendo duplicados:

```sql
-- Combinar todos los nombres sin eliminar duplicados
SELECT nombre FROM clientes
UNION ALL
SELECT nombre FROM proveedores;
```

---

## 🚀 Ejercicio Práctico: Base de Datos de Empresa de Transportes

### 📝 Sistema de Gestión de Transportes

Vamos a crear una base de datos completa para una empresa de transportes que incluya vehículos, conductores, rutas y viajes.

**Estructura de la base de datos:**

```sql
-- Tabla de conductores
CREATE TABLE conductores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    licencia VARCHAR(50) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_contratacion DATE
);

-- Tabla de vehículos
CREATE TABLE vehiculos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patente VARCHAR(10) UNIQUE NOT NULL,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    año INT,
    capacidad_carga DECIMAL(10, 2),
    estado ENUM('Disponible', 'En viaje', 'Mantenimiento') DEFAULT 'Disponible'
);

-- Tabla de rutas
CREATE TABLE rutas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    origen VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    distancia_km DECIMAL(10, 2),
    tiempo_estimado_horas DECIMAL(5, 2)
);

-- Tabla de viajes
CREATE TABLE viajes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    conductor_id INT NOT NULL,
    vehiculo_id INT NOT NULL,
    ruta_id INT NOT NULL,
    fecha_salida DATETIME NOT NULL,
    fecha_llegada DATETIME,
    carga_transportada DECIMAL(10, 2),
    estado ENUM('Programado', 'En curso', 'Completado', 'Cancelado') DEFAULT 'Programado',
    FOREIGN KEY (conductor_id) REFERENCES conductores(id) ON DELETE RESTRICT,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE RESTRICT,
    FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE RESTRICT
);

-- Tabla de mantenimientos
CREATE TABLE mantenimientos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehiculo_id INT NOT NULL,
    fecha DATE NOT NULL,
    tipo ENUM('Preventivo', 'Correctivo', 'Revisión') NOT NULL,
    costo DECIMAL(10, 2),
    descripcion TEXT,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE
);
```

**Datos de ejemplo:**

```sql
-- Insertar conductores
INSERT INTO conductores (nombre, licencia, telefono, fecha_contratacion) VALUES
('Juan Pérez', 'LIC001', '555-0101', '2020-01-15'),
('María García', 'LIC002', '555-0102', '2021-03-20'),
('Carlos López', 'LIC003', '555-0103', '2019-11-10');

-- Insertar vehículos
INSERT INTO vehiculos (patente, marca, modelo, año, capacidad_carga, estado) VALUES
('ABC123', 'Mercedes-Benz', 'Actros', 2020, 20000.00, 'Disponible'),
('XYZ789', 'Volvo', 'FH16', 2021, 25000.00, 'Disponible'),
('DEF456', 'Scania', 'R450', 2019, 18000.00, 'Mantenimiento');

-- Insertar rutas
INSERT INTO rutas (origen, destino, distancia_km, tiempo_estimado_horas) VALUES
('Buenos Aires', 'Córdoba', 700.00, 8.5),
('Buenos Aires', 'Rosario', 300.00, 4.0),
('Córdoba', 'Mendoza', 600.00, 7.0);

-- Insertar viajes
INSERT INTO viajes (conductor_id, vehiculo_id, ruta_id, fecha_salida, carga_transportada, estado) VALUES
(1, 1, 1, '2025-11-28 08:00:00', 15000.00, 'Programado'),
(2, 2, 2, '2025-11-27 10:00:00', 20000.00, 'En curso'),
(1, 1, 3, '2025-11-25 06:00:00', 12000.00, 'Completado');
```

**Consultas avanzadas:**

```sql
-- 1. Obtener todos los viajes con información completa
SELECT
    v.id AS viaje_id,
    c.nombre AS conductor,
    ve.patente AS vehiculo,
    r.origen,
    r.destino,
    v.fecha_salida,
    v.estado
FROM viajes v
INNER JOIN conductores c ON v.conductor_id = c.id
INNER JOIN vehiculos ve ON v.vehiculo_id = ve.id
INNER JOIN rutas r ON v.ruta_id = r.id
ORDER BY v.fecha_salida DESC;

-- 2. Obtener conductores y sus viajes (incluso si no tienen viajes)
SELECT
    c.nombre,
    c.licencia,
    COUNT(v.id) AS total_viajes
FROM conductores c
LEFT JOIN viajes v ON c.id = v.conductor_id
GROUP BY c.id, c.nombre, c.licencia;

-- 3. Obtener vehículos con su historial de mantenimientos
SELECT
    ve.patente,
    ve.marca,
    ve.modelo,
    m.fecha AS fecha_mantenimiento,
    m.tipo,
    m.costo
FROM vehiculos ve
LEFT JOIN mantenimientos m ON ve.id = m.vehiculo_id
ORDER BY ve.patente, m.fecha DESC;

-- 4. Obtener viajes completados con información detallada usando subconsulta
SELECT
    v.id,
    c.nombre AS conductor,
    r.origen,
    r.destino,
    v.carga_transportada,
    v.fecha_salida,
    v.fecha_llegada
FROM viajes v
INNER JOIN conductores c ON v.conductor_id = c.id
INNER JOIN rutas r ON v.ruta_id = r.id
WHERE v.estado = 'Completado'
    AND v.carga_transportada > (
        SELECT AVG(carga_transportada)
        FROM viajes
        WHERE estado = 'Completado'
    );

-- 5. Combinar información de vehículos disponibles y en mantenimiento
SELECT
    patente,
    marca,
    modelo,
    estado,
    'Vehículo' AS tipo
FROM vehiculos
WHERE estado = 'Disponible'
UNION
SELECT
    patente,
    marca,
    modelo,
    estado,
    'Vehículo' AS tipo
FROM vehiculos
WHERE estado = 'Mantenimiento';
```

---

## 🏠 Tarea para la Próxima Clase

### ✅ Ejercicio: Ampliar la Base de Datos de Transportes

Amplía la base de datos de la empresa de transportes con las siguientes funcionalidades:

1. **Crear tabla de clientes** con campos: id, nombre, dirección, teléfono, email
2. **Crear tabla de cargas** con campos: id, cliente_id (FK), descripción, peso, volumen, estado
3. **Modificar tabla de viajes** para incluir carga_id (FK) que referencie a la tabla cargas
4. **Crear tabla de facturación** con campos: id, viaje_id (FK), cliente_id (FK), monto, fecha_facturacion, estado_pago
5. **Implementar relaciones** con las opciones ON DELETE y ON UPDATE apropiadas según la lógica de negocio
6. **Crear 5 consultas avanzadas** que utilicen JOIN, subconsultas o UNION para obtener información relevante del negocio
7. **Documentar las decisiones** sobre las opciones ON DELETE/ON UPDATE elegidas y justificar por qué son las más adecuadas

**Requisitos técnicos:**

- Todas las tablas deben tener llaves primarias autoincrementales
- Implementar al menos 3 tipos diferentes de JOIN (INNER, LEFT, RIGHT)
- Incluir al menos 2 subconsultas en las consultas avanzadas
- Usar UNION o UNION ALL en al menos una consulta
- Insertar datos de ejemplo para probar todas las relaciones
- Exportar el script SQL completo con todas las tablas, relaciones y consultas

---

## 📚 Recursos Adicionales

### 🔗 Enlaces Útiles

- [MySQL Foreign Keys Documentation](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html) - Documentación oficial de MySQL sobre llaves foráneas
- [SQL JOIN Types Explained](https://www.w3schools.com/sql/sql_join.asp) - Guía completa sobre los diferentes tipos de JOIN en SQL
- [phpMyAdmin User Guide](https://docs.phpmyadmin.net/en/latest/) - Documentación oficial de phpMyAdmin
- [MySQL Subqueries Tutorial](https://www.mysqltutorial.org/mysql-subquery/) - Tutorial completo sobre subconsultas en MySQL

### 📖 Conceptos para Investigar

- **Índices en bases de datos:** Cómo mejorar el rendimiento de las consultas con índices
- **Normalización de bases de datos:** Reglas para organizar datos y evitar redundancias
- **Vistas (Views) en SQL:** Crear consultas reutilizables como objetos de base de datos
- **Transacciones SQL:** Garantizar la integridad de operaciones múltiples con COMMIT y ROLLBACK

---

## ❓ Preguntas Frecuentes

### ¿Cuál es la diferencia entre ON DELETE CASCADE y ON DELETE RESTRICT?

- **ON DELETE CASCADE:** Elimina automáticamente los registros relacionados cuando se elimina el registro padre. Útil cuando la relación es de dependencia total (ej: si eliminas un cliente, sus pedidos también deben eliminarse)
- **ON DELETE RESTRICT:** Previene la eliminación del registro padre si existen registros relacionados. Útil para proteger datos importantes (ej: no permitir eliminar un cliente si tiene pedidos pendientes)
- **Cuándo usar cada una:** CASCADE para relaciones donde los datos hijos no tienen sentido sin el padre. RESTRICT para proteger la integridad de datos críticos

### ¿Qué es mejor: usar JOIN o subconsultas?

- **JOIN:** Generalmente más eficiente para combinar datos de múltiples tablas, especialmente con índices apropiados. Más legible cuando necesitas columnas de múltiples tablas
- **Subconsultas:** Útiles para filtros complejos, cálculos agregados o cuando necesitas comparar valores. Pueden ser más claras para lógica condicional compleja
- **Recomendación:** Usa JOIN para combinar tablas y subconsultas para filtros o cálculos específicos. En muchos casos, puedes lograr lo mismo con ambas, pero JOIN suele ser más eficiente

### ¿Puedo tener múltiples llaves foráneas en una misma tabla?

- **Sí, absolutamente:** Una tabla puede tener múltiples llaves foráneas que referencien diferentes tablas
- **Ejemplo:** Una tabla de pedidos puede tener `cliente_id` (FK a clientes) y `vendedor_id` (FK a vendedores)
- **Consideraciones:** Cada llave foránea debe tener su propia definición y puede tener diferentes opciones ON DELETE/ON UPDATE según la lógica de negocio
- **Uso común:** Las tablas intermedias en relaciones muchos a muchos tienen múltiples llaves foráneas

---

## 🎉 ¡MySQL Avanzado Dominado!

¡Excelente trabajo! Ya conoces cómo implementar llaves foráneas para garantizar la integridad referencial, cómo configurar las opciones ON DELETE y ON UPDATE para controlar el comportamiento de las relaciones, y cómo realizar consultas avanzadas utilizando JOIN, subconsultas y UNION. En la próxima clase exploraremos las bases de datos no relacionales, comenzando con MongoDB.

**Recuerda:** La práctica constante es clave para dominar SQL. Experimenta con diferentes tipos de JOIN y subconsultas para entender cuándo usar cada uno. ¡Sigue practicando y construyendo bases de datos más complejas! 🚀

---

_📧 **Contacto:** Si tienes dudas sobre llaves foráneas y consultas avanzadas en MySQL, no dudes en consultar durante la clase o por los canales de comunicación establecidos._
