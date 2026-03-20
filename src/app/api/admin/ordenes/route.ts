import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface OrdenRow extends RowDataPacket {
  id_orden: number;
  numero_orden: string;
  usuario_id: number | null;
  repartidor_id: number | null;
  estado: string;
  nombre_cliente: string | null;
  telefono_cliente: string | null;
  email_cliente: string | null;
  direccion_entrega: string;
  barrio: string | null;
  subtotal: number;
  costo_domicilio: number;
  descuento: number;
  total: number;
  metodo_pago: string;
  estado_pago: string;
  created_at: Date;
}

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

    const { searchParams } = new URL(req.url);
    const estado = searchParams.get('estado');

    let sql = `
      SELECT o.*, u.nombre as cliente_nombre, u.telefono as cliente_telefono, u.email as cliente_email,
             r.nombre as repartidor_nombre
      FROM ordenes o
      LEFT JOIN usuarios u ON o.usuario_id = u.id_usuario
      LEFT JOIN usuarios r ON o.repartidor_id = r.id_usuario
      WHERE 1=1
    `;
    const params: string[] = [];

    if (estado) {
      sql += ' AND o.estado = ?';
      params.push(estado);
    }

    sql += ' ORDER BY o.created_at DESC';

    const ordenes = await query<OrdenRow[]>(sql, params);

    const ordenesFormateadas = await Promise.all(ordenes.map(async (o) => {
      const detalles = await query<RowDataPacket[]>(
        `SELECT od.*, p.nombre as producto_nombre, p.imagen
         FROM orden_detalles od
         JOIN productos p ON od.producto_id = p.id_producto
         WHERE od.orden_id = ?`,
        [o.id_orden]
      );

      return {
        id: o.id_orden,
        numero_orden: o.numero_orden,
        estado: o.estado,
        estado_pago: o.estado_pago,
        cliente: o.cliente_nombre || o.nombre_cliente,
        telefono: o.cliente_telefono || o.telefono_cliente,
        email: o.cliente_email || o.email_cliente,
        direccion: o.direccion_entrega,
        barrio: o.barrio,
        subtotal: parseFloat(o.subtotal.toString()),
        costo_domicilio: parseFloat(o.costo_domicilio.toString()),
        descuento: parseFloat(o.descuento.toString()),
        total: parseFloat(o.total.toString()),
        metodo_pago: o.metodo_pago,
        repartidor: o.repartidor_nombre,
        created_at: o.created_at,
        items: detalles.map(d => ({
          id: d.id_detalle,
          producto: d.producto_nombre,
          cantidad: d.cantidad,
          precio_unitario: parseFloat(d.precio_unitario.toString()),
          subtotal: parseFloat(d.subtotal.toString()),
        })),
      };
    }));

    return NextResponse.json({ ordenes: ordenesFormateadas });

  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    return NextResponse.json(
      { error: 'Error al obtener órdenes' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.substring(7);
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { verifyAccessToken } = await import('@/lib/auth');
    const payload = verifyAccessToken(token);
    
    if (payload.rol !== 'admin' && payload.rol !== 'repartidor') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await req.json();
    const { id, estado, repartidor_id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID de orden requerido' }, { status: 400 });
    }

    const validEstados = ['pendiente', 'pagado', 'confirmado', 'preparando', 'listo', 'en_camino', 'entregado', 'cancelado'];
    
    if (estado && !validEstados.includes(estado)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
    }

    const updates: string[] = [];
    const params: (string | number)[] = [];

    if (estado) {
      updates.push('estado = ?');
      params.push(estado);
    }

    if (repartidor_id !== undefined) {
      updates.push('repartidor_id = ?');
      params.push(repartidor_id);
    }

    if (estado === 'entregado') {
      updates.push('fecha_entrega_real = NOW()');
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 });
    }

    params.push(id);

    await query<ResultSetHeader>(
      `UPDATE ordenes SET ${updates.join(', ')} WHERE id_orden = ?`,
      params
    );

    return NextResponse.json({ message: 'Orden actualizada' });

  } catch (error) {
    console.error('Error al actualizar orden:', error);
    return NextResponse.json(
      { error: 'Error al actualizar orden' },
      { status: 500 }
    );
  }
}
