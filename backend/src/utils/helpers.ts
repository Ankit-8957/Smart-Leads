import jwt, { SignOptions } from 'jsonwebtoken';

export const generateToken = (
  payload: { id: string; email: string; role: string },
  expiresIn = '7d'
): string => {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', options);
};

export const paginate = (page: number, limit: number) => ({
  skip: (page - 1) * limit,
  limit,
});
