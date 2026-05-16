import React from 'react';
import { Lead, LeadStatus, LeadSource } from '../../types';
import { Badge } from '../ui';

type BadgeVariant = 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple';

export const getStatusBadge = (status: LeadStatus): { variant: BadgeVariant; label: string } => {
  const map: Record<LeadStatus, { variant: BadgeVariant; label: string }> = {
    New: { variant: 'blue', label: 'New' },
    Contacted: { variant: 'yellow', label: 'Contacted' },
    Qualified: { variant: 'green', label: 'Qualified' },
    Lost: { variant: 'red', label: 'Lost' },
  };
  return map[status];
};

export const getSourceBadge = (source: LeadSource): { variant: BadgeVariant; label: string } => {
  const map: Record<LeadSource, { variant: BadgeVariant; label: string }> = {
    Website: { variant: 'blue', label: 'Website' },
    Instagram: { variant: 'purple', label: 'Instagram' },
    Referral: { variant: 'green', label: 'Referral' },
  };
  return map[source];
};

interface LeadRowProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onView: (lead: Lead) => void;
}

export const LeadRow: React.FC<LeadRowProps> = ({ lead, onEdit, onDelete, onView }) => {
  const status = getStatusBadge(lead.status);
  const source = getSourceBadge(lead.source);
  const createdAt = new Date(lead.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{lead.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{lead.email}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <Badge variant={status.variant}>{status.label}</Badge>
      </td>
      <td className="px-6 py-4">
        <Badge variant={source.variant}>{source.label}</Badge>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{createdAt}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(lead)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="View"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => onEdit(lead)}
            className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(lead._id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};