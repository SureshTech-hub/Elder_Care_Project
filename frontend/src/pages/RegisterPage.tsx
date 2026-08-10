import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Lock,
  Mail,
  ArrowRight,
  User,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth.api';

const ROLES = [
  {
    value: 'ADMIN',
    label: 'Administrator',
    description: 'Full system access & user management',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/10 border-violet-500/40',
    activeBg: 'bg-violet-500/20 border-violet-500',
    dot: 'bg-violet-400',
  },
  {
    value: 'MANAGER',
    label: 'Manager',
    description: 'Team & operations oversight',
    color: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-500/10 border-blue-500/40',
    activeBg: 'bg-blue-500/20 border-blue-500',
    dot: 'bg-blue-400',
  },
  {
    value: 'ANALYST',
    label: 'Analyst',
    description: 'Data insights & reporting',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-500/10 border-emerald-500/40',
    activeBg: 'bg-emerald-500/20 border-emerald-500',
    dot: 'bg-emerald-400',
  },
  {
    value: 'FIELD_STAFF',
    label: 'Field Staff',
    description: 'On-ground care & task management',
    color: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-500/10 border-orange-500/40',
    activeBg: 'bg-orange-500/20 border-orange-500',
    dot: 'bg-orange-400',
  },
];

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('FIELD_STAFF');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !role) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authApi.register({ fullName, email, password, role, phone });
      if (res.success) {
        toast.success('Account created! Please sign in.');
        navigate('/login');
      } else {
        toast.error(res.message || 'Registration failed');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration error. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative w-full max-w-lg space-y-6 bg-slate-800/90 border border-slate-700/80 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-600/30">
            <HeartPulse className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Your Account</h1>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Elder Care Predictive Command Center
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Role Selector */}
          <div>
            <p className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Your Role
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`relative text-left p-3 rounded-xl border transition-all duration-200 ${
                    role === r.value ? r.activeBg : r.bg
                  } hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${r.dot}`} />
                    <span className="text-xs font-bold text-white">{r.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">{r.description}</p>
                  {role === r.value && (
                    <ShieldCheck className="absolute top-2 right-2 w-3.5 h-3.5 text-white/70" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input
                label="Full Name"
                type="text"
                placeholder="Dr. Jane Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@eldercare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Phone (Optional)"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4" />}
              />
            </div>
            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />
            </div>
            <div>
              <Input
                label="Confirm Password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="text-slate-400 hover:text-slate-200 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3"
            isLoading={isLoading}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account
          </Button>
        </form>

        <div className="text-center text-sm text-slate-400 pt-2 border-t border-slate-700/50">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
