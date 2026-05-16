import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Select, Button } from '../components/ui';
import toast from 'react-hot-toast';

interface FormState {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'sales';
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

const ROLE_OPTIONS = [
  { value: 'sales', label: 'Sales User' },
  { value: 'admin', label: 'Admin' },
];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    role: 'sales',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name || form.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password || form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password))
      errs.password = 'Must contain uppercase, lowercase, and a number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange =
    (field: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((p) => ({ ...p, [field]: e.target.value }));
        if (errors[field as keyof FormErrors]) setErrors((p) => ({ ...p, [field]: undefined }));
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Account created! Welcome.');
      navigate('/dashboard');
    } catch {
      toast.error('Registration failed. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Smart Leads</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              placeholder="Rahul Sharma"
              value={form.name}
              onChange={handleChange('name')}
              error={errors.name}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min 8 chars with uppercase and number"
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
              autoComplete="new-password"
              required
            />
            <Select
              label="Role"
              value={form.role}
              onChange={handleChange('role')}
              options={ROLE_OPTIONS}
            />
            <Button type="submit" size="lg" isLoading={isLoading} className="mt-2 w-full">
              Create account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;