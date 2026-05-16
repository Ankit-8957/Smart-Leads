import { Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const register = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: 'admin' | 'sales';
    };

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, 'Email already in use', 409);
      return;
    }

    const user = await User.create({ name, email, password, role: role || 'sales' });

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    sendSuccess(
      res,
      { user, token },
      'Registration successful',
      201
    );
  } catch (error) {
    sendError(res, 'Registration failed', 500);
  }
};

export const login = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Don't send password in response
    const userObj = user.toJSON();

    sendSuccess(res, { user: userObj, token }, 'Login successful');
  } catch (error) {
    sendError(res, 'Login failed', 500);
  }
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated', 401);
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(res, user, 'User profile retrieved');
  } catch (error) {
    sendError(res, 'Failed to get user profile', 500);
  }
};