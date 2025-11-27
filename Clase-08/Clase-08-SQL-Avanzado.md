# 📖 Clase 8: SQL Avanzado en MySQL

## 🎯 Objetivos de la Clase

- Comprender cómo las consultas anidadas resuelven escenarios complejos sin replicar lógica en la aplicación ✨
- Diseñar stored procedures reutilizables que encapsulen reglas de negocio críticas
- Implementar restricciones CHECK que protejan la integridad de los datos desde el motor
- Automatizar auditorías y flujos mediante triggers que reaccionan a cambios en las tablas
- Crear y mantener vistas materializadas lógicas para acelerar consultas analíticas

---

## 📚 ¿Qué es SQL Avanzado en MySQL?

### 🔍 Definición

**SQL avanzado en MySQL** es el conjunto de técnicas y estructuras que van más allá de las operaciones CRUD básicas para optimizar, automatizar y asegurar la gestión de datos. Incluye subconsultas complejas, programación con stored procedures, validaciones declarativas, triggers reactivos y vistas reutilizables.

### 🏗️ Características Principales

- **Abstracción multicapa:** Permite encapsular lógica en la base para reducir duplicación en el backend
- **Gobernanza de datos:** Checks, triggers y vistas aseguran que las reglas del negocio se cumplan siempre
- **Automatización:** Stored procedures y triggers orquestan procesos sin intervención manual
- **Escalabilidad analítica:** Vistas optimizadas y subconsultas permiten responder preguntas complejas rápidamente

### 📖 Historia Breve

- **1979:** Oracle introduce stored procedures como parte del estándar SQL/PSM inicial
- **1995:** MySQL agrega soporte para vistas y restricciones básicas
- **2003:** Estándar SQL:2003 formaliza triggers y funciones de ventana
- **2005:** MySQL 5.0 incorpora stored procedures, triggers y vistas nativas
- **Actualidad:** MySQL 8.x potencia checks, CTE, vistas con algoritmos MERGE/TEMPTABLE y mejoras de seguridad

---

## 🏛️ Pilares del SQL Avanzado

### 📝 Consultas Anidadas

Las subconsultas permiten filtrar, agregar o comparar datos basados en resultados intermedios.

**Cuándo usarlas:**

- Cuando el filtro depende de un cálculo previo (ej. promedios por cliente) 🙂
- Al comparar un registro contra valores agregados del mismo conjunto (subconsultas correlacionadas)
- Para evitar temporal tables durante análisis exploratorios rápidos

**Cuándo evitarlas:**

- Cuando la misma lógica puede resolverse con `JOIN` + agregaciones y se repite en cientos de filas (coste alto)
- Si el motor no puede usar índices dentro de la subconsulta, provocando `full table scans`
- En reportes críticos donde una vista o CTE mejora la legibilidad y el cacheo

➡️ En `Clase-8/demos-temas-avanzados.sql` encontrarás la sección `-- Consultas anidadas` con un ejemplo listo para ejecutar y comparar contra una versión con `JOIN`.

```sql
-- Clientes cuyo ticket medio supera el promedio global
SELECT c.id, c.nombre
FROM clientes c
WHERE (
    SELECT AVG(total)
    FROM pedidos
    WHERE cliente_id = c.id
) > (
    SELECT AVG(total) FROM pedidos
);
```

### 📝 Stored Procedures

Centralizan lógica compleja y aceptan parámetros de entrada y salida.

**Cuándo usarlos:**

- Necesitas garantizar transacciones multi-paso directamente en la base (ej. recalcular stock y auditar)
- Buscas exponer una única API SQL para equipos externos o jobs ETL ✅
- Requieres aplicar controles de seguridad a nivel base (GRANT EXECUTE) sin exponer tablas internas

**Cuándo evitarlos:**

- La lógica cambia muy seguido y prefieres pipelines versionados en código
- El motor de la app ya gestiona transacciones distribuidas (evita duplicar reglas)
- Debes migrar a motores que no soportan procedimientos de manera homogénea

📌 El script `Clase-8/demos-temas-avanzados.sql` incluye el procedure `sp_resumen_cliente` que muestra cómo encapsular KPIs y por qué simplifica la capa backend.

