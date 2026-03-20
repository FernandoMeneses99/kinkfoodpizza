-- =============================================
-- KROKORI PIZZERÍA - BASE DE DATOS PROFESIONAL
-- MySQL 8.0+ | XAMPP Compatible
-- Autor: Sistema Krokori
-- Versión: 1.0.0
-- =============================================

-- =============================================
-- 1. CREACIÓN DE LA BASE DE DATOS
-- =============================================
DROP DATABASE IF EXISTS krokori_db;
CREATE DATABASE krokori_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE krokori_db;

-- =============================================
-- 2. TABLAS PRINCIPALES
-- =============================================

-- -----------------------------------------------------
-- 2.1 Tabla de Usuarios
-- -----------------------------------------------------
CREATE TABLE usuarios (
    id_usuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    rol ENUM('admin', 'cliente', 'repartidor') NOT NULL DEFAULT 'cliente',
    activo TINYINT(1) NOT NULL DEFAULT 1,
    email_verificado TINYINT(1) NOT NULL DEFAULT 0,
    token_recuperacion VARCHAR(255) NULL,
    ultimo_login DATETIME NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_usuarios_email UNIQUE (email),
    CONSTRAINT chk_telefono CHECK (telefono REGEXP '^[0-9]{7,15}$')
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 2.2 Tabla de Categorías
-- -----------------------------------------------------
CREATE TABLE categorias (
    id_categoria INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    descripcion TEXT NULL,
    imagen VARCHAR(255) NULL,
    icono VARCHAR(50) NULL,
    orden INT UNSIGNED NOT NULL DEFAULT 0,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_categorias_slug UNIQUE (slug)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 2.3 Tabla de Productos
-- -----------------------------------------------------
CREATE TABLE productos (
    id_producto INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT UNSIGNED NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    descripcion TEXT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    precio_oferta DECIMAL(10, 2) NULL,
    imagen VARCHAR(255) NULL,
    ingredientes TEXT NULL,
    disponible TINYINT(1) NOT NULL DEFAULT 1,
    destacado TINYINT(1) NOT NULL DEFAULT 0,
    tiempo_preparacion INT UNSIGNED DEFAULT 15 COMMENT 'Minutos',
    calories INT UNSIGNED NULL,
    stock INT UNSIGNED NOT NULL DEFAULT 100,
    orden INT UNSIGNED NOT NULL DEFAULT 0,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) 
        REFERENCES categorias(id_categoria) ON DELETE RESTRICT,
    CONSTRAINT uk_productos_slug UNIQUE (slug),
    CONSTRAINT chk_precio CHECK (precio > 0),
    CONSTRAINT chk_precio_oferta CHECK (precio_oferta IS NULL OR precio_oferta > 0)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 2.4 Tabla de Direcciones
-- -----------------------------------------------------
CREATE TABLE direcciones (
    id_direccion INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL,
    barrio VARCHAR(100) NULL,
    ciudad VARCHAR(100) NOT NULL DEFAULT 'Bogotá',
    referencia TEXT NULL,
    latitud DECIMAL(10, 8) NULL,
    longitud DECIMAL(11, 8) NULL,
    es_predeterminada TINYINT(1) NOT NULL DEFAULT 0,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_direcciones_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 2.5 Tabla de Órdenes
-- -----------------------------------------------------
CREATE TABLE ordenes (
    id_orden INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NULL,
    repartidor_id INT UNSIGNED NULL,
    numero_orden VARCHAR(20) NOT NULL,
    estado ENUM('pendiente', 'pagado', 'confirmado', 'preparando', 'listo', 'en_camino', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente',
    
    -- Información de contacto (por si no está registrado)
    nombre_cliente VARCHAR(100) NULL,
    telefono_cliente VARCHAR(20) NULL,
    email_cliente VARCHAR(255) NULL,
    
    -- Dirección de entrega
    direccion_entrega TEXT NOT NULL,
    barrio VARCHAR(100) NULL,
    referencia_direccion TEXT NULL,
    
    -- Totales
    subtotal DECIMAL(10, 2) NOT NULL,
    costo_domicilio DECIMAL(10, 2) NOT NULL DEFAULT 0,
    descuento DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    
    -- Método de pago
    metodo_pago ENUM('wompi', 'nequi', 'daviplata', 'contra_entrega') NOT NULL,
    estado_pago ENUM('pendiente', 'pagado', 'fallido', 'reembolsado') NOT NULL DEFAULT 'pendiente',
    
    -- Notas
    notas TEXT NULL,
    observaciones_admin TEXT NULL,
    
    -- Timestamps
    fecha_entrega_estimada DATETIME NULL,
    fecha_entrega_real DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ordenes_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    CONSTRAINT fk_ordenes_repartidor FOREIGN KEY (repartidor_id) 
        REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    CONSTRAINT uk_ordenes_numero UNIQUE (numero_orden),
    CONSTRAINT chk_total CHECK (total >= 0)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 2.6 Tabla de Detalles de Orden
-- -----------------------------------------------------
CREATE TABLE orden_detalles (
    id_detalle INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    orden_id INT UNSIGNED NOT NULL,
    producto_id INT UNSIGNED NOT NULL,
    cantidad INT UNSIGNED NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    observaciones TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_detalles_orden FOREIGN KEY (orden_id) 
        REFERENCES ordenes(id_orden) ON DELETE CASCADE,
    CONSTRAINT fk_detalles_producto FOREIGN KEY (producto_id) 
        REFERENCES productos(id_producto) ON DELETE RESTRICT,
    CONSTRAINT chk_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_subtotal_detalle CHECK (subtotal > 0)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 2.7 Tabla de Pagos
-- -----------------------------------------------------
CREATE TABLE pagos (
    id_pago INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    orden_id INT UNSIGNED NOT NULL,
    referencia_wompi VARCHAR(100) NULL,
    tipo_transaccion ENUM('wompi', 'nequi', 'daviplata', 'contra_entrega') NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    estado ENUM('pendiente', 'completado', 'fallido', 'reembolsado') NOT NULL DEFAULT 'pendiente',
    mensaje_respuesta TEXT NULL,
    metodo_pago_detallado VARCHAR(50) NULL COMMENT 'wompi_card, wompi_PSE, etc',
    idempotency_key VARCHAR(255) NULL,
    fecha_pago DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_pagos_orden FOREIGN KEY (orden_id) 
        REFERENCES ordenes(id_orden) ON DELETE RESTRICT,
    CONSTRAINT uk_pagos_referencia UNIQUE (referencia_wompi)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 2.8 Tabla de Canasta (Carrito)
-- -----------------------------------------------------
CREATE TABLE canasta (
    id_canasta INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    session_id VARCHAR(100) NULL COMMENT 'Para usuarios no registrados',
    producto_id INT UNSIGNED NOT NULL,
    cantidad INT UNSIGNED NOT NULL DEFAULT 1,
    observaciones TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_canasta_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_canasta_producto FOREIGN KEY (producto_id) 
        REFERENCES productos(id_producto) ON DELETE CASCADE,
    CONSTRAINT uk_canasta_usuario_producto UNIQUE (usuario_id, producto_id),
    CONSTRAINT chk_cantidad_canasta CHECK (cantidad > 0)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 2.9 Tabla de Horarios
-- -----------------------------------------------------
CREATE TABLE horarios (
    id_horario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dia_semana ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NOT NULL,
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL,
    hora_apertura_domicilio TIME NULL COMMENT 'Horario especial para domicilio',
    hora_cierre_domicilio TIME NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    cerrado TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Día cerrado (vacaciones)',
    motivo_cierre VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_horarios_dia UNIQUE (dia_semana),
    CONSTRAINT chk_horas CHECK (hora_apertura < hora_cierre)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 2.10 Tabla de Configuración
-- -----------------------------------------------------
CREATE TABLE configuracion (
    id_config INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    clave VARCHAR(100) NOT NULL,
    valor TEXT NULL,
    grupo ENUM('general', 'horarios', 'pagos', 'social', 'seo') NOT NULL DEFAULT 'general',
    tipo ENUM('text', 'number', 'boolean', 'json') NOT NULL DEFAULT 'text',
    editable TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_config_clave UNIQUE (clave)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 2.11 Tabla de Logs (Auditoría)
-- -----------------------------------------------------
CREATE TABLE logs_sistema (
    id_log BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tabla_afectada VARCHAR(50) NOT NULL,
    id_registro INT UNSIGNED NULL,
    accion ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    datos_anteriores JSON NULL,
    datos_nuevos JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    usuario_id INT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_logs_tabla (tabla_afectada),
    INDEX idx_logs_fecha (created_at),
    INDEX idx_logs_usuario (usuario_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 2.12 Tabla de Tokens (Refresh Tokens)
-- -----------------------------------------------------
CREATE TABLE tokens_refresh (
    id_token BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    token VARCHAR(255) NOT NULL,
    expira_en DATETIME NOT NULL,
    usado TINYINT(1) NOT NULL DEFAULT 0,
    invalidado TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_tokens_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_tokens_expira (expira_en),
    INDEX idx_tokens_usuario (usuario_id)
) ENGINE=InnoDB;

-- =============================================
-- 3. ÍNDICES OPTIMIZADOS
-- =============================================

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_telefono ON usuarios(telefono);

-- Índices para productos
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_disponible ON productos(disponible);
CREATE INDEX idx_productos_destacado ON productos(destacado);
CREATE INDEX idx_productos_precio ON productos(precio);
CREATE INDEX idx_productos_slug ON productos(slug);

-- Índices para órdenes
CREATE INDEX idx_ordenes_usuario ON ordenes(usuario_id);
CREATE INDEX idx_ordenes_estado ON ordenes(estado);
CREATE INDEX idx_ordenes_fecha ON ordenes(created_at);
CREATE INDEX idx_ordenes_repartidor ON ordenes(repartidor_id);
CREATE INDEX idx_ordenes_numero ON ordenes(numero_orden);

-- Índices para pagos
CREATE INDEX idx_pagos_orden ON pagos(orden_id);
CREATE INDEX idx_pagos_referencia ON pagos(referencia_wompi);
CREATE INDEX idx_pagos_estado ON pagos(estado);

-- Índices para canasta
CREATE INDEX idx_canasta_usuario ON canasta(usuario_id);
CREATE INDEX idx_canasta_session ON canasta(session_id);

-- Índices para direcciones
CREATE INDEX idx_direcciones_usuario ON direcciones(usuario_id);

-- =============================================
-- 4. TRIGGERS (Auditoría y Validación)
-- =============================================

-- Trigger: Auditoría de cambios en productos
DELIMITER //
CREATE TRIGGER tr_productos_after_update
AFTER UPDATE ON productos
FOR EACH ROW
BEGIN
    INSERT INTO logs_sistema (tabla_afectada, id_registro, accion, datos_anteriores, datos_nuevos)
    VALUES ('productos', NEW.id_producto, 'UPDATE', 
            JSON_OBJECT('precio', OLD.precio, 'disponible', OLD.disponible, 'nombre', OLD.nombre),
            JSON_OBJECT('precio', NEW.precio, 'disponible', NEW.disponible, 'nombre', NEW.nombre));
END//

CREATE TRIGGER tr_productos_after_delete
AFTER DELETE ON productos
FOR EACH ROW
BEGIN
    INSERT INTO logs_sistema (tabla_afectada, id_registro, accion, datos_anteriores)
    VALUES ('productos', OLD.id_producto, 'DELETE',
            JSON_OBJECT('nombre', OLD.nombre, 'precio', OLD.precio));
END//

-- Trigger: Auditoría de cambios en órdenes
CREATE TRIGGER tr_ordenes_after_update
AFTER UPDATE ON ordenes
FOR EACH ROW
BEGIN
    IF OLD.estado != NEW.estado THEN
        INSERT INTO logs_sistema (tabla_afectada, id_registro, accion, datos_anteriores, datos_nuevos)
        VALUES ('ordenes', NEW.id_orden, 'UPDATE',
                JSON_OBJECT('estado', OLD.estado, 'updated_at', OLD.updated_at),
                JSON_OBJECT('estado', NEW.estado, 'updated_at', NEW.updated_at));
    END IF;
END//

-- Trigger: Actualizar stock al crear detalle de orden
CREATE TRIGGER tr_detalle_before_insert
BEFORE INSERT ON orden_detalles
FOR EACH ROW
BEGIN
    DECLARE stock_actual INT;
    
    SELECT stock INTO stock_actual
    FROM productos
    WHERE id_producto = NEW.producto_id;
    
    IF stock_actual < NEW.cantidad THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Stock insuficiente para este producto';
    END IF;
END//

-- Trigger: Registrar nuevo usuario
CREATE TRIGGER tr_usuarios_after_insert
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO logs_sistema (tabla_afectada, id_registro, accion, datos_nuevos)
    VALUES ('usuarios', NEW.id_usuario, 'INSERT',
            JSON_OBJECT('email', NEW.email, 'rol', NEW.rol));
END//
DELIMITER ;

-- =============================================
-- 5. PROCEDIMIENTOS ALMACENADOS
-- =============================================

DELIMITER //

-- Procedimiento: Reporte de ventas diario
CREATE PROCEDURE sp_reporte_ventas_diarias(IN fecha_param DATE)
BEGIN
    SELECT 
        DATE(o.created_at) as fecha,
        COUNT(DISTINCT o.id_orden) as total_ordenes,
        SUM(o.total) as venta_total,
        AVG(o.total) as promedio_orden,
        SUM(CASE WHEN o.estado = 'entregado' THEN 1 ELSE 0 END) as ordenes_entregadas,
        SUM(CASE WHEN o.estado = 'cancelado' THEN 1 ELSE 0 END) as ordenes_canceladas
    FROM ordenes o
    WHERE DATE(o.created_at) = fecha_param
    GROUP BY DATE(o.created_at);
END//

-- Procedimiento: Productos más vendidos
CREATE PROCEDURE sp_productos_mas_vendidos(IN limite INT, IN fecha_desde DATE, IN fecha_hasta DATE)
BEGIN
    SELECT 
        p.id_producto,
        p.nombre,
        c.nombre as categoria,
        SUM(od.cantidad) as total_vendido,
        SUM(od.subtotal) as ingresos_totales,
        COUNT(DISTINCT od.orden_id) as num_ordenes
    FROM orden_detalles od
    INNER JOIN productos p ON od.producto_id = p.id_producto
    INNER JOIN categorias c ON p.categoria_id = c.id_categoria
    INNER JOIN ordenes o ON od.orden_id = o.id_orden
    WHERE o.created_at BETWEEN fecha_desde AND fecha_hasta
        AND o.estado NOT IN ('cancelado')
    GROUP BY p.id_producto, p.nombre, c.nombre
    ORDER BY total_vendido DESC
    LIMIT limite;
END//

-- Procedimiento: Órdenes activas (en proceso)
CREATE PROCEDURE sp_ordenes_activas()
BEGIN
    SELECT 
        o.id_orden,
        o.numero_orden,
        o.estado,
        o.total,
        o.created_at,
        u.nombre as cliente,
        u.telefono,
        o.direccion_entrega,
        GROUP_CONCAT(CONCAT(p.nombre, ' x', od.cantidad) SEPARATOR ', ') as productos
    FROM ordenes o
    LEFT JOIN usuarios u ON o.usuario_id = u.id_usuario
    INNER JOIN orden_detalles od ON o.id_orden = od.orden_id
    INNER JOIN productos p ON od.producto_id = p.id_producto
    WHERE o.estado IN ('pendiente', 'pagado', 'confirmado', 'preparando', 'listo', 'en_camino')
    GROUP BY o.id_orden
    ORDER BY o.created_at ASC;
END//

-- Procedimiento: Estadísticas del dashboard
CREATE PROCEDURE sp_dashboard_stats()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM ordenes WHERE DATE(created_at) = CURDATE() AND estado != 'cancelado') as ordenes_hoy,
        (SELECT COALESCE(SUM(total), 0) FROM ordenes WHERE DATE(created_at) = CURDATE() AND estado NOT IN ('cancelado', 'pendiente')) as ventas_hoy,
        (SELECT COUNT(*) FROM ordenes WHERE estado IN ('pendiente', 'pagado', 'preparando')) as ordenes_activas,
        (SELECT COUNT(*) FROM productos WHERE disponible = 1 AND activo = 1) as productos_disponibles,
        (SELECT COUNT(*) FROM usuarios WHERE rol = 'cliente' AND DATE(fecha_registro) = CURDATE()) as nuevos_clientes_hoy,
        (SELECT COUNT(*) FROM ordenes WHERE estado = 'pendiente') as ordenes_pendientes_pago;
END//

-- Procedimiento: Actualizar stock después de confirmación de pago
CREATE PROCEDURE sp_confirmar_pago_orden(IN p_id_orden INT)
BEGIN
    DECLARE v_producto_id INT;
    DECLARE v_cantidad INT;
    DECLARE done INT DEFAULT FALSE;
    
    DECLARE cur CURSOR FOR 
        SELECT producto_id, cantidad FROM orden_detalles WHERE orden_id = p_id_orden;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO v_producto_id, v_cantidad;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        UPDATE productos 
        SET stock = stock - v_cantidad 
        WHERE id_producto = v_producto_id;
    END LOOP;
    
    CLOSE cur;
    
    UPDATE ordenes SET estado = 'confirmado', estado_pago = 'pagado' WHERE id_orden = p_id_orden;
END//

DELIMITER ;

-- =============================================
-- 6. VISTAS
-- =============================================

-- Vista: Órdenes con detalles completos
CREATE VIEW v_ordenes_completas AS
SELECT 
    o.id_orden,
    o.numero_orden,
    o.estado,
    o.estado_pago,
    o.total,
    o.created_at as fecha_orden,
    o.fecha_entrega_estimada,
    u.nombre as nombre_cliente,
    u.email as email_cliente,
    u.telefono as telefono_cliente,
    o.direccion_entrega,
    o.barrio,
    o.metodo_pago,
    r.nombre as repartidor,
    COUNT(od.id_detalle) as num_items,
    SUM(od.cantidad) as total_items
FROM ordenes o
LEFT JOIN usuarios u ON o.usuario_id = u.id_usuario
LEFT JOIN usuarios r ON o.repartidor_id = r.id_usuario
LEFT JOIN orden_detalles od ON o.id_orden = od.orden_id
GROUP BY o.id_orden;

-- Vista: Productos con nombre de categoría
CREATE VIEW v_productos_con_categoria AS
SELECT 
    p.id_producto,
    p.nombre as producto,
    p.precio,
    p.precio_oferta,
    p.disponible,
    p.destacado,
    p.stock,
    c.nombre as categoria,
    c.slug as categoria_slug
FROM productos p
INNER JOIN categorias c ON p.categoria_id = c.id_categoria;

-- Vista: Resumen de ventas por día
CREATE VIEW v_ventas_por_dia AS
SELECT 
    DATE(created_at) as fecha,
    COUNT(*) as total_ordenes,
    SUM(total) as venta_total,
    SUM(CASE WHEN estado = 'entregado' THEN total ELSE 0 END) as venta_entregada
FROM ordenes
WHERE estado NOT IN ('cancelado')
GROUP BY DATE(created_at)
ORDER BY fecha DESC;

-- =============================================
-- 7. DATOS INICIALES (SEED)
-- =============================================

-- -----------------------------------------------------
-- 7.1 Categorías
-- -----------------------------------------------------
INSERT INTO categorias (nombre, slug, descripcion, icono, orden) VALUES
('Pizzas', 'pizzas', 'Nuestras pizzas artesanales elaboradas con masa madre y horneadas en horno de leña', '🍕', 1),
('Hamburguesas', 'hamburguesas', 'Jugosas hamburguesas artesanales con carne de res 100% colombiana', '🍔', 2),
('Pastas', 'pastas', 'Pastas frescas hechas en casa con las mejores salsas', '🍝', 3),
('Bebidas', 'bebidas', 'Refrescantes bebidas para acompañar tu comida', '🥤', 4),
('Postres', 'postres', 'Dulces tentaciones para terminar tu comida', '🍰', 5),
('Ensaladas', 'ensaladas', 'Frescas ensaladas con ingredientes orgánicos', '🥗', 6);

-- -----------------------------------------------------
-- 7.2 Productos
-- -----------------------------------------------------
INSERT INTO productos (categoria_id, nombre, slug, descripcion, precio, precio_oferta, ingredientes, tiempo_preparacion, disponible, destacado) VALUES
-- Pizzas (categoria 1)
(1, 'Margherita Clásica', 'margherita-clasica', 'La pizza italiana tradicional con tomate San Marzano, mozzarella fresca y albahaca', 24000.00, NULL, 'Salsa de tomate, mozzarella, albahaca fresca, aceite de oliva', 15, 1, 1),
(1, 'Pepperoni Supreme', 'pepperoni-supreme', 'Doble porción de pepperoni artesanal con mozzarella derretida', 28000.00, 25000.00, 'Salsa de tomate, mozzarella, doble pepperoni, orégano', 15, 1, 1),
(1, 'Hawaiana Tropical', 'hawaiana-tropical', 'Clásica combinación de jamón ahumado y piña fresca', 26000.00, NULL, 'Salsa de tomate, mozzarella, jamón, piña, cerezas', 15, 1, 0),
(1, 'Quattro Formaggi', 'quattro-formaggi', 'Pizza de cuatro quesos: mozzarella, gorgonzola, parmesano y ricotta', 32000.00, NULL, 'Mozzarella, gorgonzola, parmesano, ricotta, nuez moscada', 18, 1, 1),
(1, 'BBQ Chicken', 'bbq-chicken', 'Pollo desmechado en salsa BBQ con tocino crujiente', 29000.00, NULL, 'Salsa BBQ, pollo, mozzarella, tocino, cebolla roja', 18, 1, 1),
(1, 'Vegetariana Fresh', 'vegetariana-fresh', 'Selección de verduras frescas de temporada', 25000.00, NULL, 'Pimiento, champiñón, aceituna, cebolla, tomate, espinaca', 15, 1, 0),

-- Hamburguesas (categoria 2)
(2, 'Clásica Americana', 'clasica-americana', 'Hamburguesa tradicional con carne 200g, queso cheddar y vegetales frescos', 18000.00, NULL, 'Carne de res 200g, queso cheddar, lechuga, tomate, cebolla, pepinillos', 12, 1, 1),
(2, 'Doble Carne', 'doble-carne', 'Para los más hambrientos - doble carne 200g cada una', 25000.00, 22000.00, '2 carnes de res 200g, doble queso cheddar, tocino, cebolla caramelizada', 15, 1, 1),
(2, 'Bacon Ultimate', 'bacon-ultimate', 'Triple tocino con cheddar derretido y salsa especial', 23000.00, NULL, 'Carne 200g, triple tocino, cheddar, salsa BBQ, cebolla crispy', 12, 1, 1),
(2, 'Chicken Crispy', 'chicken-crispy', 'Pechuga empanizada crujiente con salsa ranch', 20000.00, NULL, 'Pechuga empanizada, lechuga, tomate, salsa ranch', 12, 1, 0),

-- Pastas (categoria 3)
(3, 'Spaghetti Carbonara', 'spaghetti-carbonara', 'Pasta fresca con salsa carbonara auténtica italiana', 22000.00, NULL, 'Spaghetti, yolk, pecorino, guanciale, pimienta negra', 20, 1, 1),
(3, 'Fettuccine Alfredo', 'fettuccine-alfredo', 'Crema de parmesano con fettuccine recién hecho', 24000.00, NULL, 'Fettuccine, crema de leche, parmesano, mantequilla, ajo', 18, 1, 1),
(3, 'Lasagna Bolognese', 'lasagna-bolognese', 'Lasagna casera con ragú boloñesa y bechamel', 28000.00, NULL, 'Láminas de pasta, ragú boloñesa, bechamel, mozzarella', 25, 1, 1),

-- Bebidas (categoria 4)
(4, 'Gaseosa 400ml', 'gaseosa-400ml', 'Gaseosa de tu preferencia', 4000.00, NULL, NULL, 2, 1, 0),
(4, 'Jugo Natural', 'jugo-natural', 'Jugo natural de frutas frescas', 7000.00, NULL, 'Fruta de temporada', 3, 1, 0),
(4, 'Limonada Natural', 'limonada-natural', 'Limonada recién exprimida con hierbabuena', 6000.00, NULL, 'Limón, agua, azúcar, hierbabuena', 3, 1, 1),
(4, 'Cerveza Artesanal', 'cerveza-artesanal', 'Cerveza artesanal de malta colombiana', 12000.00, NULL, NULL, 2, 1, 0),
(4, 'Agua Mineral', 'agua-mineral', 'Agua mineral sin gas', 3000.00, NULL, NULL, 1, 1, 0),

-- Postres (categoria 5)
(5, 'Tiramisú', 'tiramisu', 'Clásico postre italiano con café y mascarpone', 15000.00, NULL, 'Bizcocho, café espresso, mascarpone, cacao', 5, 1, 1),
(5, 'Brownie con Helado', 'brownie-helado', 'Brownie tibio de chocolate con bola de helado de vainilla', 14000.00, NULL, 'Brownie chocolate, helado vainilla, salsa chocolate', 8, 1, 1),
(5, 'Cheesecake', 'cheesecake', 'Cheesecake de queso crema con topping de frutos rojos', 16000.00, NULL, 'Base galleta, queso crema, frutos rojos', 5, 1, 0),

-- Ensaladas (categoria 6)
(6, 'Ensalada César', 'ensalada-cesar', 'Lechuga romana, pollo a la plancha, crutones y aderezo César', 18000.00, NULL, 'Lechuga romana, pollo, crutones, parmesano, aderezo César', 8, 1, 1),
(6, 'Ensalada Mediterránea', 'ensalada-mediterranea', 'Mezcla de hojas verdes con tomate cherry, aceitunas y feta', 16000.00, NULL, 'Mezcla hojas verdes, tomate cherry, aceituna, queso feta, aceite oliva', 8, 1, 0);

-- -----------------------------------------------------
-- 7.3 Horarios
-- -----------------------------------------------------
INSERT INTO horarios (dia_semana, hora_apertura, hora_cierre, activo) VALUES
('lunes', '12:00:00', '22:00:00', 1),
('martes', '12:00:00', '22:00:00', 1),
('miercoles', '12:00:00', '22:00:00', 1),
('jueves', '12:00:00', '22:00:00', 1),
('viernes', '12:00:00', '23:00:00', 1),
('sabado', '12:00:00', '23:00:00', 1),
('domingo', '13:00:00', '21:00:00', 1);

-- -----------------------------------------------------
-- 7.4 Configuración
-- -----------------------------------------------------
INSERT INTO configuracion (clave, valor, grupo, tipo) VALUES
-- General
('nombre_restaurante', 'Krokori', 'general', 'text'),
('slogan', 'La mejor pizza de Bogotá', 'general', 'text'),
('telefono', '300-904-7298', 'general', 'text'),
('telefono_secundario', '313-384-4720', 'general', 'text'),
('email', 'info@krokori.com', 'general', 'text'),
('direccion', 'Bogotá, Colombia', 'general', 'text'),
('ciudad', 'Bogotá', 'general', 'text'),

-- Domicilio
('domicilio_gratis_desde', '70000', 'general', 'number'),
('costo_domicilio', '5000', 'general', 'number'),
('tiempo_minimo_domicilio', '30', 'general', 'number'), -- minutos

-- Redes sociales
('facebook_url', 'https://facebook.com/krokori', 'social', 'text'),
('instagram_url', 'https://instagram.com/krokori', 'social', 'text'),
('twitter_url', '', 'social', 'text'),
('whatsapp', '573009047298', 'social', 'text'),

-- SEO
('meta_title', 'Krokori - Pizzería Artesanal en Bogotá', 'seo', 'text'),
('meta_description', 'Las mejores pizzas artesanales de Bogotá. Domicilio gratis por compras de $70.000. ¡Ordena ahora!', 'seo', 'text'),
('meta_keywords', 'pizza bogota, pizzeria, domicilio pizza, hamburguesas, pizza artesanal', 'seo', 'text'),

-- Wompi (sandbox por defecto)
('wompi_public_key', '', 'pagos', 'text'),
('wompi_private_key', '', 'pagos', 'text'),
('wompi_currency', 'COP', 'pagos', 'text'),
('wompi_environment', 'test', 'pagos', 'text'),

-- Logo
('logo_url', '/images/logo.png', 'general', 'text'),
('favicon_url', '/images/favicon.ico', 'general', 'text');

-- -----------------------------------------------------
-- 7.5 Usuario Admin (password: admin123)
-- -----------------------------------------------------
-- Password: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.FQg.fP8u3g5L6m (bcrypt de "admin123")
INSERT INTO usuarios (email, password_hash, nombre, telefono, rol, email_verificado) VALUES
('admin@krokori.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.FQg.fP8u3g5L6m', 'Administrador', '3000000000', 'admin', 1);

-- =============================================
-- 8. FUNCIONES ÚTILES
-- =============================================

DELIMITER //

-- Función: Calcular costo de domicilio
CREATE FUNCTION fn_calcular_costo_domicilio(p_subtotal DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE v_costo_domicilio DECIMAL(10,2);
    DECLARE v_minimo_gratis DECIMAL(10,2);
    
    SELECT CAST(valor AS DECIMAL(10,2)) INTO v_minimo_gratis 
    FROM configuracion WHERE clave = 'domicilio_gratis_desde';
    
    SELECT CAST(valor AS DECIMAL(10,2)) INTO v_costo_domicilio 
    FROM configuracion WHERE clave = 'costo_domicilio';
    
    IF p_subtotal >= v_minimo_gratis THEN
        RETURN 0;
    ELSE
        RETURN v_costo_domicilio;
    END IF;
END//

-- Función: Generar número de orden
CREATE FUNCTION fn_generar_numero_orden()
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE v_fecha VARCHAR(8);
    DECLARE v_consecutivo INT;
    
    SET v_fecha = DATE_FORMAT(NOW(), '%Y%m%d');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_orden, 10) AS UNSIGNED)), 0) + 1
    INTO v_consecutivo
    FROM ordenes
    WHERE SUBSTRING(numero_orden, 1, 8) = v_fecha;
    
    RETURN CONCAT(v_fecha, '-', LPAD(v_consecutivo, 4, '0'));
END//

DELIMITER ;

-- =============================================
-- 9. GRANT DE PERMISOS (para XAMPP local)
-- =============================================
-- En MySQL root:
-- CREATE USER IF NOT EXISTS 'krokori_user'@'localhost' IDENTIFIED BY 'krokori_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON krokori_db.* TO 'krokori_user'@'localhost';
-- FLUSH PRIVILEGES;

-- =============================================
-- FIN DEL SCRIPT
-- =============================================
-- Para ejecutar en XAMPP:
-- 1. Abrir phpMyAdmin
-- 2. Importar este archivo .sql
-- 3. ¡Listo! La base de datos está configurada
-- =============================================
