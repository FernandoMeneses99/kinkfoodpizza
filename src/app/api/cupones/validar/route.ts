import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAccessToken } from '@/lib/cookies';
import { verifyAccessToken } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface CuponValidacion {
  valido: boolean;
  cupon?: {
    id: number;
    codigo: string;
    nombre: string;
    tipo: string;
    valor: number;
  };
  descuento?: number;
  mensaje: string;
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);
    let usuarioId: number | null = null;

    if (accessToken) {
      try {
        const payload = verifyAccessToken(accessToken);
        usuarioId = payload.id;
      } catch {
        // Token inválido pero continuamos
      }
    }

    const body = await req.json();
    const { codigo, subtotal } = body;

    if (!codigo || typeof codigo !== 'string') {
      return NextResponse.json<CuponValidacion>(
        { valido: false, mensaje: 'Código de cupón requerido' },
        { status: 400 }
      );
    }

    if (!subtotal || typeof subtotal !== 'number' || subtotal <= 0) {
      return NextResponse.json<CuponValidacion>(
        { valido: false, mensaje: 'Subtotal válido requerido' },
        { status: 400 }
      );
    }

    const cuponCodigo = codigo.toUpperCase().trim();

    const cupones = await query<(RowDataPacket & {
      id_cupon: number;
      codigo: string;
      nombre: string;
      descripcion: string;
      tipo_descuento: 'porcentaje' | 'monto_fijo';
      valor_descuento: number;
      valor_minimo: number;
      valor_maximo_descuento: number | null;
      cantidad_disponible: number | null;
      cantidad_usada: number;
      fecha_inicio: Date;
      fecha_fin: Date;
      activo: boolean;
      solo_primera_compra: boolean;
    })[]>(
      `SELECT * FROM cupones WHERE codigo = ? AND activo = 1`,
      [cuponCodigo]
    );

    if (cupones.length === 0) {
      return NextResponse.json<CuponValidacion>({
        valido: false,
        mensaje: 'El cupón no existe o no está activo'
      });
    }

    const cupon = cupones[0];
    const ahora = new Date();

    if (ahora < cupon.fecha_inicio) {
      return NextResponse.json<CuponValidacion>({
        valido: false,
        mensaje: 'El cupón aún no está vigente'
      });
    }

    if (ahora > cupon.fecha_fin) {
      return NextResponse.json<CuponValidacion>({
        valido: false,
        mensaje: 'El cupón ha expirado'
      });
    }

    if (cupon.cantidad_disponible !== null && cupon.cantidad_disponible <= 0) {
      return NextResponse.json<CuponValidacion>({
        valido: false,
        mensaje: 'El cupón ha agotado su disponibilidad'
      });
    }

    if (cupon.valor_minimo && subtotal < cupon.valor_minimo) {
      return NextResponse.json<CuponValidacion>({
        valido: false,
        mensaje: `El valor mínimo para usar este cupón es $${cupon.valor_minimo.toLocaleString('es-CO')}`
      });
    }

    if (cupon.solo_primera_compra && usuarioId) {
      const pedidosPrevios = await query<(RowDataPacket & { total: number })[]>(
        'SELECT COUNT(*) as total FROM ordenes WHERE usuario_id = ? AND estado != "cancelada"',
        [usuarioId]
      );

      if (pedidosPrevios[0].total > 0) {
        return NextResponse.json<CuponValidacion>({
          valido: false,
          mensaje: 'Este cupón solo es válido para tu primera compra'
        });
      }
    }

    let descuento = 0;
    if (cupon.tipo_descuento === 'porcentaje') {
      descuento = (subtotal * cupon.valor_descuento) / 100;
      if (cupon.valor_maximo_descuento && descuento > cupon.valor_maximo_descuento) {
        descuento = cupon.valor_maximo_descuento;
      }
    } else {
      descuento = cupon.valor_descuento;
    }

    if (descuento > subtotal) {
      descuento = subtotal;
    }

    return NextResponse.json<CuponValidacion>({
      valido: true,
      cupon: {
        id: cupon.id_cupon,
        codigo: cupon.codigo,
        nombre: cupon.nombre,
        tipo: cupon.tipo_descuento,
        valor: cupon.valor_descuento
      },
      descuento: Math.round(descuento),
      mensaje: 'Cupón aplicado correctamente'
    });

  } catch (error) {
    console.error('Error al validar cupón:', error);
    return NextResponse.json<CuponValidacion>(
      { valido: false, mensaje: 'Error al validar el cupón' },
      { status: 500 }
    );
  }
}