```sql
DELIMITER //
CREATE PROCEDURE sp_actualizar_stock(IN p_producto INT, IN p_cantidad INT)
BEGIN
    UPDATE productos
    SET stock = stock - p_cantidad
    WHERE id = p_producto;

    INSERT INTO auditoria_stock(producto_id, cantidad, creado_en)
    VALUES (p_producto, p_cantidad, NOW());
END//
DELIMITER ;
```

### 📝 Checks y Reglas Declarativas

Validan datos al momento de insertar o actualizar registros.

**Cuándo usarlos:**

- Las reglas son simples y permanentes (rangos, signos, formatos básicos)
- Quieres fallar rápido antes de que la app procese datos inválidos
- Necesitas que múltiples sistemas inserten datos cumpliendo las mismas restricciones

**Cuándo evitarlos:**

- Reglas que dependen de otras tablas (mejor usar triggers o lógica de aplicación)
- Validaciones complejas que requieren expresiones regulares avanzadas o cálculos pesados
- Motores heredados (< MySQL 8.0.16) que ignoran CHECK y generan falsa sensación de seguridad

🛡️ La tabla `pagos_seguro` demuestra cómo un CHECK combina límites porcentuales y fechas válidas.

```sql
CREATE TABLE cuentas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    saldo DECIMAL(12,2) NOT NULL,
    limite_credito DECIMAL(12,2) NOT NULL,
    CHECK (saldo >= -limite_credito)
);
```

### 📝 Triggers

Ejecutan lógica automáticamente en respuesta a eventos `INSERT`, `UPDATE` o `DELETE`.

**Cuándo usarlos:**

- Auditorías automáticas (bitácoras, historial de estados) sin depender del backend
- Sincronizar totales o saldos derivados del mismo registro
- Forzar políticas que no se pueden expresar con CHECK (comparar valores históricos) 🔒

**Cuándo evitarlos:**

- Operaciones masivas donde el trigger se dispara millones de veces (considera desactivarlo o usar procesos batch)
- Cuando ocultar lógica complica el debugging del equipo (documenta siempre)
- Si necesitas orden específico entre múltiples triggers (MySQL no garantiza prioridad)

🔁 El trigger `tr_facturas_after_update` ejemplifica una auditoría ligera con explicación de sus beneficios vs hacerlo en la app.

```sql
DELIMITER //
CREATE TRIGGER tr_bitacora_pagos
AFTER UPDATE ON pagos
FOR EACH ROW
BEGIN
    INSERT INTO pagos_historial(pago_id, estado_anterior, estado_nuevo, cambiado_en)
    VALUES (NEW.id, OLD.estado, NEW.estado, NOW());
END//
DELIMITER ;
```

### 📝 Views

Ofrecen capas virtuales de datos para reportes o seguridad.

**Cuándo usarlas:**

- Requieres exponer datos a analistas sin dar acceso a tablas sensibles
- Deseas reutilizar cálculos recurrentes (KPI mensual, pipeline de datos) 📊
- Quieres protegerte de cambios de esquema: sólo actualizas la vista, no todas las queries

**Cuándo evitarlas:**

- Queries altamente parametrizadas que no se benefician de una estructura fija
- Vistas anidadas que ocultan demasiada lógica y complican el optimizador
- Situaciones donde necesitas índices personalizados (considera materialized views en otros motores)

👁️‍🗨️ Consulta `vw_resumen_facturacion` muestra cómo resumir datos y explicar la ventaja frente a repetir SELECTs complejos.

```sql
CREATE OR REPLACE VIEW vw_ingresos_mensuales AS
SELECT
    DATE_FORMAT(fecha_pago, '%Y-%m') AS periodo,
    SUM(monto) AS total
FROM pagos
GROUP BY periodo;
```

---

## 🏗️ Automatización y Gobernanza

### 📄 Blueprint integral con subconsultas, procedimientos, checks, triggers y views

