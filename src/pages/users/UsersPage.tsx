import React, { useEffect, useState } from 'react';
import { usersApi } from '../../api/users.api';
import { User } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { User as UserIcon, Mail, Phone, ShieldCheck, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export const UsersPage: React.FC = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await usersApi.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <LoadingSkeleton rows={4} columns={2} />;

  if (!profile) {
    return (
      <ErrorState
        title="Failed to load profile"
        message="Unable to fetch user credentials from backend."
        onRetry={fetchProfile}
      />
    );
  }

  const rolePermissions: Record<string, string[]> = {
    ADMIN: ['Full System Access', 'Resident CRUD', 'Staff Duty Roster', 'Audit Logs Access', 'AI Reviews'],
    MANAGER: ['Resident CRUD', 'Care Plan Management', 'Shift Allocation', 'Alert Override'],
    ANALYST: ['Predictive Risk Review', 'Reports Generation', 'Operational Analytics'],
    FIELD_STAFF: ['Daily Task Logging', 'Medication Administration', 'Incident Reporting'],
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User & Staff Profile"
        description="Authenticated staff user account details, role privileges, and system access configuration."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center text-center space-y-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 font-extrabold text-white text-2xl shadow-lg shadow-indigo-600/30">
            {profile.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{profile.fullName}</h3>
            <p className="text-xs text-slate-500">{profile.email}</p>
            <div className="mt-2 flex justify-center gap-2">
              <StatusBadge status={profile.status} size="sm" />
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {profile.role}
              </span>
            </div>
          </div>
        </div>

        {/* Details & Roles Card */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider text-indigo-600">
            Account Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Email</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{profile.email}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Phone</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{profile.phone || 'Not configured'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Role Tier</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{profile.role}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Key className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Account Created</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {new Date(profile.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Authorized System Capabilities</h4>
            <div className="flex flex-wrap gap-2">
              {(rolePermissions[profile.role] || ['Standard Staff Access']).map((perm, i) => (
                <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  &check; {perm}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
