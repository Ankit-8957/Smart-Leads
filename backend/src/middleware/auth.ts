import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JwtPayload, UserRole } from '../types';
import { sendError } from '../utils/response';

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Access denied. No token provided.', 401);
    return;
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    sendError(res, 'Internal server error', 500);
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      sendError(res, 'Token has expired. Please login again.', 401);
    } else if (error instanceof jwt.JsonWebTokenError) {
      sendError(res, 'Invalid token.', 401);
    } else {
      sendError(res, 'Authentication failed.', 401);
    }
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(
        res,
        `Access denied. Required role: ${roles.join(' or ')}.`,
        403
      );
      return;
    }

    next();
  };
};