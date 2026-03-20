import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface CategoriaRow extends RowDataPacket {
  id_categoria: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
  icono: string | null;
  orden: number;
  activo: number;
}

export async function GET() {
  try {
    const sql = `
      SELECT c.*, 
             (SELECT COUNT(*) FROM productos WHERE categoria_id = c.id_categoria AND activo = 1) as num_productos
      FROM categorias c
      WHERE c.activo = 1
      ORDER BY c.orden ASC, c.nombre ASC
    `;

    const categorias = await query<CategoriaRow[]>(sql, []);

    const categoriasFormateadas = categorias.map(c => ({
      id: c.id_categoria,
      nombre: c.nombre,
      slug: c.slug,
      descripcion: c.descripcion,
      imagen: c.imagen,
      icono: c.icono,
      orden: c.orden,
      num_productos: c.num_productos,
    }));

    return NextResponse.json({ categorias: categoriasFormateadas });

  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}
