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

    const { searchParams } = new URL(req.url);
    const grupo = searchParams.get('grupo');

    let sql = 'SELECT * FROM configuracion';
    const params: string[] = [];

    if (grupo) {
      sql += ' WHERE grupo = ?';
      params.push(grupo);
    }

    sql += ' ORDER BY grupo, clave';

    const config = await query<RowDataPacket[]>(sql, params);

    const configFormateada: Record<string, Record<string, string>> = {};
    
    config.forEach(c => {
      if (!configFormateada[c.grupo]) {
        configFormateada[c.grupo] = {};
      }
      configFormateada[c.grupo][c.clave] = c.valor;
    });

    return NextResponse.json({ configuracion: configFormateada });

  } catch (error) {
    console.error('Error al obtener configuración:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
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
    const { clave, valor } = body;

    if (!clave) {
      return NextResponse.json({ error: 'Clave requerida' }, { status: 400 });
    }

    const existing = await query<RowDataPacket[]>(
      'SELECT id_config FROM configuracion WHERE clave = ?',
      [clave]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Configuración no encontrada' }, { status: 404 });
    }

    await query<ResultSetHeader>(
      'UPDATE configuracion SET valor = ? WHERE clave = ?',
      [valor, clave]
    );

    return NextResponse.json({ message: 'Configuración actualizada' });

  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}
