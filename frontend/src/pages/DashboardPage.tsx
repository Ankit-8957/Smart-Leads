import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLeads } from '../hooks/useLeads';
import { Lead } from '../types';
import Navbar from '../components/layout/Navbar';
import FiltersBar from '../components/leads/FiltersBar';
import { LeadRow } from '../components/leads/LeadRow';
import LeadForm from '../components/leads/LeadForm';
import LeadDetail from '../components/leads/LeadDetail';
import Pagination from '../components/leads/Pagination';
import { Button, Spinner, EmptyState, ConfirmDialog } from '../components/ui';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { leads, isLoading, meta, filters, setFilters, refetch, deleteLead, exportCSV } =
    useLeads();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (lead: Lead) => {
    setEditLead(lead);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteLead(deleteTarget);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditLead(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Welcome, {user?.name} · {user?.role === 'admin' ? 'All leads visible' : 'Your leads'}
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Lead
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <FiltersBar
            filters={filters}
            onChange={setFilters}
            onExport={exportCSV}
            totalCount={meta?.totalCount}
          />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : leads.length === 0 ? (
            <EmptyState
              title="No leads found"
              description={
                filters.search || filters.status || filters.source
                  ? 'Try adjusting your filters'
                  : 'Add your first lead to get started'
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {leads.map((lead) => (
                    <LeadRow
                      key={lead._id}
                      lead={lead}
                      onEdit={handleEdit}
                      onDelete={(id) => setDeleteTarget(id)}
                      onView={(l) => setViewLead(l)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              meta={meta}
              onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <LeadForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={refetch}
        editLead={editLead}
      />
      <LeadDetail lead={viewLead} onClose={() => setViewLead(null)} />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DashboardPage;