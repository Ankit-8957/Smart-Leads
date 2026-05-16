import jwt from 'jsonwebtoken';
import { JwtPayload, UserRole } from '../types';

export const generateToken = (payload: {
  id: string;
  email: string;
  role: UserRole;
}): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error('JWT_SECRET is not defined');

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, jwtSecret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error('JWT_SECRET is not defined');
  return jwt.verify(token, jwtSecret) as JwtPayload;
};