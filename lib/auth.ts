import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Admin credentials (in production, store in DB)
const ADMIN_CREDENTIALS = {
  email: 'admin@aariyatech.com',
  password: 'Admin@123', // In production, this should be hashed in DB
  name: 'Admin User',
  role: 'admin',
};

export interface JWTPayload {
  email: string;
  name: string;
  role: string;
}

// Verify admin credentials
export async function verifyAdminCredentials(email: string, password: string) {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return {
      email: ADMIN_CREDENTIALS.email,
      name: ADMIN_CREDENTIALS.name,
      role: ADMIN_CREDENTIALS.role,
    };
  }
  return null;
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}