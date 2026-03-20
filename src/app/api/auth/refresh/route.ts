import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token requerido' },
        { status: 400 }
      );
    }

    const tokens = await refreshAccessToken(refreshToken);

    return NextResponse.json({
      message: 'Token refrescado exitosamente',
      ...tokens
    });

  } catch (error) {
    console.error('Error en refresh:', error);
    return NextResponse.json(
      { error: 'Refresh token inválido o expirado' },
      { status: 401 }
    );
  }
}
