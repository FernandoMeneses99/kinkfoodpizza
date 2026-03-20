import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.substring(7);
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { verifyAccessToken } = await import('@/lib/auth');
    const payload = verifyAccessToken(token);
    
    if (payload.rol !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores' }, { status: 403 });
    }

    const ordenes_hoy = await query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM ordenes WHERE DATE(created_at) = CURDATE() AND estado != 'cancelado'`
    );

    const ventas_hoy = await query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(total), 0) as total FROM ordenes WHERE DATE(created_at) = CURDATE() AND estado NOT IN ('cancelado', 'pendiente')`
    );

    const ordenes_activas = await query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM ordenes WHERE estado IN ('pendiente', 'pagado', 'confirmado', 'preparando', 'listo', 'en_camino')`
    );

    const productos_disponibles = await query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM productos WHERE disponible = 1 AND activo = 1`
    );

    const nuevos_clientes_hoy = await query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM usuarios WHERE rol = 'cliente' AND DATE(fecha_registro) = CURDATE()`
    );

    const ordenes_pendientes = await query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM ordenes WHERE estado = 'pendiente'`
    );

    const total_clientes = await query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM usuarios WHERE rol = 'cliente'`
    );

    const total_ordenes = await query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM ordenes WHERE estado != 'cancelado'`
    );

    const productosVendidos = await query<RowDataPacket[]>(
      `SELECT p.nombre, SUM(od.cantidad) as cantidad_vendida, SUM(od.subtotal) as total_vendido
       FROM orden_detalles od
       JOIN productos p ON od.producto_id = p.id_producto
       JOIN ordenes o ON od.orden_id = o.id_orden
       WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND o.estado != 'cancelado'
       GROUP BY p.nombre
       ORDER BY cantidad_vendida DESC
       LIMIT 5`
    );

    const ordenesRecientes = await query<RowDataPacket[]>(
      `SELECT o.id_orden, o.numero_orden, o.estado, o.total, o.created_at,
              COALESCE(u.nombre, o.nombre_cliente) as cliente
       FROM ordenes o
       LEFT JOIN usuarios u ON o.usuario_id = u.id_usuario
       ORDER BY o.created_at DESC
       LIMIT 5`
    );

    const ventasPorDia = await query<RowDataPacket[]>(
      `SELECT DATE(created_at) as fecha, SUM(total) as total, COUNT(*) as ordenes
       FROM ordenes
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND estado != 'cancelado'
       GROUP BY DATE(created_at)
       ORDER BY fecha`
    );

    const stats = {
      ordenes_hoy: ordenes_hoy[0]?.count || 0,
      ventas_hoy: parseFloat(ventas_hoy[0]?.total?.toString() || '0'),
      ordenes_activas: ordenes_activas[0]?.count || 0,
      productos_disponibles: productos_disponibles[0]?.count || 0,
      nuevos_clientes_hoy: nuevos_clientes_hoy[0]?.count || 0,
      ordenes_pendientes_pago: ordenes_pendientes[0]?.count || 0,
      total_clientes: total_clientes[0]?.count || 0,
      total_ordenes: total_ordenes[0]?.count || 0,
    };

    return NextResponse.json({
      stats,
      productos_mas_vendidos: productosVendidos || [],
      ordenes_recientes: ordenesRecientes || [],
      ventas_por_dia: ventasPorDia || [],
    });

  } catch (error) {
    console.error('Error al obtener dashboard:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos del dashboard' },
      { status: 500 }
    );
  }
}
