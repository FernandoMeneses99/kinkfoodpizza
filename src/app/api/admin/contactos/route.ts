import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

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

    const contactos = await query<RowDataPacket[]>(
      'SELECT * FROM contactos ORDER BY created_at DESC'
    );

    const noLeidos = await query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM contactos WHERE leido = 0'
    );

    return NextResponse.json({
      contactos,
      total: contactos.length,
      noLeidos: noLeidos[0]?.count || 0
    });

  } catch (error) {
    console.error('Error al obtener contactos:', error);
    return NextResponse.json(
      { error: 'Error al obtener contactos' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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

    const body = await req.json();
    const { id, leido } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await query<ResultSetHeader>(
      'UPDATE contactos SET leido = ? WHERE id = ?',
      [leido ? 1 : 0, id]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error al actualizar contacto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar contacto' },
      { status: 500 }
    );
  }
}
