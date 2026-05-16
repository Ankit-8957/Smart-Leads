import React, { useState, useEffect } from 'react';
import { Lead, CreateLeadPayload, LeadStatus, LeadSource } from '../../types';
import { Modal, Input, Select, Textarea, Button } from '../ui';
import { leadService } from '../../services/leadService';
import toast from 'react-hot-toast';

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editLead?: Lead | null;
}

const STATUS_OPTIONS = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const SOURCE_OPTIONS = [
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

interface FormData {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource | '';
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  source?: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  status: 'New',
  source: '',
  notes: '',
};

const LeadForm: React.FC<LeadFormProps> = ({ isOpen, onClose, onSuccess, editLead }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editLead) {
      setFormData({
        name: editLead.name,
        email: editLead.email,
        status: editLead.status,
        source: editLead.source,
        notes: editLead.notes || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [editLead, isOpen]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.source) {
      newErrors.source = 'Source is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: CreateLeadPayload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        status: formData.status,
        source: formData.source as LeadSource,
        notes: formData.notes.trim() || undefined,
      };

      if (editLead) {
        await leadService.updateLead(editLead._id, payload);
        toast.success('Lead updated successfully');
      } else {
        await leadService.createLead(payload);
        toast.success('Lead created successfully');
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : editLead
            ? 'Failed to update lead'
            : 'Failed to create lead';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editLead ? 'Edit Lead' : 'Add New Lead'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          placeholder="e.g. Rahul Sharma"
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="e.g. rahul@example.com"
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            value={formData.status}
            onChange={handleChange('status')}
            options={STATUS_OPTIONS}
          />
          <Select
            label="Source"
            value={formData.source}
            onChange={handleChange('source')}
            options={SOURCE_OPTIONS}
            placeholder="Select source"
            error={errors.source}
            required
          />
        </div>
        <Textarea
          label="Notes (optional)"
          placeholder="Any additional notes..."
          value={formData.notes}
          onChange={handleChange('notes')}
          maxLength={500}
        />
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {editLead ? 'Update Lead' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LeadForm;