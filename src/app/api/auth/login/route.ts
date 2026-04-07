import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, createTokens, updateLastLogin } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';
import { setAuthCookies } from '@/lib/cookies';
import { authRateLimit } from '@/lib/rate-limit';
import { RowDataPacket } from 'mysql2';

export async function POST(req: NextRequest) {
  const rateLimitResult = authRateLimit()(req);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const body = await req.json();
    
    const { error, value } = loginSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }

    const { email, password } = value;

    const users = await query<(RowDataPacket & {
      id_usuario: number;
      email: string;
      password_hash: string;
      nombre: string;
      telefono: string;
      rol: 'admin' | 'cliente' | 'repartidor';
      activo: number;
    })[]>(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0 || !users[0].activo) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const user = users[0];
    
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const tokens = await createTokens({
      id: user.id_usuario,
      email: user.email,
      rol: user.rol
    });

    await updateLastLogin(user.id_usuario);

    const userData = {
      id: user.id_usuario,
      email: user.email,
      nombre: user.nombre,
      telefono: user.telefono,
      rol: user.rol
    };

    const response = NextResponse.json({
      message: 'Login exitoso',
      user: userData
    });

    return setAuthCookies(response, tokens.accessToken, tokens.refreshToken, userData);

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
