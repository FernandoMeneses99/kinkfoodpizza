import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { productoSchema, slugify } from '@/lib/validation';

interface ProductoAdminRow extends RowDataPacket {
  id_producto: number;
  categoria_id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  precio: number;
  precio_oferta: number | null;
  imagen: string | null;
  ingredientes: string | null;
  disponible: number;
  destacado: number;
  tiempo_preparacion: number;
  stock: number;
  orden: number;
  activo: number;
  categoria_nombre: string;
}

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
    const activo = searchParams.get('activo');

    let sql = `
      SELECT p.*, c.nombre as categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id_categoria
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (activo !== null) {
      sql += ' AND p.activo = ?';
      params.push(activo === 'true' ? 1 : 0);
    }

    sql += ' ORDER BY p.id_producto DESC';

    const productos = await query<ProductoAdminRow[]>(sql, params);

    const productosFormateados = productos.map(p => ({
      id: p.id_producto,
      categoria_id: p.categoria_id,
      categoria_nombre: p.categoria_nombre,
      nombre: p.nombre,
      slug: p.slug,
      descripcion: p.descripcion,
      precio: parseFloat(p.precio.toString()),
      precio_oferta: p.precio_oferta ? parseFloat(p.precio_oferta.toString()) : null,
      imagen: p.imagen,
      ingredientes: p.ingredientes,
      disponible: Boolean(p.disponible),
      destacado: Boolean(p.destacado),
      tiempo_preparacion: p.tiempo_preparacion,
      stock: p.stock,
      orden: p.orden,
      activo: Boolean(p.activo),
    }));

    return NextResponse.json({ productos: productosFormateados });

  } catch (error) {
    console.error('Error al obtener productos admin:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
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
    
    if (payload.rol !== 'admin') {
      return NextResponse.json({ error: 'Solo administradores' }, { status: 403 });
    }

    const body = await req.json();
    
    const { error, value } = productoSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }

    const slug = slugify(value.nombre);
    
    const existingSlug = await query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM productos WHERE slug = ?',
      [slug]
    );
    
    const finalSlug = existingSlug[0].total > 0 ? `${slug}-${Date.now()}` : slug;

    const result = await query<ResultSetHeader>(
      `INSERT INTO productos (categoria_id, nombre, slug, descripcion, precio, precio_oferta, ingredientes, tiempo_preparacion, disponible, destacado, stock, orden)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        value.categoria_id,
        value.nombre,
        finalSlug,
        value.descripcion,
        value.precio,
        value.precio_oferta,
        value.ingredientes,
        value.tiempo_preparacion,
        value.disponible ? 1 : 0,
        value.destacado ? 1 : 0,
        value.stock,
        value.orden || 0
      ]
    );

    return NextResponse.json({
      message: 'Producto creado exitosamente',
      id: result.insertId
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}
