import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ordenId = searchParams.get('orden_id');

    if (!ordenId) {
      return NextResponse.json({ error: 'ID de orden requerido' }, { status: 400 });
    }

    const orden = await query<RowDataPacket[]>(
      `SELECT o.*, 
              (SELECT GROUP_CONCAT(p.nombre SEPARATOR ', ') FROM orden_detalles od JOIN productos p ON od.producto_id = p.id_producto WHERE od.orden_id = o.id_orden) as productos
       FROM ordenes o
       WHERE o.id_orden = ?`,
      [parseInt(ordenId)]
    );

    if (orden.length === 0) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    const pago = await query<RowDataPacket[]>(
      `SELECT * FROM pagos WHERE orden_id = ? ORDER BY created_at DESC LIMIT 1`,
      [parseInt(ordenId)]
    );

    return NextResponse.json({
      orden: {
        id: orden[0].id_orden,
        numero_orden: orden[0].numero_orden,
        estado: orden[0].estado,
        estado_pago: orden[0].estado_pago,
        total: parseFloat(orden[0].total.toString()),
        productos: orden[0].productos,
        created_at: orden[0].created_at,
      },
      pago: pago.length > 0 ? {
        estado: pago[0].estado,
        referencia: pago[0].referencia_wompi,
        metodo: pago[0].metodo_pago_detallado,
        fecha_pago: pago[0].fecha_pago,
      } : null,
    });

  } catch (error) {
    console.error('Error al consultar estado:', error);
    return NextResponse.json(
      { error: 'Error al consultar estado' },
      { status: 500 }
    );
  }
}
