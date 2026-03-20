import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { categoriaSchema, slugify } from '@/lib/validation';

interface CategoriaAdminRow extends RowDataPacket {
  id_categoria: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
  icono: string | null;
  orden: number;
  activo: number;
  num_productos: number;
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

    const sql = `
      SELECT c.*, 
             (SELECT COUNT(*) FROM productos WHERE categoria_id = c.id_categoria AND activo = 1) as num_productos
      FROM categorias c
      ORDER BY c.orden ASC, c.nombre ASC
    `;

    const categorias = await query<CategoriaAdminRow[]>(sql, []);

    const categoriasFormateadas = categorias.map(c => ({
      id: c.id_categoria,
      nombre: c.nombre,
      slug: c.slug,
      descripcion: c.descripcion,
      imagen: c.imagen,
      icono: c.icono,
      orden: c.orden,
      activo: Boolean(c.activo),
      num_productos: c.num_productos,
    }));

    return NextResponse.json({ categorias: categoriasFormateadas });

  } catch (error) {
    console.error('Error al obtener categorías admin:', error);
    return NextResponse.json(
      { error: 'Error al obtener categorías' },
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
    
    const { error, value } = categoriaSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }

    const slug = slugify(value.nombre);

    const result = await query<ResultSetHeader>(
      `INSERT INTO categorias (nombre, slug, descripcion, icono, orden, activo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        value.nombre,
        slug,
        value.descripcion,
        value.icono,
        value.orden,
        value.activo ? 1 : 0
      ]
    );

    return NextResponse.json({
      message: 'Categoría creada',
      id: result.insertId
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear categoría:', error);
    return NextResponse.json(
      { error: 'Error al crear categoría' },
      { status: 500 }
    );
  }
}
