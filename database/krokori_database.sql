-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 20, 2026 at 06:28 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `krokori_db`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_confirmar_pago_orden` (IN `p_id_orden` INT)   BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_dashboard_stats` ()   BEGIN
    SELECT 
        (SELECT COUNT(*) FROM ordenes WHERE DATE(created_at) = CURDATE() AND estado != 'cancelado') as ordenes_hoy,
        (SELECT COALESCE(SUM(total), 0) FROM ordenes WHERE DATE(created_at) = CURDATE() AND estado NOT IN ('cancelado', 'pendiente')) as ventas_hoy,
        (SELECT COUNT(*) FROM ordenes WHERE estado IN ('pendiente', 'pagado', 'preparando')) as ordenes_activas,
        (SELECT COUNT(*) FROM productos WHERE disponible = 1 AND activo = 1) as productos_disponibles,
        (SELECT COUNT(*) FROM usuarios WHERE rol = 'cliente' AND DATE(fecha_registro) = CURDATE()) as nuevos_clientes_hoy,
        (SELECT COUNT(*) FROM ordenes WHERE estado = 'pendiente') as ordenes_pendientes_pago;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ordenes_activas` ()   BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_productos_mas_vendidos` (IN `limite` INT, IN `fecha_desde` DATE, IN `fecha_hasta` DATE)   BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_reporte_ventas_diarias` (IN `fecha_param` DATE)   BEGIN
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
END$$

--
-- Functions
--
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_calcular_costo_domicilio` (`p_subtotal` DECIMAL(10,2)) RETURNS DECIMAL(10,2) DETERMINISTIC BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `fn_generar_numero_orden` () RETURNS VARCHAR(20) CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci DETERMINISTIC BEGIN
    DECLARE v_fecha VARCHAR(8);
    DECLARE v_consecutivo INT;
    
    SET v_fecha = DATE_FORMAT(NOW(), '%Y%m%d');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_orden, 10) AS UNSIGNED)), 0) + 1
    INTO v_consecutivo
    FROM ordenes
    WHERE SUBSTRING(numero_orden, 1, 8) = v_fecha;
    
    RETURN CONCAT(v_fecha, '-', LPAD(v_consecutivo, 4, '0'));
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `canasta`
--

CREATE TABLE `canasta` (
  `id_canasta` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `session_id` varchar(100) DEFAULT NULL COMMENT 'Para usuarios no registrados',
  `producto_id` int(10) UNSIGNED NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Table structure for table `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `icono` varchar(50) DEFAULT NULL,
  `orden` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`, `slug`, `descripcion`, `imagen`, `icono`, `orden`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Pizzas', 'pizzas', 'Nuestras pizzas artesanales elaboradas con masa madre y horneadas en horno de leña', NULL, '🍕', 1, 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(2, 'Hamburguesas', 'hamburguesas', 'Jugosas hamburguesas artesanales con carne de res 100% colombiana', NULL, '🍔', 2, 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(3, 'Pastas', 'pastas', 'Pastas frescas hechas en casa con las mejores salsas', NULL, '🍝', 3, 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(4, 'Bebidas', 'bebidas', 'Refrescantes bebidas para acompañar tu comida', NULL, '🥤', 4, 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(5, 'Postres', 'postres', 'Dulces tentaciones para terminar tu comida', NULL, '🍰', 5, 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(6, 'Ensaladas', 'ensaladas', 'Frescas ensaladas con ingredientes orgánicos', NULL, '🥗', 6, 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55');

-- --------------------------------------------------------

--
-- Table structure for table `configuracion`
--

