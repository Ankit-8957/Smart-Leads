import React from 'react';

// ─── Button ─────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600',
    secondary:
      'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost:
      'hover:bg-gray-100 text-gray-600 focus:ring-gray-400 dark:hover:bg-gray-700 dark:text-gray-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : null}
      {children}
    </button>
  );
};

// ─── Input ──────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </span>
        )}
        <input
          className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400
            focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
            dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-9' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

// ─── Select ─────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
          focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
          dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : ''}
          ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

// ─── Textarea ───────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
    )}
    <textarea
      rows={3}
      className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 resize-none
        focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
        dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100
        ${error ? 'border-red-500' : ''}
        ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// ─── Badge ──────────────────────────────────────────────────────────────────
type BadgeVariant = 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const badgeColors: Record<BadgeVariant, string> = {
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'gray', children }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColors[variant]}`}>
    {children}
  </span>
);

// ─── Spinner ────────────────────────────────────────────────────────────────
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div
      className={`${sizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
};

// ─── Modal ──────────────────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${sizes[size]} bg-white dark:bg-gray-900 rounded-xl shadow-xl`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ─── EmptyState ─────────────────────────────────────────────────────────────
export const EmptyState: React.FC<{ title: string; description?: string }> = ({
  title,
  description,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">{title}</h3>
    {description && (
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
    )}
  </div>
);

// ─── ConfirmDialog ──────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{message}</p>
    <div className="flex gap-3 justify-end">
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
        Delete
      </Button>
    </div>
  </Modal>
);