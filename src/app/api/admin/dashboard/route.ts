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

    const stats = await query<RowDataPacket[]>(
      'CALL sp_dashboard_stats()'
    );

    const productosVendidos = await query<RowDataPacket[]>(
      `CALL sp_productos_mas_vendidos(?, DATE_SUB(CURDATE(), INTERVAL 30 DAY), CURDATE())`,
      [5]
    );

    const ordenesRecientes = await query<RowDataPacket[]>(
      `SELECT o.id_orden, o.numero_orden, o.estado, o.total, o.created_at,
              u.nombre as cliente
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

    return NextResponse.json({
      stats: stats[0] || {},
      productos_mas_vendidos: productosVendidos[0] || [],
      ordenes_recientes: ordenesRecientes,
      ventas_por_dia: ventasPorDia,
    });

  } catch (error) {
    console.error('Error al obtener dashboard:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos del dashboard' },
      { status: 500 }
    );
  }
}
