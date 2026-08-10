import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Shield } from 'lucide-react';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors cursor-pointer"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-bold text-white text-xs shadow-xs">
          {initials}
        </div>
        <div className="hidden md:block text-left pr-1">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
            {user.fullName}
          </p>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
            {user.role}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-xl z-50 overflow-hidden py-1">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/60">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.fullName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              {user.role}
            </span>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/users');
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
            >
              <User className="w-4 h-4 text-slate-400" /> My Profile
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/audits');
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-slate-400" /> Audit Logs
            </button>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700/60 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
