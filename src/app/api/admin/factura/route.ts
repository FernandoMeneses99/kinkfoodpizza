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

    const { searchParams } = new URL(req.url);
    const ordenId = searchParams.get('id');

    if (!ordenId) {
      return NextResponse.json({ error: 'ID de orden requerido' }, { status: 400 });
    }

    const orden = await query<RowDataPacket[]>(
      `SELECT o.*, 
              COALESCE(u.nombre, o.nombre_cliente) as cliente_nombre,
              COALESCE(u.telefono, o.telefono_cliente) as cliente_telefono,
              COALESCE(u.email, o.email_cliente) as cliente_email
       FROM ordenes o
       LEFT JOIN usuarios u ON o.usuario_id = u.id_usuario
       WHERE o.id_orden = ?`,
      [ordenId]
    );

    if (orden.length === 0) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    const detalles = await query<RowDataPacket[]>(
      `SELECT od.*, p.nombre as producto_nombre
       FROM orden_detalles od
       JOIN productos p ON od.producto_id = p.id_producto
       WHERE od.orden_id = ?`,
      [ordenId]
    );

    const config = await query<RowDataPacket[]>(
      `SELECT valor FROM configuracion WHERE clave IN ('nombre_restaurante', 'telefono', 'direccion')`
    );

    const configObj: Record<string, string> = {};
    config.forEach(c => {
      configObj[c.clave] = c.valor;
    });

    const nombreRestaurante = configObj.nombre_restaurante || 'KROKORI';
    const telefonoRestaurante = configObj.telefono || '300-904-7298';
    const direccionRestaurante = configObj.direccion || 'Bogotá, Colombia';

    const factura = generarFacturaPOS(
      {
        numero_orden: orden[0].numero_orden,
        fecha: orden[0].created_at,
        cliente: orden[0].cliente_nombre || 'Cliente General',
        telefono: orden[0].cliente_telefono || '',
        direccion: orden[0].direccion_entrega || '',
        barrio: orden[0].barrio || '',
        metodo_pago: orden[0].metodo_pago,
        estado: orden[0].estado,
      },
      detalles.map(d => ({
        nombre: d.producto_nombre,
        cantidad: d.cantidad,
        precio: parseFloat(d.precio_unitario.toString()),
        subtotal: parseFloat(d.subtotal.toString()),
        observaciones: d.observaciones,
      })),
      {
        subtotal: parseFloat(orden[0].subtotal.toString()),
        costo_domicilio: parseFloat(orden[0].costo_domicilio.toString()),
        descuento: parseFloat(orden[0].descuento.toString()),
        total: parseFloat(orden[0].total.toString()),
      },
      {
        nombre: nombreRestaurante,
        telefono: telefonoRestaurante,
        direccion: direccionRestaurante,
      }
    );

    return NextResponse.json({
      factura,
      orden: {
        numero_orden: orden[0].numero_orden,
        fecha: orden[0].created_at,
        cliente: orden[0].cliente_nombre,
        telefono: orden[0].cliente_telefono,
        direccion: orden[0].direccion_entrega,
        metodo_pago: orden[0].metodo_pago,
        estado: orden[0].estado,
      },
      items: detalles.map(d => ({
        nombre: d.producto_nombre,
        cantidad: d.cantidad,
        precio: parseFloat(d.precio_unitario.toString()),
        subtotal: parseFloat(d.subtotal.toString()),
      })),
      totales: {
        subtotal: parseFloat(orden[0].subtotal.toString()),
        costo_domicilio: parseFloat(orden[0].costo_domicilio.toString()),
        descuento: parseFloat(orden[0].descuento.toString()),
        total: parseFloat(orden[0].total.toString()),
      },
    });

  } catch (error) {
    console.error('Error al generar factura:', error);
    return NextResponse.json(
      { error: 'Error al generar factura' },
      { status: 500 }
    );
  }
}

function generarFacturaPOS(
  orden: {
    numero_orden: string;
    fecha: Date;
    cliente: string;
    telefono: string;
    direccion: string;
    barrio: string;
    metodo_pago: string;
    estado: string;
  },
  items: Array<{
    nombre: string;
    cantidad: number;
    precio: number;
    subtotal: number;
    observaciones: string | null;
  }>,
  totales: {
    subtotal: number;
    costo_domicilio: number;
    descuento: number;
    total: number;
  },
  restaurante: {
    nombre: string;
    telefono: string;
    direccion: string;
  }
): string {
  const LINE_WIDTH = 48;
  const centro = (text: string) => {
    const padding = Math.max(0, Math.floor((LINE_WIDTH - text.length) / 2));
    return ' '.repeat(padding) + text;
  };
  const izquierda = (text: string, width: number) => {
    return text.padEnd(width).substring(0, width);
  };
  const derecha = (text: string, width: number) => {
    return text.padStart(width).substring(text.length);
  };
  const linea = () => '-'.repeat(LINE_WIDTH);
  const dobleLinea = () => '='.repeat(LINE_WIDTH);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatMetodoPago = (metodo: string) => {
    const metodos: Record<string, string> = {
      wompi: 'WOMPI',
      nequi: 'NEQUI',
      daviplata: 'DAVIPLATA',
      contra_entrega: 'CONTRA ENTREGA',
    };
    return metodos[metodo] || metodo.toUpperCase();
  };

  let factura = `
${centro(dobleLinea())}
${centro(restaurante.nombre)}
${centro(restaurante.direccion)}
${centro('Tel: ' + restaurante.telefono)}
${centro(dobleLinea())}

${centro('FACTURA DE VENTA')}
${centro('NIT: 123456789-0')}

${linea()}
FECHA: ${formatDate(orden.fecha)}
ORDEN #: ${orden.numero_orden}
${linea()}

CLIENTE: ${orden.cliente}
${orden.telefono ? 'TEL: ' + orden.telefono : ''}
DIR: ${orden.direccion || 'N/A'}
${orden.barrio ? 'BARRIO: ' + orden.barrio : ''}
${linea()}
`;

  items.forEach(item => {
    factura += `
${izquierda(item.nombre, LINE_WIDTH)}
${izquierda(`${item.cantidad} x ${formatCurrency(item.precio)}`, 30)}${derecha(formatCurrency(item.subtotal), 18)}
`;
    if (item.observaciones) {
      factura += `${centro('Obs: ' + item.observaciones.substring(0, 40))}\n`;
    }
  });

  factura += `
${linea()}
${izquierda('SUBTOTAL:', 30)}${derecha(formatCurrency(totales.subtotal), 18)}
${izquierda('DOMICILIO:', 30)}${derecha(formatCurrency(totales.costo_domicilio), 18)}
`;
  if (totales.descuento > 0) {
    factura += `${izquierda('DESCUENTO:', 30)}${derecha('-' + formatCurrency(totales.descuento), 18)}\n`;
  }
  factura += `${dobleLinea()}
${izquierda('TOTAL:', 30)}${derecha(formatCurrency(totales.total), 18)}
${dobleLinea()}

${centro('FORMA DE PAGO')}
${centro(formatMetodoPago(orden.metodo_pago))}

${linea()}
${centro('GRACIAS POR SU PEDIDO')}
${centro('ESPERAMOS VERLO PRONTO')}
${linea()}
${centro('')}
${centro('')}
${centro('')}
`;

  return factura;
}