```sql
-- 1. Creación de esquema
DROP DATABASE IF EXISTS db_sql_avanzado;
CREATE DATABASE db_sql_avanzado CHARACTER SET utf8mb4;
USE db_sql_avanzado;

-- 2. Tablas con CHECK y llaves foráneas
CREATE TABLE departamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    presupuesto DECIMAL(12,2) NOT NULL,
    CHECK (presupuesto >= 0)
);

CREATE TABLE empleados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    departamento_id INT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    salario DECIMAL(10,2) NOT NULL CHECK (salario >= 0),
    fecha_ingreso DATE NOT NULL,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    FOREIGN KEY (departamento_id)
        REFERENCES departamentos(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE evaluaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT NOT NULL,
    puntaje TINYINT NOT NULL CHECK (puntaje BETWEEN 1 AND 10),
    comentario VARCHAR(255),
    fecha DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (empleado_id)
        REFERENCES empleados(id)
        ON DELETE CASCADE
);

CREATE TABLE bonos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empleado_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL CHECK (monto BETWEEN 0 AND 20000),
    motivo VARCHAR(150),
    fecha DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id)
);

-- 3. Trigger para validar bonos respecto al salario del empleado
DELIMITER //
CREATE TRIGGER tr_bonos_limite
BEFORE INSERT ON bonos
FOR EACH ROW
BEGIN
    DECLARE v_salario DECIMAL(10,2);
    SELECT salario INTO v_salario FROM empleados WHERE id = NEW.empleado_id;

    IF NEW.monto > v_salario * 0.5 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El bono supera el 50% del salario mensual';
    END IF;
END//
DELIMITER ;

-- 4. Stored procedure que registra evaluaciones y bonifica automáticamente
DELIMITER //
CREATE PROCEDURE sp_registrar_evaluacion (
    IN p_empleado INT,
    IN p_puntaje TINYINT,
    IN p_comentario VARCHAR(255)
)
BEGIN
    INSERT INTO evaluaciones (empleado_id, puntaje, comentario)
    VALUES (p_empleado, p_puntaje, p_comentario);

    IF p_puntaje >= 9 THEN
        INSERT INTO bonos (empleado_id, monto, motivo)
        VALUES (p_empleado, 1500.00, 'Desempeño sobresaliente');
    END IF;
END//
DELIMITER ;

-- 5. Vistas que combinan subconsultas
CREATE OR REPLACE VIEW vw_resumen_empleados AS
SELECT
    e.id,
    e.nombre,
    d.nombre AS departamento,
    e.salario,
    (
        SELECT AVG(puntaje)
        FROM evaluaciones ev
        WHERE ev.empleado_id = e.id
    ) AS promedio_puntaje,
    (
        SELECT SUM(monto)
        FROM bonos b
        WHERE b.empleado_id = e.id
    ) AS total_bonos
FROM empleados e
JOIN departamentos d ON d.id = e.departamento_id;

-- 6. Inserciones iniciales
INSERT INTO departamentos (nombre, presupuesto) VALUES
('Innovación', 250000),
('Operaciones', 320000),
('Talento', 150000);

INSERT INTO empleados (departamento_id, nombre, salario, fecha_ingreso)
VALUES
(1, 'Amelia Reyes', 95000, '2021-03-15'),
(1, 'Ricardo Yunes', 72000, '2022-07-01'),
(2, 'Laura Méndez', 68000, '2020-11-23'),
(3, 'Sofía Delgado', 54000, '2023-02-10');

-- 7. Uso del stored procedure + subconsultas
CALL sp_registrar_evaluacion(1, 10, 'Lideró el rediseño de la plataforma');
CALL sp_registrar_evaluacion(2, 8, 'Cumplió objetivos trimestrales');
CALL sp_registrar_evaluacion(3, 9, 'Optimización de costos logísticos');

-- 8. Consultas anidadas y actualizaciones
UPDATE empleados
SET salario = salario * 1.05
WHERE id IN (
    SELECT empleado_id
    FROM evaluaciones
    WHERE puntaje >= 9
);

-- 9. Eliminaciones controladas (cascade en evaluaciones, valida trigger en bonos)
DELETE FROM empleados
WHERE id = (
    SELECT id FROM empleados
    WHERE estado = 'Inactivo'
    LIMIT 1
);

-- 10. Consulta final para reportes
SELECT *
FROM vw_resumen_empleados
ORDER BY promedio_puntaje DESC;
```

---

## 🚀 Ejercicio Práctico

