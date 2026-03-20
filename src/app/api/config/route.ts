import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const config = await query<RowDataPacket[]>(
      'SELECT clave, valor, grupo FROM configuracion'
    );

    const configFormateada: Record<string, string> = {};
    
    config.forEach(c => {
      configFormateada[c.clave] = c.valor;
    });

    if (!configFormateada.horario_apertura) {
      configFormateada.horario_apertura = '10:00';
    }
    if (!configFormateada.horario_cierre) {
      configFormateada.horario_cierre = '22:00';
    }

    return NextResponse.json({ 
      negocio: configFormateada,
      success: true 
    });

  } catch (error) {
    console.error('Error al obtener configuración:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}
