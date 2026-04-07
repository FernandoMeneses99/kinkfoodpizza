import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { withAuth } from '@/middleware/auth';
import { AuthenticatedRequest } from '@/middleware/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface CuponRow extends RowDataPacket {
  id_cupon: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
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
  created_at: Date;
}

async function handler(req: AuthenticatedRequest) {
  if (req.method === 'GET') {
    return getCupones();
  }

  if (req.method === 'POST') {
    return createCupon(req);
  }

  return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
}

async function getCupones() {
  try {
    const cupones = await query<CuponRow[]>(
      `SELECT * FROM cupones ORDER BY created_at DESC`
    );

    return NextResponse.json({
      cupones: cupones.map(c => ({
        id: c.id_cupon,
        codigo: c.codigo,
        nombre: c.nombre,
        descripcion: c.descripcion,
        tipo: c.tipo_descuento,
        valor: c.valor_descuento,
        valorMinimo: c.valor_minimo,
        valorMaximo: c.valor_maximo_descuento,
        cantidadDisponible: c.cantidad_disponible,
        cantidadUsada: c.cantidad_usada,
        fechaInicio: c.fecha_inicio,
        fechaFin: c.fecha_fin,
        activo: c.activo,
        soloPrimeraCompra: c.solo_primera_compra,
        createdAt: c.created_at
      }))
    });
  } catch (error) {
    console.error('Error al obtener cupones:', error);
    return NextResponse.json(
      { error: 'Error al obtener cupones' },
      { status: 500 }
    );
  }
}

async function createCupon(req: AuthenticatedRequest) {
  try {
    const body = await req.json();
    const {
      codigo,
      nombre,
      descripcion,
      tipo,
      valor,
      valorMinimo = 0,
      valorMaximo,
      cantidadDisponible,
      fechaInicio,
      fechaFin,
      activo = true,
      soloPrimeraCompra = false
    } = body;

    if (!codigo || !nombre || !tipo || !valor || !fechaInicio || !fechaFin) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const codigoMayus = codigo.toUpperCase().trim();

    const existente = await query<(RowDataPacket & { total: number })[]>(
      'SELECT COUNT(*) as total FROM cupones WHERE codigo = ?',
      [codigoMayus]
    );

    if (existente[0].total > 0) {
      return NextResponse.json(
        { error: 'Ya existe un cupón con este código' },
        { status: 409 }
      );
    }

    const result = await query<ResultSetHeader>(
      `INSERT INTO cupones 
       (codigo, nombre, descripcion, tipo_descuento, valor_descuento, valor_minimo, valor_maximo_descuento, cantidad_disponible, fecha_inicio, fecha_fin, activo, solo_primera_compra)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        codigoMayus,
        nombre,
        descripcion || null,
        tipo,
        valor,
        valorMinimo,
        valorMaximo || null,
        cantidadDisponible || null,
        new Date(fechaInicio),
        new Date(fechaFin),
        activo,
        soloPrimeraCompra
      ]
    );

    return NextResponse.json({
      message: 'Cupón creado exitosamente',
      id: result.insertId
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear cupón:', error);
    return NextResponse.json(
      { error: 'Error al crear cupón' },
      { status: 500 }
    );
  }
}

export const GET = withAuth((req) => handler(req));
export const POST = withAuth((req) => handler(req));
