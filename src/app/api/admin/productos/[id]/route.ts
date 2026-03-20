import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ResultSetHeader } from 'mysql2';
import { productoSchema, slugify } from '@/lib/validation';

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
    
    const { error, value } = productoSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }

    const slug = slugify(value.nombre);

    await query<ResultSetHeader>(
      `UPDATE productos SET 
        categoria_id = ?, nombre = ?, slug = ?, descripcion = ?, 
        precio = ?, precio_oferta = ?, ingredientes = ?, 
        tiempo_preparacion = ?, disponible = ?, destacado = ?, stock = ?
       WHERE id_producto = ?`,
      [
        value.categoria_id,
        value.nombre,
        slug,
        value.descripcion,
        value.precio,
        value.precio_oferta,
        value.ingredientes,
        value.tiempo_preparacion,
        value.disponible ? 1 : 0,
        value.destacado ? 1 : 0,
        value.stock,
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
