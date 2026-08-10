import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, Lock, Mail, ArrowRight } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
      <div className="w-full max-w-md space-y-8 bg-slate-800/90 border border-slate-700/80 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <HeartPulse className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Elder Care Operations</h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Predictive Command Center
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@eldercare.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            className="w-full py-3"
            isLoading={isLoading}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Command Center
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-700/50">
          Elder Care Predictive Operations Command Center &copy; 2026
        </div>
      </div>
    </div>
  );
};
