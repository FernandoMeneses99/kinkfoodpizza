import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ResultSetHeader } from 'mysql2';
import { slugify } from '@/lib/validation';

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
    
    if (!body.nombre || !body.precio || !body.categoria_id) {
      return NextResponse.json(
        { error: 'Nombre, precio y categoría son requeridos' },
        { status: 400 }
      );
    }

    const slug = slugify(body.nombre);

    await query<ResultSetHeader>(
      `UPDATE productos SET 
        categoria_id = ?, nombre = ?, slug = ?, descripcion = ?, 
        precio = ?, precio_oferta = ?, ingredientes = ?, imagen = ?,
        tiempo_preparacion = ?, disponible = ?, destacado = ?, stock = ?
       WHERE id_producto = ?`,
      [
        body.categoria_id,
        body.nombre,
        slug,
        body.descripcion || null,
        body.precio,
        body.precio_oferta || null,
        body.ingredientes || null,
        body.imagen || null,
        body.tiempo_preparacion || 15,
        body.disponible ? 1 : 0,
        body.destacado ? 1 : 0,
        body.stock || 100,
        parseInt(id)
      ]
    );

    return NextResponse.json({ message: 'Producto actualizado' });

  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
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

    await query<ResultSetHeader>(
      'UPDATE productos SET activo = 0 WHERE id_producto = ?',
      [parseInt(id)]
    );

    return NextResponse.json({ message: 'Producto eliminado' });

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}
