import { body, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    sendError(res, 'Validation Error', 400, errors.array().map(e => e.msg));
    return;
  }
  next();
};

export const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['sales', 'admin']).withMessage('Invalid role'),
  validate,
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

export const createLeadValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('source').isIn(['Website', 'Instagram', 'Referral']).withMessage('Valid source is required'),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
  validate,
];

export const updateLeadValidation = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('source').optional().isIn(['Website', 'Instagram', 'Referral']).withMessage('Valid source is required'),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
  validate,
];

export const leadFiltersValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1 }).toInt(),
  query('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']),
  query('source').optional().isIn(['Website', 'Instagram', 'Referral']),
  validate,
];
