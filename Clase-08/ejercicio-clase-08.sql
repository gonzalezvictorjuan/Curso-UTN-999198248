-- ===============================================================
-- 🎯 Ejercicio Clase 08 - SQL Avanzado
-- Resolución completa del "Simulador de Bonificaciones Dinámicas"
-- Requiere MySQL 8.0+
-- ===============================================================

-- 1. Creación del esquema limpio
DROP DATABASE IF EXISTS db_bonos_dinamicos;
CREATE DATABASE db_bonos_dinamicos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_bonos_dinamicos;

-- 2. Tablas base con checks y relaciones
CREATE TABLE areas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL UNIQUE,
    presupuesto_anual DECIMAL(12,2) NOT NULL CHECK (presupuesto_anual >= 0),
    responsable VARCHAR(120) NOT NULL
);

CREATE TABLE colaboradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    area_id INT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    fecha_ingreso DATE NOT NULL,
    salario DECIMAL(12,2) NOT NULL CHECK (salario >= 0),
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    FOREIGN KEY (area_id) REFERENCES areas(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE metas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    area_id INT NOT NULL,
    titulo VARCHAR(120) NOT NULL,
    descripcion VARCHAR(255),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    objetivo_porcentual TINYINT NOT NULL CHECK (objetivo_porcentual BETWEEN 0 AND 100),
    CHECK (fecha_fin >= fecha_inicio),
    FOREIGN KEY (area_id) REFERENCES areas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE colaboradores_metas (
    colaborador_id INT NOT NULL,
    meta_id INT NOT NULL,
    avance TINYINT NOT NULL DEFAULT 0 CHECK (avance BETWEEN 0 AND 100),
    estado ENUM('Pendiente', 'En progreso', 'Cumplida') DEFAULT 'Pendiente',
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (colaborador_id, meta_id),
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (meta_id) REFERENCES metas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE stock_bonos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    area_id INT NOT NULL UNIQUE,
    saldo_disponible DECIMAL(12,2) NOT NULL CHECK (saldo_disponible >= 0),
    ultima_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (area_id) REFERENCES areas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE pagos_bonos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    colaborador_id INT NOT NULL,
    meta_id INT NOT NULL,
    monto DECIMAL(12,2) NOT NULL CHECK (monto > 0),
    motivo VARCHAR(180),
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    FOREIGN KEY (meta_id) REFERENCES metas(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- 3. Trigger para descontar el stock de bonos al registrar un pago
DELIMITER //
CREATE TRIGGER tr_descuento_stock_bonos
BEFORE INSERT ON pagos_bonos
FOR EACH ROW
BEGIN
    DECLARE v_area INT;
    DECLARE v_saldo DECIMAL(12,2);

    SELECT area_id INTO v_area
    FROM colaboradores
    WHERE id = NEW.colaborador_id;

    SELECT saldo_disponible INTO v_saldo
    FROM stock_bonos
    WHERE area_id = v_area
    FOR UPDATE;

    IF v_saldo IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'No existe stock configurado para el área del colaborador';
    END IF;

    IF v_saldo < NEW.monto THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Saldo de bonos insuficiente para completar el pago';
    END IF;

    UPDATE stock_bonos
    SET saldo_disponible = saldo_disponible - NEW.monto
    WHERE area_id = v_area;
END//
DELIMITER ;

-- 4. Stored procedure utilitario
DELIMITER //
CREATE PROCEDURE sp_cerrar_meta_y_bonificar (
    IN p_colaborador INT,
    IN p_meta INT,
    IN p_monto DECIMAL(12,2),
    IN p_motivo VARCHAR(180)
)
BEGIN
    DECLARE v_estado ENUM('Pendiente', 'En progreso', 'Cumplida');

    SELECT estado INTO v_estado
    FROM colaboradores_metas
    WHERE colaborador_id = p_colaborador
      AND meta_id = p_meta
    FOR UPDATE;

    IF v_estado IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El colaborador no está asignado a esta meta';
    END IF;

    UPDATE colaboradores_metas
    SET estado = 'Cumplida',
        avance = 100,
        fecha_actualizacion = NOW()
    WHERE colaborador_id = p_colaborador
      AND meta_id = p_meta;

    INSERT INTO pagos_bonos (colaborador_id, meta_id, monto, motivo)
    VALUES (p_colaborador, p_meta, p_monto, p_motivo);
END//
DELIMITER ;

-- 5. Vista de control de metas
CREATE OR REPLACE VIEW vw_estado_metas AS
SELECT
    m.id AS meta_id,
    m.titulo,
    a.nombre AS area,
    COUNT(cm.colaborador_id) AS colaboradores_asignados,
    SUM(CASE WHEN cm.estado = 'Cumplida' THEN 1 ELSE 0 END) AS cumplidas,
    SUM(CASE WHEN cm.estado <> 'Cumplida' THEN 1 ELSE 0 END) AS pendientes,
    AVG(cm.avance) AS avance_promedio,
    MIN(cm.fecha_actualizacion) AS primera_actualizacion,
    MAX(cm.fecha_actualizacion) AS ultima_actualizacion
FROM metas m
JOIN areas a ON a.id = m.area_id
LEFT JOIN colaboradores_metas cm ON cm.meta_id = m.id
GROUP BY m.id, m.titulo, a.nombre;

-- 6. Datos de ejemplo
INSERT INTO areas (nombre, presupuesto_anual, responsable) VALUES
('Innovación', 420000, 'Amelia Duarte'),
('Operaciones', 560000, 'Franco Tejada'),
('Talento', 300000, 'Lucía Araya');

INSERT INTO colaboradores (area_id, nombre, email, fecha_ingreso, salario) VALUES
(1, 'Sofía Molina', 'sofia.molina@empresa.com', '2022-01-15', 95000),
(1, 'Lucas Paredes', 'lucas.paredes@empresa.com', '2023-03-10', 72000),
(2, 'Bruno Alarcón', 'bruno.alarcon@empresa.com', '2021-11-01', 68000),
(2, 'Marina Ponce', 'marina.ponce@empresa.com', '2020-07-20', 83000),
(3, 'Eva Ramos', 'eva.ramos@empresa.com', '2023-05-05', 60000);

INSERT INTO metas (area_id, titulo, descripcion, fecha_inicio, fecha_fin, objetivo_porcentual) VALUES
(1, 'MVP Plataforma IA', 'Liberar prototipo funcional con feedback real', '2025-01-02', '2025-03-31', 90),
(2, 'Reingeniería logística', 'Reducir tiempos de despacho en 20%', '2025-02-01', '2025-05-30', 85),
(3, 'Programa onboarding', 'Estandarizar onboarding digital', '2025-01-15', '2025-04-15', 80);

INSERT INTO colaboradores_metas (colaborador_id, meta_id, avance, estado) VALUES
(1, 1, 35, 'En progreso'),
(2, 1, 20, 'Pendiente'),
(3, 2, 40, 'En progreso'),
(4, 2, 15, 'Pendiente'),
(5, 3, 50, 'En progreso');

INSERT INTO stock_bonos (area_id, saldo_disponible) VALUES
(1, 35000),
(2, 42000),
(3, 15000);

-- 7. Operaciones de actualización usando subconsultas
-- Subir 5% el salario de quienes lideran metas con avance promedio > 60
UPDATE colaboradores
SET salario = salario * 1.05
WHERE id IN (
    SELECT cm.colaborador_id
    FROM colaboradores_metas cm
    WHERE cm.meta_id IN (
        SELECT meta_id
        FROM vw_estado_metas
        WHERE avance_promedio > 60
    )
);

-- Marcar como "En progreso" a quienes superen el avance promedio del área
UPDATE colaboradores_metas
SET estado = 'En progreso'
WHERE estado = 'Pendiente'
  AND avance >= (
    SELECT AVG(cm2.avance)
    FROM colaboradores_metas cm2
    JOIN metas m2 ON m2.id = cm2.meta_id
    WHERE m2.area_id = (
        SELECT m3.area_id FROM metas m3 WHERE m3.id = colaboradores_metas.meta_id
    )
);

-- 8. Uso del stored procedure (inserta pago y actualiza trigger)
CALL sp_cerrar_meta_y_bonificar(1, 1, 2500.00, 'Entrega anticipada del MVP');
CALL sp_cerrar_meta_y_bonificar(3, 2, 1800.00, 'Optimización extra en rutas');

-- 9. Eliminaciones controladas
-- Eliminar meta cuya fecha aún no inicia para replanificar (sin afectar otras tablas)
DELETE FROM metas
WHERE id NOT IN (
    SELECT DISTINCT meta_id FROM colaboradores_metas
)
AND fecha_inicio > CURRENT_DATE;

-- 10. Consultas finales de validación
SELECT * FROM vw_estado_metas ORDER BY meta_id;

SELECT
    a.nombre AS area,
    sb.saldo_disponible,
    (
        SELECT IFNULL(SUM(p.monto), 0)
        FROM pagos_bonos p
        JOIN colaboradores c ON c.id = p.colaborador_id
        WHERE c.area_id = a.id
    ) AS bonos_pagados
FROM areas a
JOIN stock_bonos sb ON sb.area_id = a.id
ORDER BY a.nombre;

SELECT
    c.nombre AS colaborador,
    p.monto,
    p.motivo,
    p.fecha_pago
FROM pagos_bonos p
JOIN colaboradores c ON c.id = p.colaborador_id
ORDER BY p.fecha_pago DESC;

