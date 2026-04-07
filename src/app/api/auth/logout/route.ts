import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, invalidateRefreshTokens } from '@/lib/auth';
import { getAccessToken, clearAuthCookies } from '@/lib/cookies';

export async function POST(req: NextRequest) {
  try {
    const accessToken = getAccessToken(req);
    
    if (accessToken) {
      try {
        const payload = verifyAccessToken(accessToken);
        await invalidateRefreshTokens(payload.id);
      } catch {
        // Token inválido pero continuamos con logout
      }
    }

    const response = NextResponse.json({
      message: 'Sesión cerrada exitosamente'
    });

    return clearAuthCookies(response);

  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}
