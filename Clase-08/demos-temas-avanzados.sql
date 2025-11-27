-- ===============================================================
-- 🎬 Demos por tema - Clase 08 SQL Avanzado
-- Cada bloque incluye:
--   1) Preparación de tablas con datos
--   2) Consulta o código a explicar
--   3) Comentarios de ventajas y precauciones
-- Ejecutar en MySQL 8.0+
-- ===============================================================

DROP DATABASE IF EXISTS db_sql_temas;
CREATE DATABASE db_sql_temas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_sql_temas;

-- ---------------------------------------------------------------
-- 🔹 Datos base compartidos
-- ---------------------------------------------------------------
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    segmento ENUM('Retail', 'Enterprise', 'Startup') NOT NULL,
    pais VARCHAR(60) NOT NULL
);

CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha DATE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('Pendiente', 'Pagado', 'Cancelado') DEFAULT 'Pendiente',
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE facturas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    numero VARCHAR(30) NOT NULL UNIQUE,
    monto DECIMAL(10,2) NOT NULL,
    pagado BOOLEAN DEFAULT FALSE,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

INSERT INTO clientes (nombre, segmento, pais) VALUES
('Green Logistics', 'Enterprise', 'Chile'),
('NubePyme', 'Startup', 'Argentina'),
('Mercurio Retail', 'Retail', 'Perú'),
('DataPulse', 'Enterprise', 'México');

INSERT INTO pedidos (cliente_id, fecha, total, estado) VALUES
(1, '2025-01-10', 12500, 'Pagado'),
(1, '2025-02-15', 8600, 'Pagado'),
(2, '2025-02-05', 4200, 'Pendiente'),
(3, '2025-01-20', 2200, 'Pagado'),
(4, '2025-01-18', 9800, 'Pagado'),
(4, '2025-03-01', 11300, 'Pendiente');

INSERT INTO facturas (pedido_id, numero, monto, pagado) VALUES
(1, 'FAC-1001', 12500, TRUE),
(2, 'FAC-1002', 8600, TRUE),
(3, 'FAC-1003', 4200, FALSE),
(4, 'FAC-1004', 2200, TRUE),
(5, 'FAC-1005', 9800, TRUE),
(6, 'FAC-1006', 11300, FALSE);

-- ---------------------------------------------------------------
-- 🔸 Consultas anidadas
-- ---------------------------------------------------------------
-- Ventaja: reducir lógica en la aplicación al comparar KPI del cliente
SELECT c.nombre, c.segmento, AVG(p.total) AS ticket_cliente
FROM clientes c
JOIN pedidos p ON p.cliente_id = c.id
WHERE AVG(p.total) > (SELECT AVG(total) FROM pedidos); -- Error: no se puede usar AVG aquí

-- ✅ Versión correcta con subconsulta correlacionada
SELECT
    c.nombre,
    c.segmento,
    (
        SELECT AVG(total)
        FROM pedidos p
        WHERE p.cliente_id = c.id
    ) AS ticket_cliente
FROM clientes c
WHERE c.id IN (
    SELECT cliente_id
    FROM pedidos
    GROUP BY cliente_id
    HAVING AVG(total) > (SELECT AVG(total) FROM pedidos)
);
-- Ventaja: encapsula la comparación; se explica que evita traer todos los datos al backend
-- Cuándo evitar: si se ejecuta cientos de veces por segundo, evaluar vista materializada.

-- ---------------------------------------------------------------
-- 🔸 Stored procedures
-- ---------------------------------------------------------------
DELIMITER //
CREATE PROCEDURE sp_resumen_cliente (IN p_cliente INT)
BEGIN
    SELECT
        c.nombre,
        COUNT(p.id) AS pedidos_totales,
        SUM(p.total) AS facturacion,
        SUM(CASE WHEN f.pagado THEN f.monto ELSE 0 END) AS cobrado,
        SUM(CASE WHEN f.pagado THEN 0 ELSE f.monto END) AS saldo_pendiente
    FROM clientes c
    JOIN pedidos p ON p.cliente_id = c.id
    JOIN facturas f ON f.pedido_id = p.id
    WHERE c.id = p_cliente
    GROUP BY c.nombre;
END//
DELIMITER ;

CALL sp_resumen_cliente(1);
-- Ventaja: la app sólo ejecuta CALL, evitando repetir 4 agregaciones.
-- Consideración: documentar versión y parámetros para mantener compatibilidad.

-- ---------------------------------------------------------------
-- 🔸 Checks
-- ---------------------------------------------------------------
CREATE TABLE pagos_seguro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    porcentaje DECIMAL(5,2) NOT NULL,
    fecha_pago DATE NOT NULL,
    CHECK (porcentaje BETWEEN 0 AND 100),
    CHECK (monto >= 0),
    CHECK (fecha_pago >= '2025-01-01'),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

INSERT INTO pagos_seguro (pedido_id, monto, porcentaje, fecha_pago)
VALUES (1, 3000, 25, '2025-02-01');
-- Ventaja: impide registrar porcentajes inválidos incluso desde otras herramientas.

-- Este insert fallará por el CHECK
-- INSERT INTO pagos_seguro (pedido_id, monto, porcentaje, fecha_pago)
-- VALUES (2, 2000, 180, '2024-12-01');
-- Comentario para la clase: mostrar el error y explicar por qué protege la integridad.

-- ---------------------------------------------------------------
-- 🔸 Triggers
-- ---------------------------------------------------------------
CREATE TABLE facturas_historial (
    id INT AUTO_INCREMENT PRIMARY KEY,
    factura_id INT NOT NULL,
    estado_anterior BOOLEAN,
    estado_nuevo BOOLEAN,
    cambiado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //
CREATE TRIGGER tr_facturas_after_update
AFTER UPDATE ON facturas
FOR EACH ROW
BEGIN
    IF OLD.pagado <> NEW.pagado THEN
        INSERT INTO facturas_historial (factura_id, estado_anterior, estado_nuevo)
        VALUES (NEW.id, OLD.pagado, NEW.pagado);
    END IF;
END//
DELIMITER ;

UPDATE facturas SET pagado = TRUE WHERE id = 6;
SELECT * FROM facturas_historial ORDER BY cambiado_en DESC;
-- Ventaja: auditoría automática cada vez que cambia el estado de cobro.
-- Precaución: documentar el trigger para evitar sorpresas durante migraciones masivas.

-- ---------------------------------------------------------------
-- 🔸 Views
-- ---------------------------------------------------------------
CREATE OR REPLACE VIEW vw_resumen_facturacion AS
SELECT
    c.nombre AS cliente,
    c.segmento,
    SUM(p.total) AS total_pedidos,
    SUM(f.monto) AS total_facturado,
    SUM(CASE WHEN f.pagado THEN f.monto ELSE 0 END) AS total_cobrado,
    SUM(CASE WHEN f.pagado THEN 0 ELSE f.monto END) AS saldo
FROM clientes c
JOIN pedidos p ON p.cliente_id = c.id
JOIN facturas f ON f.pedido_id = p.id
GROUP BY c.nombre, c.segmento;

SELECT * FROM vw_resumen_facturacion ORDER BY saldo DESC;
-- Ventaja: los analistas consultan la vista sin tocar tablas sensibles.
-- Precaución: si la vista se apoya en joins costosos, monitorea el plan de ejecución.

-- Listo. Cada bloque puede ejecutarse independientemente para explicar ventajas y límites.

