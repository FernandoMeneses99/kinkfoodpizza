-- =============================================
-- KROKORI PIZZERÍA - SCRIPT DE INSTALACIÓN RÁPIDA
-- =============================================

-- 1. ABRIR XAMPP
--    - Iniciar Apache
--    - Iniciar MySQL

-- 2. ABRIR phpMyAdmin
--    - Ir a http://localhost/phpmyadmin

-- 3. IMPORTAR ESTE ARCHIVO
--    - Click en "Importar"
--    - Seleccionar este archivo SQL
--    - Click en "Continuar"

-- =============================================
-- DATOS DE ACCESO POR DEFECTO
-- =============================================

-- USUARIO ADMIN:
-- Email: admin@krokori.com
-- Password: admin123
-- Rol: Admin

-- IMPORTANTE: Cambiar la contraseña del admin 
-- después del primer login desde el dashboard.

-- =============================================
-- CONFIGURACIÓN WOMPI (PRUEBA)
-- =============================================

-- Para probar pagos con Wompi Sandbox:
-- 1. Crear cuenta en https://sandbox.wompi.co
-- 2. Obtener las credenciales de prueba
-- 3. Actualizar en la tabla configuracion:
--    - wompi_public_key
--    - wompi_private_key

-- =============================================
-- CONSULTAS ÚTILES
-- =============================================

-- Ver todas las órdenes pendientes
CALL sp_ordenes_activas();

-- Ver productos más vendidos (último mes)
CALL sp_productos_mas_vendidos(10, DATE_SUB(CURDATE(), INTERVAL 30 DAY), CURDATE());

-- Ver estadísticas del dashboard
CALL sp_dashboard_stats();

-- Ver ventas por día
SELECT * FROM v_ventas_por_dia LIMIT 30;

-- Actualizar configuración de Wompi
-- UPDATE configuracion SET valor = 'tu_key_publica' WHERE clave = 'wompi_public_key';
-- UPDATE configuracion SET valor = 'tu_key_privada' WHERE clave = 'wompi_private_key';

-- =============================================
-- BACKUP DE LA BASE DE DATOS
-- =============================================

-- Para hacer backup desde phpMyAdmin:
-- 1. Seleccionar la base de datos "krokori_db"
-- 2. Click en "Exportar"
-- 3. Click en "Continuar"
-- 4. Guardar el archivo .sql