### 📝 Simulador de Bonificaciones Dinámicas

Crea un sandbox en MySQL donde puedas:

- Generar tablas de `areas`, `colaboradores`, `metas` y `pagos_bonos`
- Definir CHECK que impida registrar metas con fechas invertidas
- Construir un trigger que descuente stock de bonos al generarlos
- Crear una vista que consolide metas cumplidas vs pendientes

```sql
-- Punto de partida
CREATE TABLE areas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE metas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(160),
    fecha_inicio DATE,
    fecha_fin DATE,
    CHECK (fecha_fin >= fecha_inicio)
);

-- Completa la solución: relaciones, procedimientos y consultas
```

**Archivo `ejercicio-clase-08.sql`:**

```sql
-- Debe incluir: creación de tablas, inserts de prueba, updates con subconsultas,
-- deletes que respeten restricciones y al menos un stored procedure utilitario.
```

---

## 🏠 Tarea para la Próxima Clase

### ✅ Ejercicio:

1. **Modelar** un módulo de certificaciones por empleado con al menos tres tablas relacionadas
2. **Aplicar** dos CHECK distintos (intervalos y formatos)
3. **Escribir** un stored procedure que recalcule el estatus de certificación
4. **Crear** un trigger que evite certificados duplicados por periodo
5. **Construir** una vista digest que combine KPIs por área
6. **Demostrar** dos consultas anidadas (una correlacionada y otra no)
7. **Documentar** decisiones técnicas en un README breve

**Requisitos técnicos:**

- MySQL 8.0 o superior
- Scripts versionados en Git
- Uso de `DELIMITER` correcto
- Comentarios en SQL para describir reglas clave

---

## 📚 Recursos Adicionales

### 🔗 Enlaces Útiles

- [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/) - Documentación oficial
- [SQL Style Guide](https://www.sqlstyle.guide/) - Buenas prácticas de formato
- [Use The Index, Luke](https://use-the-index-luke.com/) - Optimización de consultas
- [Percona Blog](https://www.percona.com/blog/) - Casos reales y tuning en MySQL

### 📖 Conceptos para Investigar

- **CTE recursivas:** Encadenar jerarquías sin subconsultas profundas
- **Eventos programados MySQL:** Tareas cron nativas del motor
- **Roles y privilegios finos:** Seguridad orientada a principio de mínimo privilegio
- **Funciones de ventana:** Rankings y cálculos móviles sin subconsultas

---

## ❓ Preguntas Frecuentes

### ¿Cuándo usar una vista vs. una subconsulta?

- **Reutilización:** Las vistas documentan la intención y se comparten entre equipos
- **Rendimiento:** Una vista simple MERGE ejecuta igual que la subconsulta original
- **Seguridad:** Permite ocultar columnas sensibles
- **Mantenimiento:** Cambias la vista una vez en lugar de editar múltiples queries

### ¿Qué diferencia hay entre trigger y stored procedure?

- **Disparador automático:** El trigger responde a eventos DML sin invocación manual
- **Scope:** El stored procedure se ejecuta bajo demanda y puede ser transaccional
- **Uso típico:** Triggers para auditoría; procedures para orquestar procesos

### ¿Cómo pruebo un trigger sin afectar producción?

- **Replica el esquema** en un entorno aislado
- **Usa transacciones** y `ROLLBACK` para revertir cambios durante las pruebas
- **Registra casos edge** (nulls, montos altos, cambios masivos)
- **Monitorea logs** para validar que no existan errores silenciosos

---

## 🎉 ¡SQL Avanzado Dominado!

¡Increíble avance! Ahora puedes combinar subconsultas, procedimientos, checks, triggers y vistas para construir una capa de datos robusta y automatizada. En la próxima clase integraremos estos conceptos con conexiones desde Node.js para ejecutar consultas parametrizadas y seguras.

**Recuerda:** Practica cada script en un entorno aislado y versiona tus cambios. ¡Tu base de datos será tan sólida como tu disciplina diaria! 🚀

---

_📧 **Contacto:** Si tienes dudas sobre SQL avanzado y automatización en MySQL, no dudes en consultar durante la clase o por los canales de comunicación establecidos._
