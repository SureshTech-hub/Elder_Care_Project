import React, { useEffect, useState } from 'react';
import { alertsApi } from '../../api/alerts.api';
import { residentsApi } from '../../api/residents.api';
import { Alert, Resident } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { DataTable, Column } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';
import { FilterBar, FilterGroup } from '../../components/ui/FilterBar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Plus, Bell, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aRes, rRes] = await Promise.all([alertsApi.getAll(), residentsApi.getAll()]);
      if (aRes.success && aRes.data) setAlerts(aRes.data);
      if (rRes.success && rRes.data) setResidents(rRes.data);
    } catch (err) {
      toast.error('Failed to load operations alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (alertId: string, newStatus: string) => {
    try {
      const res = await alertsApi.update(alertId, { status: newStatus as any });
      if (res.success) {
        toast.success(`Alert marked as ${newStatus}`);
        setAlerts((prev) => prev.map((a) => (a._id === alertId ? { ...a, status: newStatus as any } : a)));
      }
    } catch (err) {
      toast.error('Failed to update alert status');
    }
  };

  const onFormSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      const res = await alertsApi.create(formData);
      if (res.success) {
        toast.success('New alert generated');
        fetchData();
        setIsModalOpen(false);
        reset();
        setSearch('');
        setStatusFilter('ALL');
        setSeverityFilter('ALL');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = alerts.filter((a) => {
    const titleMatch = a.title.toLowerCase().includes(search.toLowerCase()) || a.message.toLowerCase().includes(search.toLowerCase());
    const severityMatch = severityFilter === 'ALL' || a.severity === severityFilter;
    const statusMatch = statusFilter === 'ALL' || a.status === statusFilter;
    return titleMatch && severityMatch && statusMatch;
  });

  const filterGroups: FilterGroup[] = [
    {
      key: 'severity',
      label: 'Severity',
      value: severityFilter,
      onChange: setSeverityFilter,
      options: [
        { label: 'All Severities', value: 'ALL' },
        { label: 'Critical', value: 'CRITICAL' },
        { label: 'High', value: 'HIGH' },
        { label: 'Medium', value: 'MEDIUM' },
        { label: 'Low', value: 'LOW' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: 'All Statuses', value: 'ALL' },
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Acknowledged', value: 'ACKNOWLEDGED' },
        { label: 'Resolved', value: 'RESOLVED' },
        { label: 'Dismissed', value: 'DISMISSED' },
      ],
    },
  ];

  const columns: Column<Alert>[] = [
    {
      header: 'Alert Title & Message',
      cell: (a) => (
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mt-0.5">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{a.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{a.message}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Resident',
      cell: (a) => {
        const name = typeof a.resident === 'object' ? `${a.resident.firstName} ${a.resident.lastName}` : 'Resident';
        return <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-xs">{name}</span>;
      },
    },
    {
      header: 'Severity',
      cell: (a) => <RiskBadge level={a.severity} size="sm" />,
    },
    {
      header: 'Status',
      cell: (a) => <StatusBadge status={a.status} size="sm" />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (a) => (
        <div className="flex items-center justify-end gap-2">
          {a.status === 'ACTIVE' && (
            <Button size="sm" variant="outline" onClick={() => handleStatusChange(a._id, 'ACKNOWLEDGED')}>
              Acknowledge
            </Button>
          )}
          {a.status !== 'RESOLVED' && (
            <Button size="sm" variant="secondary" onClick={() => handleStatusChange(a._id, 'RESOLVED')}>
              Resolve
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations Alert Center"
        description="Real-time emergency signals, fall risk triggers, missed medication notifications, and health alerts."
        action={
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Create Operational Alert
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <SearchBar value={search} onChange={setSearch} placeholder="Search alerts..." className="w-full sm:w-80" />
        <FilterBar filters={filterGroups} onReset={() => { setSearch(''); setSeverityFilter('ALL'); setStatusFilter('ALL'); }} />
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} emptyMessage="No system alerts found." keyExtractor={(a) => a._id} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Operational Alert" maxWidth="md">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <Select label="Resident" options={residents.map((r) => ({ value: r._id, label: `${r.firstName} ${r.lastName} (${r.residentId})` }))} {...register('resident', { required: 'Required' })} error={errors.resident?.message as string} />
          <Input label="Alert Title" placeholder="e.g. High Fall Risk Warning" {...register('title', { required: 'Required' })} error={errors.title?.message as string} />
          <Input label="Alert Message" placeholder="Resident attempted to get up unassisted." {...register('message', { required: 'Required' })} error={errors.message?.message as string} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Alert Type" options={[{ value: 'FALL_RISK', label: 'Fall Risk' }, { value: 'MEDICATION', label: 'Medication' }, { value: 'HEALTH', label: 'Health' }, { value: 'MISSED_TASK', label: 'Missed Task' }, { value: 'INCIDENT', label: 'Incident' }, { value: 'EMERGENCY', label: 'Emergency' }, { value: 'OTHER', label: 'Other' }]} {...register('alertType')} />
            <Select label="Severity" options={[{ value: 'CRITICAL', label: 'Critical' }, { value: 'HIGH', label: 'High' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'LOW', label: 'Low' }]} {...register('severity')} />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Broadcast Alert</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
