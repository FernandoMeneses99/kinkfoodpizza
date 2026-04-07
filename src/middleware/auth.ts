import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, JWTPayload } from '@/lib/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  const cookieToken = req.cookies.get('access_token')?.value;
  if (cookieToken) {
    return cookieToken;
  }
  
  return null;
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const token = getTokenFromRequest(req);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    try {
      const user = verifyAccessToken(token);
      (req as AuthenticatedRequest).user = user;
      return handler(req as AuthenticatedRequest);
    } catch {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }
  };
}

export function withRole(...roles: Array<'admin' | 'cliente' | 'repartidor'>) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return withAuth(async (req: AuthenticatedRequest) => {
      const user = req.user!;
      
      if (!roles.includes(user.rol)) {
        return NextResponse.json(
          { error: 'No tienes permisos para realizar esta acción' },
          { status: 403 }
        );
      }
      
      return handler(req);
    });
  };
}

export function withAdmin(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withRole('admin')(handler);
}
