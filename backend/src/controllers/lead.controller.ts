import { Response } from 'express';
import Lead from '../models/Lead';
import { AuthenticatedRequest, LeadFilters, LeadStatus, LeadSource } from '../types';
import { sendSuccess, sendError } from '../utils/response';

const LEADS_PER_PAGE = 10;

const buildLeadQuery = (filters: LeadFilters, userId: string, isAdmin: boolean) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: Record<string, any> = {};

  // Sales users can only see their own leads
  if (!isAdmin) {
    query.createdBy = userId;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.source) {
    query.source = filters.source;
  }

  if (filters.search && filters.search.trim()) {
    const searchRegex = new RegExp(filters.search.trim(), 'i');
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  return query;
};

export const getLeads = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated', 401);
      return;
    }

    const filters: LeadFilters = {
      status: req.query.status as LeadStatus | undefined,
      source: req.query.source as LeadSource | undefined,
      search: req.query.search as string | undefined,
      sort: (req.query.sort as 'latest' | 'oldest') || 'latest',
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || LEADS_PER_PAGE,
    };

    const isAdmin = req.user.role === 'admin';
    const query = buildLeadQuery(filters, req.user.id, isAdmin);

    const sortOrder = filters.sort === 'oldest' ? 1 : -1;
    const skip = (filters.page! - 1) * filters.limit!;

    const [leads, totalCount] = await Promise.all([
      Lead.find(query)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(filters.limit!)
        .populate('createdBy', 'name email')
        .lean(),
      Lead.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / filters.limit!);

    sendSuccess(
      res,
      leads,
      'Leads retrieved successfully',
      200,
      {
        page: filters.page!,
        totalPages,
        totalCount,
        limit: filters.limit!,
        hasNextPage: filters.page! < totalPages,
        hasPrevPage: filters.page! > 1,
      }
    );
  } catch (error) {
    sendError(res, 'Failed to retrieve leads', 500);
  }
};

export const getLeadById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated', 401);
      return;
    }

    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .lean();

    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Sales users can only view their own leads
    if (
      req.user.role === 'sales' &&
      lead.createdBy.toString() !== req.user.id
    ) {
      sendError(res, 'Access denied', 403);
      return;
    }

    sendSuccess(res, lead, 'Lead retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve lead', 500);
  }
};

export const createLead = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated', 401);
      return;
    }

    const { name, email, status, source, notes } = req.body as {
      name: string;
      email: string;
      status?: LeadStatus;
      source: LeadSource;
      notes?: string;
    };

    const lead = await Lead.create({
      name,
      email,
      status: status || 'New',
      source,
      notes,
      createdBy: req.user.id,
    });

    const populated = await lead.populate('createdBy', 'name email');

    sendSuccess(res, populated, 'Lead created successfully', 201);
  } catch (error) {
    sendError(res, 'Failed to create lead', 500);
  }
};

export const updateLead = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated', 401);
      return;
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Sales users can only update their own leads
    if (
      req.user.role === 'sales' &&
      lead.createdBy.toString() !== req.user.id
    ) {
      sendError(res, 'Access denied', 403);
      return;
    }

    const allowedFields = ['name', 'email', 'status', 'source', 'notes'];
    const updates = Object.fromEntries(
      Object.entries(req.body as Record<string, unknown>).filter(([key]) =>
        allowedFields.includes(key)
      )
    );

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    sendSuccess(res, updatedLead, 'Lead updated successfully');
  } catch (error) {
    sendError(res, 'Failed to update lead', 500);
  }
};

export const deleteLead = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated', 401);
      return;
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }

    // Only admin or the creator can delete
    if (
      req.user.role === 'sales' &&
      lead.createdBy.toString() !== req.user.id
    ) {
      sendError(res, 'Access denied', 403);
      return;
    }

    await Lead.findByIdAndDelete(req.params.id);
    sendSuccess(res, null, 'Lead deleted successfully');
  } catch (error) {
    sendError(res, 'Failed to delete lead', 500);
  }
};

export const exportLeadsCSV = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Not authenticated', 401);
      return;
    }

    const filters: LeadFilters = {
      status: req.query.status as LeadStatus | undefined,
      source: req.query.source as LeadSource | undefined,
      search: req.query.search as string | undefined,
    };

    const isAdmin = req.user.role === 'admin';
    const query = buildLeadQuery(filters, req.user.id, isAdmin);

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .lean();

    // Build CSV string
    const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'];
    const rows = leads.map((lead) => [
      `"${lead.name}"`,
      `"${lead.email}"`,
      `"${lead.status}"`,
      `"${lead.source}"`,
      `"${lead.notes || ''}"`,
      `"${new Date(lead.createdAt).toISOString()}"`,
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="leads-${Date.now()}.csv"`
    );
    res.status(200).send(csv);
  } catch (error) {
    sendError(res, 'Failed to export leads', 500);
  }
};