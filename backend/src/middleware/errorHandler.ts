import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { sendError } from '../utils/response';

interface AppError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
  path?: string;
  value?: unknown;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Error:', err);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    sendError(res, `${field} already exists.`, 409);
    return;
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    sendError(res, 'Validation failed', 422, messages);
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    sendError(res, `Invalid ${err.path}: ${String(err.value)}`, 400);
    return;
  }

  // Custom error with status code
  if (err.statusCode) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Default to 500
  sendError(res, 'Internal server error', 500);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};