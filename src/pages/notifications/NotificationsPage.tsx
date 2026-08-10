import React, { useEffect, useState } from 'react';
import { notificationsApi } from '../../api/notifications.api';
import { NotificationItem } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { DataTable, Column } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';
import { FilterBar, FilterGroup } from '../../components/ui/FilterBar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Bell, CheckCircle2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [readFilter, setReadFilter] = useState('ALL');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationsApi.getMyNotifications();
      if (res.success && res.data) setNotifications(res.data);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await notificationsApi.markAsRead(id);
      if (res.success) {
        toast.success('Marked as read');
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      }
    } catch (err) {
      toast.error('Failed to mark read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await notificationsApi.markAllAsRead();
      if (res.success) {
        toast.success('All marked as read');
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await notificationsApi.delete(id);
      if (res.success) {
        toast.success('Notification removed');
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  const filtered = notifications.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase());
    const matchRead = readFilter === 'ALL' || (readFilter === 'UNREAD' ? !n.isRead : n.isRead);
    return matchSearch && matchRead;
  });

  const filterGroups: FilterGroup[] = [
    {
      key: 'read',
      label: 'Read Status',
      value: readFilter,
      onChange: setReadFilter,
      options: [
        { label: 'All Notifications', value: 'ALL' },
        { label: 'Unread Only', value: 'UNREAD' },
        { label: 'Read Only', value: 'READ' },
      ],
    },
  ];

  const columns: Column<NotificationItem>[] = [
    {
      header: 'Notification Details',
      cell: (n) => (
        <div className="flex items-start gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full ${n.isRead ? 'bg-slate-100 text-slate-400' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'}`}>
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <p className={`font-bold text-sm ${n.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
              {n.title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{n.message}</p>
            <span className="text-[10px] text-slate-400 block mt-1">
              {new Date(n.createdAt || Date.now()).toLocaleString()}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      cell: (n) => <span className="font-semibold text-xs text-indigo-600 dark:text-indigo-400">{n.type}</span>,
    },
    {
      header: 'Priority',
      cell: (n) => <StatusBadge status={n.priority} size="sm" />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (n) => (
        <div className="flex items-center justify-end gap-2">
          {!n.isRead && (
            <Button size="sm" variant="outline" icon={<CheckCircle2 className="w-3.5 h-3.5" />} onClick={() => handleMarkAsRead(n._id)}>
              Mark Read
            </Button>
          )}
          <button onClick={() => handleDelete(n._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Center"
        description="System activity notifications, task assignments, alert updates, and shift reminders."
        action={
          <Button variant="outline" icon={<CheckCircle2 className="w-4 h-4" />} onClick={handleMarkAllRead}>
            Mark All as Read
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <SearchBar value={search} onChange={setSearch} placeholder="Search notifications..." className="w-full sm:w-80" />
        <FilterBar filters={filterGroups} onReset={() => { setSearch(''); setReadFilter('ALL'); }} />
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} emptyMessage="No notifications found." keyExtractor={(n) => n._id} />
    </div>
  );
};
