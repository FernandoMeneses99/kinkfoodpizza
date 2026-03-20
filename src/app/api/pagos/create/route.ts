import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import crypto from 'crypto';

interface WompiTransaction {
  id: string;
  state: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
  amount_in_cents: number;
  currency: string;
  payment_method_type: string;
  payment_link_id?: string;
  created_at: string;
  updated_at: string;
  reference: string;
  customer_data?: {
    email: string;
    full_name: string;
    phone_number: string;
  };
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
    const { orden_id } = body;

    if (!orden_id) {
      return NextResponse.json({ error: 'ID de orden requerido' }, { status: 400 });
    }

    const orden = await query<RowDataPacket[]>(
      `SELECT o.*, u.email, u.nombre, u.telefono 
       FROM ordenes o
       LEFT JOIN usuarios u ON o.usuario_id = u.id_usuario
       WHERE o.id_orden = ? AND o.usuario_id = ?`,
      [orden_id, payload.id]
    );

    if (orden.length === 0) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    if (orden[0].estado_pago === 'pagado') {
      return NextResponse.json({ error: 'Esta orden ya fue pagada' }, { status: 400 });
    }

    const amountInCents = Math.round(parseFloat(orden[0].total.toString()) * 100);
    const reference = `ORD-${orden_id}-${Date.now()}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const wompiPublicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
    const wompiEnvironment = process.env.WOMPI_ENVIRONMENT || 'sandbox';

    if (!wompiPublicKey) {
      return NextResponse.json({
        sandbox: true,
        checkoutUrl: `${appUrl}/cliente/pago-prueba?orden=${orden_id}&ref=${reference}`,
        message: 'Wompi no configurado - modo prueba'
      });
    }

    await query<ResultSetHeader>(
      `INSERT INTO pagos (orden_id, tipo_transaccion, monto, estado, idempotency_key)
       VALUES (?, 'wompi', ?, 'pendiente', ?)`,
      [orden_id, amountInCents / 100, reference]
    );

    const signatureBase = `${wompiPublicKey}${amountInCents}${reference}COP`;
    const signature = crypto
      .createHash('sha256')
      .update(signatureBase)
      .digest('hex');

    const wompiUrl = wompiEnvironment === 'production'
      ? 'https://checkout.wompi.co'
      : 'https://sandbox.wompi.co';

    const checkoutUrl = `${wompiUrl}/v1/payment-links/new?amount-in-cents=${amountInCents}&currency=COP&reference=${reference}&public-key=${wompiPublicKey}&signature=${signature}&redirect-url=${encodeURIComponent(`${appUrl}/cliente/pago-exitoso?orden=${orden_id}`)}`;

    return NextResponse.json({
      checkoutUrl,
      reference,
      amount: amountInCents / 100,
    });

  } catch (error) {
    console.error('Error al crear pago:', error);
    return NextResponse.json(
      { error: 'Error al crear pago' },
      { status: 500 }
    );
  }
}
