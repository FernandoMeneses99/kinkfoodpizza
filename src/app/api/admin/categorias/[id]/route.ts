import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { categoriaSchema, slugify } from '@/lib/validation';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    const body = await req.json();
    
    const { error, value } = categoriaSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }

    const slug = slugify(value.nombre);

    await query<ResultSetHeader>(
      `UPDATE categorias SET 
        nombre = ?, slug = ?, descripcion = ?, icono = ?, orden = ?, activo = ?
       WHERE id_categoria = ?`,
      [
        value.nombre,
        slug,
        value.descripcion,
        value.icono,
        value.orden,
        value.activo ? 1 : 0,
        parseInt(id)
      ]
    );

    return NextResponse.json({ message: 'Categoría actualizada' });

  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return NextResponse.json(
      { error: 'Error al actualizar categoría' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;

    const productosCount = await query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM productos WHERE categoria_id = ? AND activo = 1',
      [parseInt(id)]
    );

    if (productosCount[0].total > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar una categoría con productos activos' },
        { status: 400 }
      );
    }

    await query<ResultSetHeader>(
      'DELETE FROM categorias WHERE id_categoria = ?',
      [parseInt(id)]
    );

    return NextResponse.json({ message: 'Categoría eliminada' });

  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    return NextResponse.json(
      { error: 'Error al eliminar categoría' },
      { status: 500 }
    );
  }
}
