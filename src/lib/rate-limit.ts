import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 100;

function cleanExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

setInterval(cleanExpiredEntries, WINDOW_MS);

export function rateLimit(limit: number = MAX_REQUESTS, windowMs: number = WINDOW_MS) {
  return (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    const key = `rate_${ip}`;
    const now = Date.now();
    
    let entry = rateLimitStore.get(key);
    
    if (!entry || entry.resetTime < now) {
      entry = {
        count: 1,
        resetTime: now + windowMs
      };
      rateLimitStore.set(key, entry);
      return null;
    }
    
    entry.count++;
    
    if (entry.count > limit) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      
      return NextResponse.json(
        { 
          error: 'Demasiadas solicitudes. Por favor intenta más tarde.',
          retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString()
          }
        }
      );
    }
    
    return null;
  };
}

export function strictRateLimit(limit: number = 5, windowMs: number = 60 * 1000) {
  return rateLimit(limit, windowMs);
}

export function authRateLimit() {
  return strictRateLimit(5, 60 * 1000);
}

export function apiRateLimit() {
  return rateLimit(100, 60 * 1000);
}
