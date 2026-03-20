import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      id,
      status,
      amount_in_cents,
      currency,
      reference,
      payment_method_type,
      created_at
    } = body;

    const wompiEnvironment = process.env.WOMPI_ENVIRONMENT || 'sandbox';
    const wompiPrivateKey = process.env.WOMPI_PRIVATE_KEY;

    if (wompiPrivateKey && wompiEnvironment === 'production') {
      const signatureBase = `${id}${status}${amount_in_cents}${reference}${wompiPrivateKey}`;
      const expectedSignature = crypto
        .createHash('sha256')
        .update(signatureBase)
        .digest('hex');

      const wompiSignature = req.headers.get('x-wompi-signature');
      
      if (wompiSignature !== expectedSignature) {
        return NextResponse.json({ error: 'Firma inválida' }, { status: 400 });
      }
    }

    const ordenId = parseInt(reference.split('-')[1]);

    if (isNaN(ordenId)) {
      return NextResponse.json({ error: 'Referencia inválida' }, { status: 400 });
    }

    let estadoPago: 'pendiente' | 'completado' | 'fallido';
    let estadoOrden: string;

    switch (status) {
      case 'APPROVED':
        estadoPago = 'completado';
        estadoOrden = 'confirmado';
        break;
      case 'DECLINED':
      case 'ERROR':
        estadoPago = 'fallido';
        estadoOrden = 'pendiente';
        break;
      default:
        estadoPago = 'pendiente';
        estadoOrden = 'pendiente';
    }

    const existingPago = await query<RowDataPacket[]>(
      `SELECT id_pago FROM pagos WHERE orden_id = ? ORDER BY created_at DESC LIMIT 1`,
      [ordenId]
    );

    if (existingPago.length > 0) {
      await query<ResultSetHeader>(
        `UPDATE pagos SET 
          estado = ?,
          referencia_wompi = ?,
          mensaje_respuesta = ?,
          metodo_pago_detallado = ?,
          fecha_pago = ?
         WHERE orden_id = ?`,
        [
          estadoPago,
          id,
          JSON.stringify(body),
          payment_method_type,
          created_at,
          ordenId
        ]
      );
    } else {
      await query<ResultSetHeader>(
        `INSERT INTO pagos (orden_id, referencia_wompi, tipo_transaccion, monto, estado, mensaje_respuesta, metodo_pago_detallado, fecha_pago)
         VALUES (?, ?, 'wompi', ?, ?, ?, ?, ?)`,
        [
          ordenId,
          id,
          amount_in_cents / 100,
          estadoPago,
          JSON.stringify(body),
          payment_method_type,
          created_at
        ]
      );
    }

    if (estadoOrden === 'confirmado') {
      const detalles = await query<RowDataPacket[]>(
        `SELECT producto_id, cantidad FROM orden_detalles WHERE orden_id = ?`,
        [ordenId]
      );

      for (const detalle of detalles) {
        await query<ResultSetHeader>(
          `UPDATE productos SET stock = stock - ? WHERE id_producto = ?`,
          [detalle.cantidad, detalle.producto_id]
        );
      }
    }

    await query<ResultSetHeader>(
      `UPDATE ordenes SET estado = ?, estado_pago = ? WHERE id_orden = ?`,
      [estadoOrden, estadoPago, ordenId]
    );

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error en webhook Wompi:', error);
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 500 }
    );
  }
}
