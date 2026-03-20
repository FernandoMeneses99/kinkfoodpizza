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
    
    if (payload.rol !== 'cliente') {
      return NextResponse.json({ error: 'Solo clientes' }, { status: 403 });
    }

    const canasta = await query<RowDataPacket[]>(
      `SELECT c.*, p.nombre, p.precio, p.imagen, p.disponible, p.stock
       FROM canasta c
       JOIN productos p ON c.producto_id = p.id_producto
       WHERE c.usuario_id = ?`,
      [payload.id]
    );

    const items = canasta.map(item => ({
      id: item.id_canasta,
      producto_id: item.producto_id,
      nombre: item.nombre,
      precio: parseFloat(item.precio.toString()),
      imagen: item.imagen,
      cantidad: item.cantidad,
      observaciones: item.observaciones,
      disponible: Boolean(item.disponible),
      stock: item.stock,
      subtotal: parseFloat(item.precio.toString()) * item.cantidad,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

    const config = await query<RowDataPacket[]>(
      `SELECT valor FROM configuracion WHERE clave IN ('domicilio_gratis_desde', 'costo_domicilio')`
    );

    let domicilioGratis = 70000;
    let costoDomicilio = 5000;

    config.forEach(c => {
      if (c.clave === 'domicilio_gratis_desde') domicilioGratis = parseFloat(c.valor);
      if (c.clave === 'costo_domicilio') costoDomicilio = parseFloat(c.valor);
    });

    const costoEnvio = subtotal >= domicilioGratis ? 0 : costoDomicilio;
    const total = subtotal + costoEnvio;

    return NextResponse.json({
      items,
      subtotal,
      costo_envio: costoEnvio,
      domicilio_gratis: domicilioGratis,
      total,
    });

  } catch (error) {
    console.error('Error al obtener canasta:', error);
    return NextResponse.json(
      { error: 'Error al obtener canasta' },
      { status: 500 }
    );
  }
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
    const { producto_id, cantidad, observaciones } = body;

    if (!producto_id || !cantidad) {
      return NextResponse.json({ error: 'Datos requeridos' }, { status: 400 });
    }

    const producto = await query<RowDataPacket[]>(
      'SELECT id_producto, disponible, stock FROM productos WHERE id_producto = ? AND activo = 1',
      [producto_id]
    );

    if (producto.length === 0) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    if (!producto[0].disponible) {
      return NextResponse.json({ error: 'Producto no disponible' }, { status: 400 });
    }

    const existingItem = await query<RowDataPacket[]>(
      'SELECT id_canasta, cantidad FROM canasta WHERE usuario_id = ? AND producto_id = ?',
      [payload.id, producto_id]
    );

    let message = 'Producto agregado a la canasta';
    let newCantidad = cantidad;

    if (existingItem.length > 0) {
      newCantidad = existingItem[0].cantidad + cantidad;
      
      if (newCantidad > producto[0].stock) {
        return NextResponse.json({ error: 'Stock insuficiente' }, { status: 400 });
      }

      await query<ResultSetHeader>(
        'UPDATE canasta SET cantidad = ?, observaciones = ? WHERE id_canasta = ?',
        [newCantidad, observaciones || null, existingItem[0].id_canasta]
      );
      message = 'Cantidad actualizada en la canasta';
    } else {
      await query<ResultSetHeader>(
        'INSERT INTO canasta (usuario_id, producto_id, cantidad, observaciones) VALUES (?, ?, ?, ?)',
        [payload.id, producto_id, cantidad, observaciones || null]
      );
    }

    return NextResponse.json({ message });

  } catch (error) {
    console.error('Error al agregar a canasta:', error);
    return NextResponse.json(
      { error: 'Error al agregar a canasta' },
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
    
    if (payload.rol !== 'cliente') {
      return NextResponse.json({ error: 'Solo clientes' }, { status: 403 });
    }

    const body = await req.json();
    const { producto_id, cantidad, observaciones } = body;

    if (!producto_id) {
      return NextResponse.json({ error: 'ID de producto requerido' }, { status: 400 });
    }

    if (cantidad <= 0) {
      await query<ResultSetHeader>(
        'DELETE FROM canasta WHERE usuario_id = ? AND producto_id = ?',
        [payload.id, producto_id]
      );
      return NextResponse.json({ message: 'Producto eliminado de la canasta' });
    }

    await query<ResultSetHeader>(
      'UPDATE canasta SET cantidad = ?, observaciones = ? WHERE usuario_id = ? AND producto_id = ?',
      [cantidad, observaciones || null, payload.id, producto_id]
    );

    return NextResponse.json({ message: 'Canasta actualizada' });

  } catch (error) {
    console.error('Error al actualizar canasta:', error);
    return NextResponse.json(
      { error: 'Error al actualizar canasta' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const producto_id = searchParams.get('producto_id');

    if (producto_id) {
      await query<ResultSetHeader>(
        'DELETE FROM canasta WHERE usuario_id = ? AND producto_id = ?',
        [payload.id, parseInt(producto_id)]
      );
      return NextResponse.json({ message: 'Producto eliminado' });
    }

    await query<ResultSetHeader>(
      'DELETE FROM canasta WHERE usuario_id = ?',
      [payload.id]
    );

    return NextResponse.json({ message: 'Canasta vaciada' });

  } catch (error) {
    console.error('Error al limpiar canasta:', error);
    return NextResponse.json(
      { error: 'Error al limpiar canasta' },
      { status: 500 }
    );
  }
}
