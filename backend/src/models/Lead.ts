import mongoose, { Schema } from 'mongoose';
import { ILead, LeadStatus, LeadSource } from '../types';

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'] satisfies LeadStatus[],
      default: 'New',
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'] satisfies LeadSource[],
      required: [true, 'Source is required'],
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      trim: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for filtering and search
leadSchema.index({ status: 1, source: 1 });
leadSchema.index({ name: 'text', email: 'text' });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ createdBy: 1 });

const Lead = mongoose.model<ILead>('Lead', leadSchema);
export default Lead;