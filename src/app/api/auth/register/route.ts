import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, createTokens } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { error, value } = registerSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }

    const { nombre, email, telefono, password } = value;

    const existingUsers = await query<(RowDataPacket & { total: number })[]>(
      'SELECT COUNT(*) as total FROM usuarios WHERE email = ?',
      [email]
    );

    if (existingUsers[0].total > 0) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const result = await query<ResultSetHeader>(
      `INSERT INTO usuarios (email, password_hash, nombre, telefono, rol) 
       VALUES (?, ?, ?, ?, 'cliente')`,
      [email, passwordHash, nombre, telefono]
    );

    const userId = result.insertId;

    const tokens = await createTokens({
      id: userId,
      email,
      rol: 'cliente'
    });

    return NextResponse.json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: userId,
        email,
        nombre,
        telefono,
        rol: 'cliente'
      },
      ...tokens
    }, { status: 201 });

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
