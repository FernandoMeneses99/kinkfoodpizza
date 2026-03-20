import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

async function handler(req: AuthenticatedRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.substring(7);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token requerido' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);

    return NextResponse.json({
      user: {
        id: user.id_usuario,
        email: user.email,
        nombre: user.nombre,
        telefono: user.telefono,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Error en /me:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuario' },
      { status: 401 }
    );
  }
}

export { handler as GET };
