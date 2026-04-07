import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyAccessToken, getUserFromToken } from '@/lib/auth';
import { getAccessToken, getUserFromCookies } from '@/lib/cookies';

export async function GET(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    try {
      verifyAccessToken(accessToken);
    } catch {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(accessToken);
    
    return NextResponse.json({
      user: {
        id: user.id_usuario,
        email: user.email,
        nombre: user.nombre,
        telefono: user.telefono,
        rol: user.rol
      },
      token: accessToken
    });

  } catch (error) {
    console.error('Error en /me:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuario' },
      { status: 401 }
    );
  }
}
