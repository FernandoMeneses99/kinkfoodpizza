import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { ordenSchema } from '@/lib/validation';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.substring(7);
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { verifyAccessToken } = await import('@/lib/auth');
    const payload = verifyAccessToken(token);
    
    if (payload.rol !== 'cliente') {
      return NextResponse.json({ error: 'Solo clientes' }, { status: 403 });
    }

    const ordenes = await query<RowDataPacket[]>(
      `SELECT * FROM ordenes WHERE usuario_id = ? ORDER BY created_at DESC`,
      [payload.id]
    );

    const ordenesFormateadas = await Promise.all(ordenes.map(async (o) => {
      const detalles = await query<RowDataPacket[]>(
        `SELECT od.*, p.nombre as producto_nombre
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
        direccion: o.direccion_entrega,
        subtotal: parseFloat(o.subtotal.toString()),
        costo_domicilio: parseFloat(o.costo_domicilio.toString()),
        descuento: parseFloat(o.descuento.toString()),
        total: parseFloat(o.total.toString()),
        metodo_pago: o.metodo_pago,
        created_at: o.created_at,
        items: detalles.map(d => ({
          producto: d.producto_nombre,
          cantidad: d.cantidad,
          precio: parseFloat(d.precio_unitario.toString()),
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

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.substring(7);
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { verifyAccessToken } = await import('@/lib/auth');
    const payload = verifyAccessToken(token);
    
    if (payload.rol !== 'cliente') {
      return NextResponse.json({ error: 'Solo clientes' }, { status: 403 });
    }

    const body = await req.json();
    
    const { error, value } = ordenSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }

    const canasta = await query<RowDataPacket[]>(
      `SELECT c.*, p.nombre, p.precio, p.stock
       FROM canasta c
       JOIN productos p ON c.producto_id = p.id_producto
       WHERE c.usuario_id = ?`,
      [payload.id]
    );

    if (canasta.length === 0) {
      return NextResponse.json({ error: 'La canasta está vacía' }, { status: 400 });
    }

    for (const item of canasta) {
      if (!item.disponible || item.cantidad > item.stock) {
        return NextResponse.json(
          { error: `Producto "${item.nombre}" no disponible o sin stock` },
          { status: 400 }
        );
      }
    }

    const subtotal = canasta.reduce((sum, item) => {
      return sum + (parseFloat(item.precio.toString()) * item.cantidad);
    }, 0);

    const config = await query<RowDataPacket[]>(
      `SELECT valor FROM configuracion WHERE clave IN ('domicilio_gratis_desde', 'costo_domicilio')`
    );

    let domicilioGratis = 70000;
    let costoDomicilio = 5000;

    config.forEach(c => {
      if (c.clave === 'domicilio_gratis_desde') domicilioGratis = parseFloat(c.valor);
      if (c.clave === 'costo_domicilio') costoDomicilio = parseFloat(c.valor);
    });

    const costoEnvio = subtotal >= domicilioGratis ? 0 : costoDomicilio;
    const total = subtotal + costoEnvio;

    const numeroOrden = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const ordenResult = await query<ResultSetHeader>(
      `INSERT INTO ordenes (usuario_id, numero_orden, direccion_entrega, barrio, referencia_direccion, subtotal, costo_domicilio, total, metodo_pago, nombre_cliente, telefono_cliente, email_cliente)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 
               (SELECT nombre FROM usuarios WHERE id_usuario = ?),
               (SELECT telefono FROM usuarios WHERE id_usuario = ?),
               (SELECT email FROM usuarios WHERE id_usuario = ?))`,
      [
        payload.id,
        numeroOrden,
        value.direccion_entrega,
        value.barrio,
        value.referencia_direccion,
        subtotal,
        costoEnvio,
        total,
        value.metodo_pago,
        payload.id,
        payload.id,
        payload.id
      ]
    );

    const ordenId = ordenResult.insertId;

    for (const item of canasta) {
      const precioUnitario = parseFloat(item.precio.toString());
      const subtotalItem = precioUnitario * item.cantidad;

      await query<ResultSetHeader>(
        `INSERT INTO orden_detalles (orden_id, producto_id, cantidad, precio_unitario, subtotal, observaciones)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [ordenId, item.producto_id, item.cantidad, precioUnitario, subtotalItem, item.observaciones || null]
      );

      await query<ResultSetHeader>(
        `UPDATE productos SET stock = stock - ? WHERE id_producto = ?`,
        [item.cantidad, item.producto_id]
      );
    }

    await query<ResultSetHeader>(
      'DELETE FROM canasta WHERE usuario_id = ?',
      [payload.id]
    );

    return NextResponse.json({
      message: 'Orden creada exitosamente',
      orden_id: ordenId,
      numero_orden: numeroOrden
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear orden:', error);
    return NextResponse.json(
      { error: 'Error al crear orden' },
      { status: 500 }
    );
  }
}
