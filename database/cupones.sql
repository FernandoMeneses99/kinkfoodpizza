-- =============================================
-- SISTEMA DE CUPONES/DESCUENTOS
-- Compatible con la estructura existente
-- =============================================

-- Tabla de cupones
CREATE TABLE IF NOT EXISTS cupones (
    id_cupon INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo_descuento ENUM('porcentaje', 'monto_fijo') NOT NULL DEFAULT 'porcentaje',
    valor_descuento DECIMAL(10, 2) NOT NULL,
    valor_minimo DECIMAL(10, 2) DEFAULT 0,
    valor_maximo_descuento DECIMAL(10, 2) DEFAULT NULL,
    cantidad_disponible INT DEFAULT NULL,
    cantidad_usada INT DEFAULT 0,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    solo_primera_compra BOOLEAN DEFAULT FALSE,
    aplicableCategorias JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_fechas (fecha_inicio, fecha_fin),
    INDEX idx_activo (activo)
);

-- Tabla de uso de cupones (sin foreign keys para evitar conflictos)
CREATE TABLE IF NOT EXISTS cupon_usos (
    id_uso INT AUTO_INCREMENT PRIMARY KEY,
    cupon_id INT NOT NULL,
    usuario_id INT NOT NULL,
    orden_id INT NOT NULL,
    descuento_aplicado DECIMAL(10, 2) NOT NULL,
    fecha_uso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_cupon_orden (cupon_id, orden_id)
);

-- Agregar foreign keys manualmente después
ALTER TABLE cupon_usos 
ADD CONSTRAINT fk_cupon_usos_cupon 
FOREIGN KEY (cupon_id) REFERENCES cupones(id_cupon) ON DELETE CASCADE;

-- Nota: Si las tablas usuarios y ordenes ya existen, ejecutar:
-- ALTER TABLE cupon_usos ADD CONSTRAINT fk_cupon_usos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario);
-- ALTER TABLE cupon_usos ADD CONSTRAINT fk_cupon_usos_orden FOREIGN KEY (orden_id) REFERENCES ordenes(id_orden);

-- Insertar cupones de ejemplo (solo si no existen)
INSERT IGNORE INTO cupones (codigo, nombre, descripcion, tipo_descuento, valor_descuento, valor_minimo, cantidad_disponible, fecha_inicio, fecha_fin) VALUES
('BIENVENIDO', 'Bienvenida', '20% de descuento en tu primera compra', 'porcentaje', 20, 0, 1000, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR)),
('KROKORI10', 'Promo Krokori', '10% de descuento en cualquier pedido', 'porcentaje', 10, 50000, 500, NOW(), DATE_ADD(NOW(), INTERVAL 6 MONTH)),
('DOMICILIO5', 'Descuento Domicilio', '$5.000 de descuento', 'monto_fijo', 5000, 30000, 200, NOW(), DATE_ADD(NOW(), INTERVAL 3 MONTH)),
('PIZZA30', 'Promo Pizza', '30% de descuento en pizzas', 'porcentaje', 30, 40000, 100, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH));