CREATE TABLE `configuracion` (
  `id_config` int(10) UNSIGNED NOT NULL,
  `clave` varchar(100) NOT NULL,
  `valor` text DEFAULT NULL,
  `grupo` enum('general','horarios','pagos','social','seo') NOT NULL DEFAULT 'general',
  `tipo` enum('text','number','boolean','json') NOT NULL DEFAULT 'text',
  `editable` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `configuracion`
--

INSERT INTO `configuracion` (`id_config`, `clave`, `valor`, `grupo`, `tipo`, `editable`, `created_at`, `updated_at`) VALUES
(1, 'nombre_restaurante', 'Krokori', 'general', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(2, 'slogan', 'La mejor pizza de Bogotá', 'general', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(3, 'telefono', '300-904-7298', 'general', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(4, 'telefono_secundario', '313-384-4720', 'general', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(5, 'email', 'info@krokori.com', 'general', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(6, 'direccion', 'Bogotá, Colombia', 'general', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(7, 'ciudad', 'Bogotá', 'general', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(8, 'domicilio_gratis_desde', '70000', 'general', 'number', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(9, 'costo_domicilio', '5000', 'general', 'number', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(10, 'tiempo_minimo_domicilio', '30', 'general', 'number', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(11, 'facebook_url', 'https://facebook.com/krokori', 'social', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(12, 'instagram_url', 'https://instagram.com/krokori', 'social', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(13, 'twitter_url', '', 'social', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(14, 'whatsapp', '573009047298', 'social', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(15, 'meta_title', 'Krokori - Pizzería Artesanal en Bogotá', 'seo', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(16, 'meta_description', 'Las mejores pizzas artesanales de Bogotá. Domicilio gratis por compras de $70.000. ¡Ordena ahora!', 'seo', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(17, 'meta_keywords', 'pizza bogota, pizzeria, domicilio pizza, hamburguesas, pizza artesanal', 'seo', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(18, 'wompi_public_key', '', 'pagos', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(19, 'wompi_private_key', '', 'pagos', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(20, 'wompi_currency', 'COP', 'pagos', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(21, 'wompi_environment', 'test', 'pagos', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(22, 'logo_url', '/images/logo.png', 'general', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(23, 'favicon_url', '/images/favicon.ico', 'general', 'text', 1, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(24, 'horario_apertura', '10:09', 'general', 'text', 1, '2026-03-20 14:48:51', '2026-03-20 17:17:47'),
(25, 'horario_cierre', '12:20', 'general', 'text', 1, '2026-03-20 14:48:51', '2026-03-20 17:17:27');

-- --------------------------------------------------------

--
-- Table structure for table `contactos`
--

CREATE TABLE `contactos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `servicio` varchar(255) DEFAULT '',
  `mensaje` text NOT NULL,
  `leido` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contactos`
--

INSERT INTO `contactos` (`id`, `nombre`, `email`, `servicio`, `mensaje`, `leido`, `created_at`) VALUES
(1, 'omar', 'fernandomenesesda@gmail.com', 'Cenar en el Restaurante', 'prueba', 1, '2026-03-20 10:51:35');

-- --------------------------------------------------------

--
-- Table structure for table `direcciones`
--

CREATE TABLE `direcciones` (
  `id_direccion` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `direccion` text NOT NULL,
  `barrio` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) NOT NULL DEFAULT 'Bogotá',
  `referencia` text DEFAULT NULL,
  `latitud` decimal(10,8) DEFAULT NULL,
  `longitud` decimal(11,8) DEFAULT NULL,
  `es_predeterminada` tinyint(1) NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `horarios`
--

CREATE TABLE `horarios` (
  `id_horario` int(10) UNSIGNED NOT NULL,
  `dia_semana` enum('lunes','martes','miercoles','jueves','viernes','sabado','domingo') NOT NULL,
  `hora_apertura` time NOT NULL,
  `hora_cierre` time NOT NULL,
  `hora_apertura_domicilio` time DEFAULT NULL COMMENT 'Horario especial para domicilio',
  `hora_cierre_domicilio` time DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `cerrado` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Día cerrado (vacaciones)',
  `motivo_cierre` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `horarios`
--

INSERT INTO `horarios` (`id_horario`, `dia_semana`, `hora_apertura`, `hora_cierre`, `hora_apertura_domicilio`, `hora_cierre_domicilio`, `activo`, `cerrado`, `motivo_cierre`, `created_at`, `updated_at`) VALUES
(1, 'lunes', '12:00:00', '22:00:00', NULL, NULL, 1, 0, NULL, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(2, 'martes', '12:00:00', '22:00:00', NULL, NULL, 1, 0, NULL, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(3, 'miercoles', '12:00:00', '22:00:00', NULL, NULL, 1, 0, NULL, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(4, 'jueves', '12:00:00', '22:00:00', NULL, NULL, 1, 0, NULL, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(5, 'viernes', '12:00:00', '23:00:00', NULL, NULL, 1, 0, NULL, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(6, 'sabado', '12:00:00', '23:00:00', NULL, NULL, 1, 0, NULL, '2026-03-20 12:19:55', '2026-03-20 12:19:55'),
(7, 'domingo', '13:00:00', '21:00:00', NULL, NULL, 1, 0, NULL, '2026-03-20 12:19:55', '2026-03-20 12:19:55');

-- --------------------------------------------------------

--
-- Table structure for table `logs_sistema`
--

CREATE TABLE `logs_sistema` (
  `id_log` bigint(20) UNSIGNED NOT NULL,
  `tabla_afectada` varchar(50) NOT NULL,
  `id_registro` int(10) UNSIGNED DEFAULT NULL,
  `accion` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `datos_anteriores` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_anteriores`)),
  `datos_nuevos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_nuevos`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `usuario_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `logs_sistema`
--

INSERT INTO `logs_sistema` (`id_log`, `tabla_afectada`, `id_registro`, `accion`, `datos_anteriores`, `datos_nuevos`, `ip_address`, `user_agent`, `usuario_id`, `created_at`) VALUES
(1, 'usuarios', 1, 'INSERT', NULL, '{\"email\": \"admin@krokori.com\", \"rol\": \"admin\"}', NULL, NULL, NULL, '2026-03-20 12:19:55'),
(2, 'usuarios', 2, 'INSERT', NULL, '{\"email\": \"fernandomenesesda@gmail.com\", \"rol\": \"cliente\"}', NULL, NULL, NULL, '2026-03-20 12:27:06'),
(3, 'productos', 18, 'UPDATE', '{\"precio\": 3000.00, \"disponible\": 1, \"nombre\": \"Agua Mineral\"}', '{\"precio\": 3000.00, \"disponible\": 1, \"nombre\": \"Agua Mineral\"}', NULL, NULL, NULL, '2026-03-20 13:24:19'),
(4, 'productos', 17, 'UPDATE', '{\"precio\": 12000.00, \"disponible\": 1, \"nombre\": \"Cerveza Artesanal\"}', '{\"precio\": 12000.00, \"disponible\": 1, \"nombre\": \"Cerveza Artesanal\"}', NULL, NULL, NULL, '2026-03-20 13:24:19'),
(5, 'ordenes', 1, 'UPDATE', '{\"estado\": \"pendiente\", \"updated_at\": \"2026-03-20 08:24:19\"}', '{\"estado\": \"pagado\", \"updated_at\": \"2026-03-20 08:26:57\"}', NULL, NULL, NULL, '2026-03-20 13:26:57'),
(6, 'ordenes', 1, 'UPDATE', '{\"estado\": \"pagado\", \"updated_at\": \"2026-03-20 08:26:57\"}', '{\"estado\": \"confirmado\", \"updated_at\": \"2026-03-20 08:27:00\"}', NULL, NULL, NULL, '2026-03-20 13:27:00'),
(7, 'ordenes', 1, 'UPDATE', '{\"estado\": \"confirmado\", \"updated_at\": \"2026-03-20 08:27:00\"}', '{\"estado\": \"preparando\", \"updated_at\": \"2026-03-20 08:27:03\"}', NULL, NULL, NULL, '2026-03-20 13:27:03'),
(8, 'ordenes', 1, 'UPDATE', '{\"estado\": \"preparando\", \"updated_at\": \"2026-03-20 08:27:03\"}', '{\"estado\": \"listo\", \"updated_at\": \"2026-03-20 08:27:04\"}', NULL, NULL, NULL, '2026-03-20 13:27:04'),
(9, 'ordenes', 1, 'UPDATE', '{\"estado\": \"listo\", \"updated_at\": \"2026-03-20 08:27:04\"}', '{\"estado\": \"en_camino\", \"updated_at\": \"2026-03-20 08:27:06\"}', NULL, NULL, NULL, '2026-03-20 13:27:06'),
(10, 'ordenes', 1, 'UPDATE', '{\"estado\": \"en_camino\", \"updated_at\": \"2026-03-20 08:27:06\"}', '{\"estado\": \"entregado\", \"updated_at\": \"2026-03-20 08:27:08\"}', NULL, NULL, NULL, '2026-03-20 13:27:08'),
(11, 'productos', 5, 'UPDATE', '{\"precio\": 29000.00, \"disponible\": 1, \"nombre\": \"BBQ Chicken\"}', '{\"precio\": 29000.00, \"disponible\": 1, \"nombre\": \"BBQ Chicken\"}', NULL, NULL, NULL, '2026-03-20 13:29:15'),
(12, 'ordenes', 2, 'UPDATE', '{\"estado\": \"pendiente\", \"updated_at\": \"2026-03-20 08:29:15\"}', '{\"estado\": \"confirmado\", \"updated_at\": \"2026-03-20 08:29:41\"}', NULL, NULL, NULL, '2026-03-20 13:29:41'),
(13, 'ordenes', 2, 'UPDATE', '{\"estado\": \"confirmado\", \"updated_at\": \"2026-03-20 08:29:41\"}', '{\"estado\": \"preparando\", \"updated_at\": \"2026-03-20 08:29:46\"}', NULL, NULL, NULL, '2026-03-20 13:29:46'),
(14, 'productos', 18, 'UPDATE', '{\"precio\": 3000.00, \"disponible\": 1, \"nombre\": \"Agua Mineral\"}', '{\"precio\": 3000.00, \"disponible\": 1, \"nombre\": \"Agua Mineral\"}', NULL, NULL, NULL, '2026-03-20 13:36:42'),
(15, 'productos', 5, 'UPDATE', '{\"precio\": 29000.00, \"disponible\": 1, \"nombre\": \"BBQ Chicken\"}', '{\"precio\": 29000.00, \"disponible\": 1, \"nombre\": \"BBQ Chicken\"}', NULL, NULL, NULL, '2026-03-20 13:37:19'),
(16, 'ordenes', 3, 'UPDATE', '{\"estado\": \"pendiente\", \"updated_at\": \"2026-03-20 08:36:42\"}', '{\"estado\": \"pagado\", \"updated_at\": \"2026-03-20 08:45:41\"}', NULL, NULL, NULL, '2026-03-20 13:45:41'),
(17, 'ordenes', 3, 'UPDATE', '{\"estado\": \"pagado\", \"updated_at\": \"2026-03-20 08:45:41\"}', '{\"estado\": \"confirmado\", \"updated_at\": \"2026-03-20 08:45:46\"}', NULL, NULL, NULL, '2026-03-20 13:45:46'),
(18, 'ordenes', 4, 'UPDATE', '{\"estado\": \"pendiente\", \"updated_at\": \"2026-03-20 08:37:19\"}', '{\"estado\": \"cancelado\", \"updated_at\": \"2026-03-20 08:45:48\"}', NULL, NULL, NULL, '2026-03-20 13:45:48'),
(19, 'productos', 20, 'UPDATE', '{\"precio\": 14000.00, \"disponible\": 1, \"nombre\": \"Brownie con Helado\"}', '{\"precio\": 14000.00, \"disponible\": 1, \"nombre\": \"Brownie con Helado\"}', NULL, NULL, NULL, '2026-03-20 13:52:48'),
(20, 'productos', 23, 'UPDATE', '{\"precio\": 16000.00, \"disponible\": 1, \"nombre\": \"Ensalada Mediterránea\"}', '{\"precio\": 16000.00, \"disponible\": 1, \"nombre\": \"Ensalada Mediterránea\"}', NULL, NULL, NULL, '2026-03-20 15:56:48'),
(21, 'productos', 22, 'UPDATE', '{\"precio\": 18000.00, \"disponible\": 1, \"nombre\": \"Ensalada César\"}', '{\"precio\": 18000.00, \"disponible\": 1, \"nombre\": \"Ensalada César\"}', NULL, NULL, NULL, '2026-03-20 15:57:51'),
(22, 'productos', 21, 'UPDATE', '{\"precio\": 16000.00, \"disponible\": 1, \"nombre\": \"Cheesecake\"}', '{\"precio\": 16000.00, \"disponible\": 1, \"nombre\": \"Cheesecake\"}', NULL, NULL, NULL, '2026-03-20 15:58:28'),
(23, 'productos', 21, 'UPDATE', '{\"precio\": 16000.00, \"disponible\": 1, \"nombre\": \"Cheesecake\"}', '{\"precio\": 16000.00, \"disponible\": 1, \"nombre\": \"Cheesecake\"}', NULL, NULL, NULL, '2026-03-20 15:58:42'),
(24, 'productos', 19, 'UPDATE', '{\"precio\": 15000.00, \"disponible\": 1, \"nombre\": \"Tiramisú\"}', '{\"precio\": 15000.00, \"disponible\": 1, \"nombre\": \"Tiramisú\"}', NULL, NULL, NULL, '2026-03-20 15:59:55'),
(25, 'productos', 18, 'UPDATE', '{\"precio\": 3000.00, \"disponible\": 1, \"nombre\": \"Agua Mineral\"}', '{\"precio\": 3000.00, \"disponible\": 1, \"nombre\": \"Agua Mineral\"}', NULL, NULL, NULL, '2026-03-20 16:01:28'),
(26, 'productos', 17, 'UPDATE', '{\"precio\": 12000.00, \"disponible\": 1, \"nombre\": \"Cerveza Artesanal\"}', '{\"precio\": 12000.00, \"disponible\": 1, \"nombre\": \"Cerveza Artesanal\"}', NULL, NULL, NULL, '2026-03-20 16:03:18'),
(27, 'productos', 14, 'UPDATE', '{\"precio\": 4000.00, \"disponible\": 1, \"nombre\": \"Gaseosa 400ml\"}', '{\"precio\": 4000.00, \"disponible\": 1, \"nombre\": \"Gaseosa 400ml\"}', NULL, NULL, NULL, '2026-03-20 16:04:46'),
(28, 'productos', 16, 'UPDATE', '{\"precio\": 6000.00, \"disponible\": 1, \"nombre\": \"Limonada Natural\"}', '{\"precio\": 6000.00, \"disponible\": 1, \"nombre\": \"Limonada Natural\"}', NULL, NULL, NULL, '2026-03-20 16:09:27'),
(29, 'productos', 15, 'UPDATE', '{\"precio\": 7000.00, \"disponible\": 1, \"nombre\": \"Jugo Natural\"}', '{\"precio\": 7000.00, \"disponible\": 1, \"nombre\": \"Jugo Natural\"}', NULL, NULL, NULL, '2026-03-20 16:10:48'),
(30, 'productos', 13, 'UPDATE', '{\"precio\": 28000.00, \"disponible\": 1, \"nombre\": \"Lasagna Bolognese\"}', '{\"precio\": 28000.00, \"disponible\": 1, \"nombre\": \"Lasagna Bolognese\"}', NULL, NULL, NULL, '2026-03-20 16:11:34'),
(31, 'productos', 12, 'UPDATE', '{\"precio\": 24000.00, \"disponible\": 1, \"nombre\": \"Fettuccine Alfredo\"}', '{\"precio\": 24000.00, \"disponible\": 1, \"nombre\": \"Fettuccine Alfredo\"}', NULL, NULL, NULL, '2026-03-20 16:12:30'),
(32, 'productos', 11, 'UPDATE', '{\"precio\": 22000.00, \"disponible\": 1, \"nombre\": \"Spaghetti Carbonara\"}', '{\"precio\": 22000.00, \"disponible\": 1, \"nombre\": \"Spaghetti Carbonara\"}', NULL, NULL, NULL, '2026-03-20 16:13:12'),
(33, 'productos', 10, 'UPDATE', '{\"precio\": 20000.00, \"disponible\": 1, \"nombre\": \"Chicken Crispy\"}', '{\"precio\": 20000.00, \"disponible\": 1, \"nombre\": \"Chicken Crispy\"}', NULL, NULL, NULL, '2026-03-20 16:18:00'),
(34, 'productos', 9, 'UPDATE', '{\"precio\": 23000.00, \"disponible\": 1, \"nombre\": \"Bacon Ultimate\"}', '{\"precio\": 23000.00, \"disponible\": 1, \"nombre\": \"Bacon Ultimate\"}', NULL, NULL, NULL, '2026-03-20 16:21:28'),
(35, 'productos', 8, 'UPDATE', '{\"precio\": 25000.00, \"disponible\": 1, \"nombre\": \"Doble Carne\"}', '{\"precio\": 25000.00, \"disponible\": 1, \"nombre\": \"Doble Carne\"}', NULL, NULL, NULL, '2026-03-20 16:22:46'),
(36, 'productos', 10, 'UPDATE', '{\"precio\": 20000.00, \"disponible\": 1, \"nombre\": \"Chicken Crispy\"}', '{\"precio\": 20000.00, \"disponible\": 1, \"nombre\": \"Chicken Crispy\"}', NULL, NULL, NULL, '2026-03-20 16:26:54'),
(37, 'productos', 7, 'UPDATE', '{\"precio\": 18000.00, \"disponible\": 1, \"nombre\": \"Clásica Americana\"}', '{\"precio\": 18000.00, \"disponible\": 1, \"nombre\": \"Clásica Americana\"}', NULL, NULL, NULL, '2026-03-20 16:28:13'),
(38, 'productos', 6, 'UPDATE', '{\"precio\": 25000.00, \"disponible\": 1, \"nombre\": \"Vegetariana Fresh\"}', '{\"precio\": 25000.00, \"disponible\": 1, \"nombre\": \"Vegetariana Fresh\"}', NULL, NULL, NULL, '2026-03-20 16:28:59'),
(39, 'productos', 5, 'UPDATE', '{\"precio\": 29000.00, \"disponible\": 1, \"nombre\": \"BBQ Chicken\"}', '{\"precio\": 29000.00, \"disponible\": 1, \"nombre\": \"BBQ Chicken\"}', NULL, NULL, NULL, '2026-03-20 16:31:07'),
(40, 'productos', 4, 'UPDATE', '{\"precio\": 32000.00, \"disponible\": 1, \"nombre\": \"Quattro Formaggi\"}', '{\"precio\": 32000.00, \"disponible\": 1, \"nombre\": \"Quattro Formaggi\"}', NULL, NULL, NULL, '2026-03-20 16:32:29'),
(41, 'productos', 3, 'UPDATE', '{\"precio\": 26000.00, \"disponible\": 1, \"nombre\": \"Hawaiana Tropical\"}', '{\"precio\": 26000.00, \"disponible\": 1, \"nombre\": \"Hawaiana Tropical\"}', NULL, NULL, NULL, '2026-03-20 16:35:43'),
(42, 'productos', 3, 'UPDATE', '{\"precio\": 26000.00, \"disponible\": 1, \"nombre\": \"Hawaiana Tropical\"}', '{\"precio\": 26000.00, \"disponible\": 1, \"nombre\": \"Hawaiana Tropical\"}', NULL, NULL, NULL, '2026-03-20 16:36:45'),
(43, 'productos', 2, 'UPDATE', '{\"precio\": 28000.00, \"disponible\": 1, \"nombre\": \"Pepperoni Supreme\"}', '{\"precio\": 28000.00, \"disponible\": 1, \"nombre\": \"Pepperoni Supreme\"}', NULL, NULL, NULL, '2026-03-20 16:38:23'),
(44, 'productos', 1, 'UPDATE', '{\"precio\": 24000.00, \"disponible\": 1, \"nombre\": \"Margherita Clásica\"}', '{\"precio\": 24000.00, \"disponible\": 1, \"nombre\": \"Margherita Clásica\"}', NULL, NULL, NULL, '2026-03-20 16:39:01');

-- --------------------------------------------------------

--
-- Table structure for table `ordenes`
--

CREATE TABLE `ordenes` (
  `id_orden` int(10) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED DEFAULT NULL,
  `repartidor_id` int(10) UNSIGNED DEFAULT NULL,
  `numero_orden` varchar(20) NOT NULL,
  `estado` enum('pendiente','pagado','confirmado','preparando','listo','en_camino','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
  `nombre_cliente` varchar(100) DEFAULT NULL,
  `telefono_cliente` varchar(20) DEFAULT NULL,
  `email_cliente` varchar(255) DEFAULT NULL,
  `direccion_entrega` text NOT NULL,
  `barrio` varchar(100) DEFAULT NULL,
  `referencia_direccion` text DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `costo_domicilio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `descuento` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `metodo_pago` enum('wompi','nequi','daviplata','contra_entrega') NOT NULL,
  `estado_pago` enum('pendiente','pagado','fallido','reembolsado') NOT NULL DEFAULT 'pendiente',
  `notas` text DEFAULT NULL,
  `observaciones_admin` text DEFAULT NULL,
  `fecha_entrega_estimada` datetime DEFAULT NULL,
  `fecha_entrega_real` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `ordenes`
--

INSERT INTO `ordenes` (`id_orden`, `usuario_id`, `repartidor_id`, `numero_orden`, `estado`, `nombre_cliente`, `telefono_cliente`, `email_cliente`, `direccion_entrega`, `barrio`, `referencia_direccion`, `subtotal`, `costo_domicilio`, `descuento`, `total`, `metodo_pago`, `estado_pago`, `notas`, `observaciones_admin`, `fecha_entrega_estimada`, `fecha_entrega_real`, `created_at`, `updated_at`) VALUES
(1, 2, NULL, 'ORD-1774013058997-GW', 'entregado', 'Omar', '3133677048', 'fernandomenesesda@gmail.com', 'cra 123 4 56', 'suba', 'tr ', 15000.00, 5000.00, 0.00, 20000.00, 'contra_entrega', 'pendiente', NULL, NULL, NULL, '2026-03-20 08:27:08', '2026-03-20 13:24:19', '2026-03-20 13:27:08'),
(2, 2, NULL, 'ORD-1774013355573-YJ', 'preparando', 'Omar', '3133677048', 'fernandomenesesda@gmail.com', 'cra 123 4 56', '1', '123', 87000.00, 0.00, 0.00, 87000.00, 'contra_entrega', 'pendiente', NULL, NULL, NULL, NULL, '2026-03-20 13:29:15', '2026-03-20 13:29:46'),
(3, 2, NULL, 'ORD-1774013802806-2N', 'confirmado', 'Omar', '3133677048', 'fernandomenesesda@gmail.com', 'cra 123 4 56', '1', '23', 3000.00, 5000.00, 0.00, 8000.00, 'contra_entrega', 'pendiente', NULL, NULL, NULL, NULL, '2026-03-20 13:36:42', '2026-03-20 13:45:46'),
(4, 2, NULL, 'ORD-1774013839588-30', 'cancelado', 'Omar', '3133677048', 'fernandomenesesda@gmail.com', 'cra 124 56 8', '1', '23', 29000.00, 5000.00, 0.00, 34000.00, 'contra_entrega', 'pendiente', NULL, NULL, NULL, NULL, '2026-03-20 13:37:19', '2026-03-20 13:45:48');

--
-- Triggers `ordenes`
--
DELIMITER $$
CREATE TRIGGER `tr_ordenes_after_update` AFTER UPDATE ON `ordenes` FOR EACH ROW BEGIN
    IF OLD.estado != NEW.estado THEN
        INSERT INTO logs_sistema (tabla_afectada, id_registro, accion, datos_anteriores, datos_nuevos)
        VALUES ('ordenes', NEW.id_orden, 'UPDATE',
                JSON_OBJECT('estado', OLD.estado, 'updated_at', OLD.updated_at),
                JSON_OBJECT('estado', NEW.estado, 'updated_at', NEW.updated_at));
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `orden_detalles`
--

CREATE TABLE `orden_detalles` (
  `id_detalle` int(10) UNSIGNED NOT NULL,
  `orden_id` int(10) UNSIGNED NOT NULL,
  `producto_id` int(10) UNSIGNED NOT NULL,
  `cantidad` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `orden_detalles`
--

INSERT INTO `orden_detalles` (`id_detalle`, `orden_id`, `producto_id`, `cantidad`, `precio_unitario`, `subtotal`, `observaciones`, `created_at`) VALUES
(1, 1, 18, 1, 3000.00, 3000.00, NULL, '2026-03-20 13:24:19'),
(2, 1, 17, 1, 12000.00, 12000.00, NULL, '2026-03-20 13:24:19'),
(3, 2, 5, 3, 29000.00, 87000.00, NULL, '2026-03-20 13:29:15'),
(4, 3, 18, 1, 3000.00, 3000.00, NULL, '2026-03-20 13:36:42'),
(5, 4, 5, 1, 29000.00, 29000.00, NULL, '2026-03-20 13:37:19');

--
-- Triggers `orden_detalles`
--
DELIMITER $$
CREATE TRIGGER `tr_detalle_before_insert` BEFORE INSERT ON `orden_detalles` FOR EACH ROW BEGIN
    DECLARE stock_actual INT;
    
    SELECT stock INTO stock_actual
    FROM productos
    WHERE id_producto = NEW.producto_id;
    
    IF stock_actual < NEW.cantidad THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Stock insuficiente para este producto';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(10) UNSIGNED NOT NULL,
  `orden_id` int(10) UNSIGNED NOT NULL,
  `referencia_wompi` varchar(100) DEFAULT NULL,
  `tipo_transaccion` enum('wompi','nequi','daviplata','contra_entrega') NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `estado` enum('pendiente','completado','fallido','reembolsado') NOT NULL DEFAULT 'pendiente',
  `mensaje_respuesta` text DEFAULT NULL,
  `metodo_pago_detallado` varchar(50) DEFAULT NULL COMMENT 'wompi_card, wompi_PSE, etc',
  `idempotency_key` varchar(255) DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(10) UNSIGNED NOT NULL,
  `categoria_id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `precio_oferta` decimal(10,2) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `ingredientes` text DEFAULT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT 1,
  `destacado` tinyint(1) NOT NULL DEFAULT 0,
  `tiempo_preparacion` int(10) UNSIGNED DEFAULT 15 COMMENT 'Minutos',
  `calories` int(10) UNSIGNED DEFAULT NULL,
  `stock` int(10) UNSIGNED NOT NULL DEFAULT 100,
  `orden` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `productos`
--

INSERT INTO `productos` (`id_producto`, `categoria_id`, `nombre`, `slug`, `descripcion`, `precio`, `precio_oferta`, `imagen`, `ingredientes`, `disponible`, `destacado`, `tiempo_preparacion`, `calories`, `stock`, `orden`, `activo`, `created_at`, `updated_at`) VALUES
(1, 1, 'Margherita Clásica', 'margherita-clasica', 'La pizza italiana tradicional con tomate San Marzano, mozzarella fresca y albahaca', 24000.00, NULL, '/uploads/1774024739986-0xpb60.jpg', 'Salsa de tomate, mozzarella, albahaca fresca, aceite de oliva', 1, 1, 15, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:39:01'),
(2, 1, 'Pepperoni Supreme', 'pepperoni-supreme', 'Doble porción de pepperoni artesanal con mozzarella derretida', 28000.00, 25000.00, '/uploads/1774024701494-bl2n7f.jpg', 'Salsa de tomate, mozzarella, doble pepperoni, orégano', 1, 1, 15, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:38:23'),
(3, 1, 'Hawaiana Tropical', 'hawaiana-tropical', 'Clásica combinación de jamón ahumado y piña fresca', 26000.00, NULL, '/uploads/1774024603343-u4ulff.jpg', 'Salsa de tomate, mozzarella, jamón, piña, cerezas', 1, 0, 15, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:36:45'),
(4, 1, 'Quattro Formaggi', 'quattro-formaggi', 'Pizza de cuatro quesos: mozzarella, gorgonzola, parmesano y ricotta', 32000.00, NULL, '/uploads/1774024347204-peej3j.webp', 'Mozzarella, gorgonzola, parmesano, ricotta, nuez moscada', 1, 1, 18, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:32:29'),
(5, 1, 'BBQ Chicken', 'bbq-chicken', 'Pollo desmechado en salsa BBQ con tocino crujiente', 29000.00, NULL, '/uploads/1774024265757-uij0f0.jpg', 'Salsa BBQ, pollo, mozzarella, tocino, cebolla roja', 1, 1, 18, NULL, 96, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:31:07'),
(6, 1, 'Vegetariana Fresh', 'vegetariana-fresh', 'Selección de verduras frescas de temporada', 25000.00, NULL, '/uploads/1774024137813-43ab0j.webp', 'Pimiento, champiñón, aceituna, cebolla, tomate, espinaca', 1, 0, 15, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:28:59'),
(7, 2, 'Clásica Americana', 'clasica-americana', 'Hamburguesa tradicional con carne 200g, queso cheddar y vegetales frescos', 18000.00, NULL, '/uploads/1774024090955-ks6u7j.webp', 'Carne de res 200g, queso cheddar, lechuga, tomate, cebolla, pepinillos', 1, 1, 12, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:28:13'),
(8, 2, 'Doble Carne', 'doble-carne', 'Para los más hambrientos - doble carne 200g cada una', 25000.00, 22000.00, '/uploads/1774023765262-anef7j.jpg', '2 carnes de res 200g, doble queso cheddar, tocino, cebolla caramelizada', 1, 1, 15, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:22:46'),
(9, 2, 'Bacon Ultimate', 'bacon-ultimate', 'Triple tocino con cheddar derretido y salsa especial', 23000.00, NULL, '/uploads/1774023686087-t2c36e.webp', 'Carne 200g, triple tocino, cheddar, salsa BBQ, cebolla crispy', 1, 1, 12, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:21:28'),
(10, 2, 'Chicken Crispy', 'chicken-crispy', 'Pechuga empanizada crujiente con salsa ranch', 20000.00, NULL, '/uploads/1774024012986-2swv84.jpg', 'Pechuga empanizada, lechuga, tomate, salsa ranch', 1, 0, 12, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:26:54'),
(11, 3, 'Spaghetti Carbonara', 'spaghetti-carbonara', 'Pasta fresca con salsa carbonara auténtica italiana', 22000.00, NULL, '/uploads/1774023191035-8cfc6r.jpg', 'Spaghetti, yolk, pecorino, guanciale, pimienta negra', 1, 1, 20, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:13:12'),
(12, 3, 'Fettuccine Alfredo', 'fettuccine-alfredo', 'Crema de parmesano con fettuccine recién hecho', 24000.00, NULL, '/uploads/1774023148800-zayna0.jpg', 'Fettuccine, crema de leche, parmesano, mantequilla, ajo', 1, 1, 18, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:12:30'),
(13, 3, 'Lasagna Bolognese', 'lasagna-bolognese', 'Lasagna casera con ragú boloñesa y bechamel', 28000.00, NULL, '/uploads/1774023091971-zfcoux.webp', 'Láminas de pasta, ragú boloñesa, bechamel, mozzarella', 1, 1, 25, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:11:34'),
(14, 4, 'Gaseosa 400ml', 'gaseosa-400ml', 'Gaseosa de tu preferencia', 4000.00, NULL, '/uploads/1774022683851-uuzko6.webp', NULL, 1, 0, 2, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:04:46'),
(15, 4, 'Jugo Natural', 'jugo-natural', 'Jugo natural de frutas frescas', 7000.00, NULL, '/uploads/1774023046422-dx6nt7.jpg', 'Fruta de temporada', 1, 0, 3, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:10:48'),
(16, 4, 'Limonada Natural', 'limonada-natural', 'Limonada recién exprimida con hierbabuena', 6000.00, NULL, '/uploads/1774022964722-o0zebz.jpg', 'Limón, agua, azúcar, hierbabuena', 1, 1, 3, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:09:27'),
(17, 4, 'Cerveza Artesanal', 'cerveza-artesanal', 'Cerveza artesanal de malta colombiana', 12000.00, NULL, '/uploads/1774022596947-mqjpnh.jpg', NULL, 1, 0, 2, NULL, 99, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:03:18'),
(18, 4, 'Agua Mineral', 'agua-mineral', 'Agua mineral sin gas', 3000.00, NULL, '/uploads/1774022485944-xt2xxh.webp', NULL, 1, 0, 1, NULL, 98, 0, 1, '2026-03-20 12:19:55', '2026-03-20 16:01:28'),
(19, 5, 'Tiramisú', 'tiramisu', 'Clásico postre italiano con café y mascarpone', 15000.00, NULL, '/uploads/1774022393393-lvomk4.jpg', 'Bizcocho, café espresso, mascarpone, cacao', 1, 1, 5, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 15:59:55'),
(20, 5, 'Brownie con Helado', 'brownie-con-helado', 'Brownie tibio de chocolate con bola de helado de vainilla', 14000.00, NULL, '/uploads/1774014765712-thrh6a.webp', 'Brownie chocolate, helado vainilla, salsa chocolate', 1, 1, 8, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 13:52:48'),
(21, 5, 'Cheesecake', 'cheesecake', 'Cheesecake de queso crema con topping de frutos rojos', 16000.00, NULL, '/uploads/1774022320309-0l5oas.jpg', 'Base galleta, queso crema, frutos rojos', 1, 0, 5, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 15:58:42'),
(22, 6, 'Ensalada César', 'ensalada-cesar', 'Lechuga romana, pollo a la plancha, crutones y aderezo César', 18000.00, NULL, '/uploads/1774022269119-hcicgr.jpg', 'Lechuga romana, pollo, crutones, parmesano, aderezo César', 1, 1, 8, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 15:57:51'),
(23, 6, 'Ensalada Mediterránea', 'ensalada-mediterranea', 'Mezcla de hojas verdes con tomate cherry, aceitunas y feta', 16000.00, NULL, '/uploads/1774022207010-mx4kg1.jpg', 'Mezcla hojas verdes, tomate cherry, aceituna, queso feta, aceite oliva', 1, 0, 8, NULL, 100, 0, 1, '2026-03-20 12:19:55', '2026-03-20 15:56:48');

--
-- Triggers `productos`
--
DELIMITER $$
CREATE TRIGGER `tr_productos_after_delete` AFTER DELETE ON `productos` FOR EACH ROW BEGIN
    INSERT INTO logs_sistema (tabla_afectada, id_registro, accion, datos_anteriores)
    VALUES ('productos', OLD.id_producto, 'DELETE',
            JSON_OBJECT('nombre', OLD.nombre, 'precio', OLD.precio));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tr_productos_after_update` AFTER UPDATE ON `productos` FOR EACH ROW BEGIN
    INSERT INTO logs_sistema (tabla_afectada, id_registro, accion, datos_anteriores, datos_nuevos)
    VALUES ('productos', NEW.id_producto, 'UPDATE', 
            JSON_OBJECT('precio', OLD.precio, 'disponible', OLD.disponible, 'nombre', OLD.nombre),
            JSON_OBJECT('precio', NEW.precio, 'disponible', NEW.disponible, 'nombre', NEW.nombre));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tokens_refresh`
--

CREATE TABLE `tokens_refresh` (
  `id_token` bigint(20) UNSIGNED NOT NULL,
  `usuario_id` int(10) UNSIGNED NOT NULL,
  `token` varchar(255) NOT NULL,
  `expira_en` datetime NOT NULL,
  `usado` tinyint(1) NOT NULL DEFAULT 0,
  `invalidado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tokens_refresh`
--

INSERT INTO `tokens_refresh` (`id_token`, `usuario_id`, `token`, `expira_en`, `usado`, `invalidado`, `created_at`) VALUES
(1, 2, '37635ccc-f1f7-402e-8fb8-a8a5aca48e76', '2026-03-27 07:27:06', 0, 0, '2026-03-20 12:27:06'),
(2, 2, 'df06d985-c303-4cbc-b18c-ba78fa255784', '2026-03-27 07:27:41', 0, 0, '2026-03-20 12:27:41'),
(3, 1, '5104e41a-af3e-42c7-b3a9-c066c0e7e633', '2026-03-27 07:36:46', 0, 0, '2026-03-20 12:36:46'),
(4, 1, '11504a33-c136-4569-814c-eb8a9809bd18', '2026-03-27 07:44:28', 0, 0, '2026-03-20 12:44:28'),
(5, 2, '3a78ba14-656a-4ff3-834a-78be6e82e362', '2026-03-27 07:57:33', 0, 0, '2026-03-20 12:57:33'),
(6, 2, '1a18c4e8-4fe9-41e0-b1e3-df4d19e90ca1', '2026-03-27 08:10:43', 0, 0, '2026-03-20 13:10:43'),
(7, 1, '58baec1c-56bd-48c2-8728-6dc2553f431e', '2026-03-27 08:17:25', 0, 0, '2026-03-20 13:17:25');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `rol` enum('admin','cliente','repartidor') NOT NULL DEFAULT 'cliente',
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `email_verificado` tinyint(1) NOT NULL DEFAULT 0,
  `token_recuperacion` varchar(255) DEFAULT NULL,
  `ultimo_login` datetime DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `email`, `password_hash`, `nombre`, `telefono`, `rol`, `activo`, `email_verificado`, `token_recuperacion`, `ultimo_login`, `fecha_registro`, `updated_at`) VALUES
(1, 'admin@krokori.com', '$2y$10$mqCrsmFECd4IRtR0iTsV5e3jmdpebKBMQeeZaEmZctOBLeBsysfA.', 'Administrador', '3000000000', 'admin', 1, 1, NULL, '2026-03-20 08:17:25', '2026-03-20 12:19:55', '2026-03-20 13:17:25'),
(2, 'fernandomenesesda@gmail.com', '$2b$12$.dQ9xj961PbdCM1a5eWxeuexzA5/QHYVu32FXvDTm3WPxtTW654RS', 'Omar', '3133677048', 'cliente', 1, 0, NULL, '2026-03-20 08:10:43', '2026-03-20 12:27:06', '2026-03-20 13:10:43');

--
-- Triggers `usuarios`
--
DELIMITER $$
CREATE TRIGGER `tr_usuarios_after_insert` AFTER INSERT ON `usuarios` FOR EACH ROW BEGIN
    INSERT INTO logs_sistema (tabla_afectada, id_registro, accion, datos_nuevos)
    VALUES ('usuarios', NEW.id_usuario, 'INSERT',
            JSON_OBJECT('email', NEW.email, 'rol', NEW.rol));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_ordenes_completas`
-- (See below for the actual view)
--
CREATE TABLE `v_ordenes_completas` (
`id_orden` int(10) unsigned
,`numero_orden` varchar(20)
,`estado` enum('pendiente','pagado','confirmado','preparando','listo','en_camino','entregado','cancelado')
,`estado_pago` enum('pendiente','pagado','fallido','reembolsado')
,`total` decimal(10,2)
,`fecha_orden` timestamp
,`fecha_entrega_estimada` datetime
,`nombre_cliente` varchar(100)
,`email_cliente` varchar(255)
,`telefono_cliente` varchar(20)
,`direccion_entrega` text
,`barrio` varchar(100)
,`metodo_pago` enum('wompi','nequi','daviplata','contra_entrega')
,`repartidor` varchar(100)
,`num_items` bigint(21)
,`total_items` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_productos_con_categoria`
-- (See below for the actual view)
--
CREATE TABLE `v_productos_con_categoria` (
`id_producto` int(10) unsigned
,`producto` varchar(150)
,`precio` decimal(10,2)
,`precio_oferta` decimal(10,2)
,`disponible` tinyint(1)
,`destacado` tinyint(1)
,`stock` int(10) unsigned
,`categoria` varchar(100)
,`categoria_slug` varchar(100)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_ventas_por_dia`
-- (See below for the actual view)
--
CREATE TABLE `v_ventas_por_dia` (
`fecha` date
,`total_ordenes` bigint(21)
,`venta_total` decimal(32,2)
,`venta_entregada` decimal(32,2)
);

-- --------------------------------------------------------

--
-- Structure for view `v_ordenes_completas`
--
DROP TABLE IF EXISTS `v_ordenes_completas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_ordenes_completas`  AS SELECT `o`.`id_orden` AS `id_orden`, `o`.`numero_orden` AS `numero_orden`, `o`.`estado` AS `estado`, `o`.`estado_pago` AS `estado_pago`, `o`.`total` AS `total`, `o`.`created_at` AS `fecha_orden`, `o`.`fecha_entrega_estimada` AS `fecha_entrega_estimada`, `u`.`nombre` AS `nombre_cliente`, `u`.`email` AS `email_cliente`, `u`.`telefono` AS `telefono_cliente`, `o`.`direccion_entrega` AS `direccion_entrega`, `o`.`barrio` AS `barrio`, `o`.`metodo_pago` AS `metodo_pago`, `r`.`nombre` AS `repartidor`, count(`od`.`id_detalle`) AS `num_items`, sum(`od`.`cantidad`) AS `total_items` FROM (((`ordenes` `o` left join `usuarios` `u` on(`o`.`usuario_id` = `u`.`id_usuario`)) left join `usuarios` `r` on(`o`.`repartidor_id` = `r`.`id_usuario`)) left join `orden_detalles` `od` on(`o`.`id_orden` = `od`.`orden_id`)) GROUP BY `o`.`id_orden` ;

-- --------------------------------------------------------

--
-- Structure for view `v_productos_con_categoria`
--
DROP TABLE IF EXISTS `v_productos_con_categoria`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_productos_con_categoria`  AS SELECT `p`.`id_producto` AS `id_producto`, `p`.`nombre` AS `producto`, `p`.`precio` AS `precio`, `p`.`precio_oferta` AS `precio_oferta`, `p`.`disponible` AS `disponible`, `p`.`destacado` AS `destacado`, `p`.`stock` AS `stock`, `c`.`nombre` AS `categoria`, `c`.`slug` AS `categoria_slug` FROM (`productos` `p` join `categorias` `c` on(`p`.`categoria_id` = `c`.`id_categoria`)) ;

-- --------------------------------------------------------

--
-- Structure for view `v_ventas_por_dia`
--
DROP TABLE IF EXISTS `v_ventas_por_dia`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_ventas_por_dia`  AS SELECT cast(`ordenes`.`created_at` as date) AS `fecha`, count(0) AS `total_ordenes`, sum(`ordenes`.`total`) AS `venta_total`, sum(case when `ordenes`.`estado` = 'entregado' then `ordenes`.`total` else 0 end) AS `venta_entregada` FROM `ordenes` WHERE `ordenes`.`estado` <> 'cancelado' GROUP BY cast(`ordenes`.`created_at` as date) ORDER BY cast(`ordenes`.`created_at` as date) DESC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `canasta`
--
ALTER TABLE `canasta`
  ADD PRIMARY KEY (`id_canasta`),
  ADD UNIQUE KEY `uk_canasta_usuario_producto` (`usuario_id`,`producto_id`),
  ADD KEY `fk_canasta_producto` (`producto_id`),
  ADD KEY `idx_canasta_usuario` (`usuario_id`),
  ADD KEY `idx_canasta_session` (`session_id`);

--
-- Indexes for table `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `uk_categorias_slug` (`slug`);

--
-- Indexes for table `configuracion`
--
ALTER TABLE `configuracion`
  ADD PRIMARY KEY (`id_config`),
  ADD UNIQUE KEY `uk_config_clave` (`clave`);

--
-- Indexes for table `contactos`
--
ALTER TABLE `contactos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `direcciones`
--
ALTER TABLE `direcciones`
  ADD PRIMARY KEY (`id_direccion`),
  ADD KEY `idx_direcciones_usuario` (`usuario_id`);

--
-- Indexes for table `horarios`
--
ALTER TABLE `horarios`
  ADD PRIMARY KEY (`id_horario`),
  ADD UNIQUE KEY `uk_horarios_dia` (`dia_semana`);

--
-- Indexes for table `logs_sistema`
--
ALTER TABLE `logs_sistema`
  ADD PRIMARY KEY (`id_log`),
  ADD KEY `idx_logs_tabla` (`tabla_afectada`),
  ADD KEY `idx_logs_fecha` (`created_at`),
  ADD KEY `idx_logs_usuario` (`usuario_id`);

--
-- Indexes for table `ordenes`
--
ALTER TABLE `ordenes`
  ADD PRIMARY KEY (`id_orden`),
  ADD UNIQUE KEY `uk_ordenes_numero` (`numero_orden`),
  ADD KEY `idx_ordenes_usuario` (`usuario_id`),
  ADD KEY `idx_ordenes_estado` (`estado`),
  ADD KEY `idx_ordenes_fecha` (`created_at`),
  ADD KEY `idx_ordenes_repartidor` (`repartidor_id`),
  ADD KEY `idx_ordenes_numero` (`numero_orden`);

--
-- Indexes for table `orden_detalles`
--
ALTER TABLE `orden_detalles`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `fk_detalles_orden` (`orden_id`),
  ADD KEY `fk_detalles_producto` (`producto_id`);

--
-- Indexes for table `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD UNIQUE KEY `uk_pagos_referencia` (`referencia_wompi`),
  ADD KEY `idx_pagos_orden` (`orden_id`),
  ADD KEY `idx_pagos_referencia` (`referencia_wompi`),
  ADD KEY `idx_pagos_estado` (`estado`);

--
-- Indexes for table `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD UNIQUE KEY `uk_productos_slug` (`slug`),
  ADD KEY `idx_productos_categoria` (`categoria_id`),
  ADD KEY `idx_productos_disponible` (`disponible`),
  ADD KEY `idx_productos_destacado` (`destacado`),
  ADD KEY `idx_productos_precio` (`precio`),
  ADD KEY `idx_productos_slug` (`slug`);

--
-- Indexes for table `tokens_refresh`
--
ALTER TABLE `tokens_refresh`
  ADD PRIMARY KEY (`id_token`),
  ADD KEY `idx_tokens_expira` (`expira_en`),
  ADD KEY `idx_tokens_usuario` (`usuario_id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `uk_usuarios_email` (`email`),
  ADD KEY `idx_usuarios_email` (`email`),
  ADD KEY `idx_usuarios_rol` (`rol`),
  ADD KEY `idx_usuarios_telefono` (`telefono`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `canasta`
--
ALTER TABLE `canasta`
  MODIFY `id_canasta` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `configuracion`
--
ALTER TABLE `configuracion`
  MODIFY `id_config` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `contactos`
--
ALTER TABLE `contactos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `direcciones`
--
ALTER TABLE `direcciones`
  MODIFY `id_direccion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `horarios`
--
ALTER TABLE `horarios`
  MODIFY `id_horario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `logs_sistema`
--
ALTER TABLE `logs_sistema`
  MODIFY `id_log` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `ordenes`
--
ALTER TABLE `ordenes`
  MODIFY `id_orden` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orden_detalles`
--
ALTER TABLE `orden_detalles`
  MODIFY `id_detalle` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tokens_refresh`
--
ALTER TABLE `tokens_refresh`
  MODIFY `id_token` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `canasta`
--
ALTER TABLE `canasta`
  ADD CONSTRAINT `fk_canasta_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_canasta_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Constraints for table `direcciones`
--
ALTER TABLE `direcciones`
  ADD CONSTRAINT `fk_direcciones_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Constraints for table `ordenes`
--
ALTER TABLE `ordenes`
  ADD CONSTRAINT `fk_ordenes_repartidor` FOREIGN KEY (`repartidor_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_ordenes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL;

--
-- Constraints for table `orden_detalles`
--
ALTER TABLE `orden_detalles`
  ADD CONSTRAINT `fk_detalles_orden` FOREIGN KEY (`orden_id`) REFERENCES `ordenes` (`id_orden`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_detalles_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id_producto`);

--
-- Constraints for table `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `fk_pagos_orden` FOREIGN KEY (`orden_id`) REFERENCES `ordenes` (`id_orden`);

--
-- Constraints for table `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_productos_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id_categoria`);

--
-- Constraints for table `tokens_refresh`
--
ALTER TABLE `tokens_refresh`
  ADD CONSTRAINT `fk_tokens_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
