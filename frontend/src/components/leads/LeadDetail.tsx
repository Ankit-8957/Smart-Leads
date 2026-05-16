import React from 'react';
import { Lead, User } from '../../types';
import { Modal, Badge } from '../ui';
import { getStatusBadge, getSourceBadge } from './LeadRow';

interface LeadDetailProps {
  lead: Lead | null;
  onClose: () => void;
}

const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onClose }) => {
  if (!lead) return null;

  const status = getStatusBadge(lead.status);
  const source = getSourceBadge(lead.source);
  const createdBy = lead.createdBy as User;
  const createdAt = new Date(lead.createdAt).toLocaleString('en-IN', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return (
    <Modal isOpen={!!lead} onClose={onClose} title="Lead Details">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{lead.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{lead.email}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant={status.variant}>{status.label}</Badge>
            <Badge variant={source.variant}>{source.label}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Status</p>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Source</p>
            <Badge variant={source.variant}>{source.label}</Badge>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Created by</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {typeof createdBy === 'string' ? createdBy : createdBy?.name || 'Unknown'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Created at</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{createdAt}</p>
          </div>
        </div>

        {lead.notes && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Notes</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              {lead.notes}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LeadDetail;