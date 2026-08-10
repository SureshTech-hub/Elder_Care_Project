import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Pill,
  Activity as ActivityIcon,
  CheckSquare,
  AlertTriangle,
  Calendar,
  Bell,
  TrendingUp,
  Bot,
  FileText,
  ShieldCheck,
  UserCheck,
  HeartPulse,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Residents', path: '/residents', icon: <Users className="w-4 h-4" /> },
    { label: 'Care Plans', path: '/care-plans', icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'Medications', path: '/medications', icon: <Pill className="w-4 h-4" /> },
    { label: 'Activities', path: '/activities', icon: <ActivityIcon className="w-4 h-4" /> },
    { label: 'Tasks', path: '/tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'Incidents', path: '/incidents', icon: <AlertTriangle className="w-4 h-4" /> },
    { label: 'Shifts', path: '/shifts', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Alerts', path: '/alerts', icon: <Bell className="w-4 h-4" /> },
    { label: 'Notifications', path: '/notifications', icon: <Bell className="w-4 h-4" /> },
    { label: 'Predictive Risks', path: '/predictions', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'AI Review', path: '/ai', icon: <Bot className="w-4 h-4" />, badge: 'AI' },
    { label: 'Reports', path: '/reports', icon: <FileText className="w-4 h-4" /> },
    { label: 'Audit Logs', path: '/audits', icon: <ShieldCheck className="w-4 h-4" /> },
    { label: 'User Profile', path: '/users', icon: <UserCheck className="w-4 h-4" /> },
  ];

  const filteredItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container — light and dark aware */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 flex flex-col border-r transition-transform duration-300 ease-in-out lg:translate-x-0
          bg-white border-slate-200
          dark:bg-slate-900 dark:border-slate-800
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">ELDER CARE</h2>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
                Command Center
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {filteredItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded-md bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-[11px] text-slate-400 text-center">
          <p className="font-semibold text-slate-500 dark:text-slate-400">Elder Care Predictive OS</p>
          <p className="mt-0.5 text-slate-400 dark:text-slate-500">Operational Intelligence v1.0</p>
        </div>
      </aside>
    </>
  );
};
