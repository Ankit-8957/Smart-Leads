import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/lead.controller';
import { authenticate, authorize } from '../middleware/auth';
import {
  createLeadValidation,
  updateLeadValidation,
  leadFiltersValidation,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/export', exportLeadsCSV);
router.get('/', leadFiltersValidation, getLeads);
router.get('/:id', getLeadById);
router.post('/', createLeadValidation, createLead);
router.put('/:id', updateLeadValidation, updateLead);
router.delete('/:id', authorize('admin', 'sales'), deleteLead);

export default router;