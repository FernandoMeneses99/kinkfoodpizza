import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, createTokens, updateLastLogin } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';
import { RowDataPacket } from 'mysql2';

export async function POST(req: NextRequest) {
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

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const user = users[0];

    if (!user.activo) {
      return NextResponse.json(
        { error: 'Tu cuenta ha sido desactivada' },
        { status: 403 }
      );
    }

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

    return NextResponse.json({
      message: 'Login exitoso',
      user: {
        id: user.id_usuario,
        email: user.email,
        nombre: user.nombre,
        telefono: user.telefono,
        rol: user.rol
      },
      ...tokens
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
