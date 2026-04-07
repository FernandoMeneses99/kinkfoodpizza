import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from './db';
import { RowDataPacket } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET!;
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const REFRESH_TOKEN_EXPIRES = 7 * 24 * 60 * 60 * 1000;

export interface JWTPayload {
  id: number;
  email: string;
  rol: 'admin' | 'cliente' | 'repartidor';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function generateRefreshToken(): string {
  return uuidv4();
}

export async function createTokens(user: JWTPayload): Promise<TokenPair> {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES);
  
  await query(
    'INSERT INTO tokens_refresh (usuario_id, token, expira_en) VALUES (?, ?, ?)',
    [user.id, refreshToken, expiresAt]
  );
  
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    throw new Error('Token inválido o expirado');
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<TokenPair> {
  const tokens = await query<(RowDataPacket & { 
    id_token: number; 
    usuario_id: number; 
    expira_en: Date 
  })[]>(
    `SELECT * FROM tokens_refresh 
     WHERE token = ? AND invalidado = 0 AND expira_en > NOW()`,
    [refreshToken]
  );
  
  if (tokens.length === 0) {
    throw new Error('Refresh token inválido o expirado');
  }
  
  const tokenData = tokens[0];
  
  await query(
    'UPDATE tokens_refresh SET usado = 1 WHERE id_token = ?',
    [tokenData.id_token]
  );
  
  const users = await query<(RowDataPacket & { id_usuario: number; email: string; rol: 'admin' | 'cliente' | 'repartidor' })[]>(
    'SELECT id_usuario, email, rol FROM usuarios WHERE id_usuario = ? AND activo = 1',
    [tokenData.usuario_id]
  );
  
  if (users.length === 0) {
    throw new Error('Usuario no encontrado o inactivo');
  }
  
  const user = users[0];
  return createTokens({
    id: user.id_usuario,
    email: user.email,
    rol: user.rol
  });
}

export async function invalidateRefreshTokens(userId: number): Promise<void> {
  await query(
    'UPDATE tokens_refresh SET invalidado = 1 WHERE usuario_id = ?',
    [userId]
  );
}

export async function getUserFromToken(token: string) {
  const payload = verifyAccessToken(token);
  
  const users = await query<(RowDataPacket & { 
    id_usuario: number; 
    email: string; 
    nombre: string;
    telefono: string;
    rol: string;
  })[]>(
    `SELECT id_usuario, email, nombre, telefono, rol 
     FROM usuarios 
     WHERE id_usuario = ? AND activo = 1`,
    [payload.id]
  );
  
  if (users.length === 0) {
    throw new Error('Usuario no encontrado');
  }
  
  return users[0];
}

export async function updateLastLogin(userId: number): Promise<void> {
  await query(
    'UPDATE usuarios SET ultimo_login = NOW() WHERE id_usuario = ?',
    [userId]
  );
}
