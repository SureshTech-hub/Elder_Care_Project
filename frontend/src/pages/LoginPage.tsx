import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Zap,
  UserCircle2,
} from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth.api';
import toast from 'react-hot-toast';

// Demo credentials for each role
const DEMO_CREDENTIALS = [
  {
    role: 'ADMIN',
    label: 'Administrator',
    email: 'admin@eldercare.com',
    password: 'Admin@123',
    description: 'Full system access',
    color: 'from-violet-500 to-purple-600',
    lightColor: 'text-violet-400',
    bgColor: 'bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30 hover:border-violet-400',
    activeBg: 'bg-violet-500/25 border-violet-400',
    dot: 'bg-violet-400',
  },
  {
    role: 'MANAGER',
    label: 'Manager',
    email: 'manager@eldercare.com',
    password: 'Manager@123',
    description: 'Operations oversight',
    color: 'from-blue-500 to-cyan-600',
    lightColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 hover:border-blue-400',
    activeBg: 'bg-blue-500/25 border-blue-400',
    dot: 'bg-blue-400',
  },
  {
    role: 'ANALYST',
    label: 'Analyst',
    email: 'analyst@eldercare.com',
    password: 'Analyst@123',
    description: 'Reports & insights',
    color: 'from-emerald-500 to-teal-600',
    lightColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 hover:border-emerald-400',
    activeBg: 'bg-emerald-500/25 border-emerald-400',
    dot: 'bg-emerald-400',
  },
  {
    role: 'FIELD_STAFF',
    label: 'Field Staff',
    email: 'staff@eldercare.com',
    password: 'Staff@123',
    description: 'Care tasks & shifts',
    color: 'from-orange-500 to-amber-600',
    lightColor: 'text-orange-400',
    bgColor: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/30 hover:border-orange-400',
    activeBg: 'bg-orange-500/25 border-orange-400',
    dot: 'bg-orange-400',
  },
];

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAutoFill = (cred: typeof DEMO_CREDENTIALS[0]) => {
    setSelectedRole(cred.role);
    setEmail(cred.email);
    setPassword(cred.password);
    toast.success(`Demo credentials loaded for ${cred.label}`, { icon: '⚡' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authApi.login({ email, password });
      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        toast.success(`Welcome back, ${res.user.fullName}!`);
        navigate('/dashboard');
      } else {
        toast.error(res.message || 'Login failed');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials or server error');
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
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative w-full max-w-md space-y-6">
        {/* Logo / Title Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 p-8 rounded-3xl shadow-2xl backdrop-blur-md space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-600/40">
              <HeartPulse className="w-9 h-9" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Elder Care Operations</h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Predictive Command Center — Sign In
            </p>
          </div>

          {/* Demo Role Quick-Fill Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Quick Demo Access — Select Role
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.role}
                  type="button"
                  id={`demo-role-${cred.role.toLowerCase()}`}
                  onClick={() => handleAutoFill(cred)}
                  className={`relative text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer
                    ${selectedRole === cred.role ? cred.activeBg : cred.bgColor}
                    hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${cred.dot} flex-shrink-0`} />
                    <span className={`text-xs font-bold ${cred.lightColor}`}>{cred.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight pl-3">{cred.description}</p>
                  {selectedRole === cred.role && (
                    <span className="absolute top-1.5 right-1.5 text-[9px] font-bold text-white/60 bg-white/10 px-1.5 py-0.5 rounded-full">
                      LOADED
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 mt-2 text-center">
              Click a role to auto-fill demo credentials
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-slate-800 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                or enter manually
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              placeholder="admin@eldercare.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
            />

            <Input
              id="login-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  id="toggle-password-visibility"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              required
              autoComplete="current-password"
            />

            {/* Selected role badge */}
            {selectedRole && (
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/40 rounded-lg border border-slate-600/40">
                <UserCircle2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-xs text-slate-400">
                  Signing in as{' '}
                  <span className="font-semibold text-white">
                    {DEMO_CREDENTIALS.find((c) => c.role === selectedRole)?.label}
                  </span>
                </span>
              </div>
            )}

            <Button
              type="submit"
              id="login-submit-btn"
              className="w-full py-3 mt-1"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Command Center
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-slate-400 pt-2 border-t border-slate-700/50">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Register Here
            </Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <p className="text-center text-[11px] text-slate-600">
          Elder Care Predictive Operations Command Center &copy; 2026
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
