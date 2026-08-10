import React, { useEffect, useState } from 'react';
import { activitiesApi } from '../../api/activities.api';
import { residentsApi } from '../../api/residents.api';
import { Activity, Resident } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { DataTable, Column } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';
import { FilterBar, FilterGroup } from '../../components/ui/FilterBar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Plus, Edit2, Trash2, Activity as ActivityIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAct, setEditingAct] = useState<Activity | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aRes, rRes] = await Promise.all([activitiesApi.getAll(), residentsApi.getAll()]);
      if (aRes.success && aRes.data) setActivities(aRes.data);
      if (rRes.success && rRes.data) setResidents(rRes.data);
    } catch (err) {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingAct) {
      const resId = typeof editingAct.resident === 'object' ? editingAct.resident._id : editingAct.resident;
      reset({
        resident: resId,
        activityName: editingAct.activityName,
        description: editingAct.description || '',
        activityType: editingAct.activityType || 'OTHER',
        duration: editingAct.duration || 30,
        status: editingAct.status || 'SCHEDULED',
        scheduledDate: editingAct.scheduledDate ? editingAct.scheduledDate.split('T')[0] : '',
      });
    } else {
      reset({
        resident: residents[0]?._id || '',
        activityName: '',
        description: '',
        activityType: 'RECREATIONAL',
        duration: 45,
        status: 'SCHEDULED',
        scheduledDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingAct, reset, residents]);

  const onFormSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      const payload = { ...formData, duration: Number(formData.duration) };
      if (editingAct) {
        const res = await activitiesApi.update(editingAct._id, payload);
        if (res.success) {
          toast.success('Activity updated');
          fetchData();
          setIsModalOpen(false);
        }
      } else {
        const res = await activitiesApi.create(payload);
        if (res.success) {
          toast.success('Activity scheduled');
          fetchData();
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const res = await activitiesApi.delete(deleteId);
      if (res.success) {
        toast.success('Activity deleted');
        setActivities((prev) => prev.filter((a) => a._id !== deleteId));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const filtered = activities.filter((a) => {
    const nameMatch = a.activityName.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter === 'ALL' || a.status === statusFilter;
    const typeMatch = typeFilter === 'ALL' || a.activityType === typeFilter;
    return nameMatch && statusMatch && typeMatch;
  });

  const filterGroups: FilterGroup[] = [
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: 'All Statuses', value: 'ALL' },
        { label: 'Scheduled', value: 'SCHEDULED' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Cancelled', value: 'CANCELLED' },
      ],
    },
    {
      key: 'type',
      label: 'Type',
      value: typeFilter,
      onChange: setTypeFilter,
      options: [
        { label: 'All Types', value: 'ALL' },
        { label: 'Exercise', value: 'EXERCISE' },
        { label: 'Social', value: 'SOCIAL' },
        { label: 'Recreational', value: 'RECREATIONAL' },
        { label: 'Therapy', value: 'THERAPY' },
        { label: 'Meal', value: 'MEAL' },
        { label: 'Medical', value: 'MEDICAL' },
        { label: 'Personal Care', value: 'PERSONAL_CARE' },
        { label: 'Other', value: 'OTHER' },
      ],
    },
  ];

  const columns: Column<Activity>[] = [
    {
      header: 'Activity Name',
      cell: (a) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <ActivityIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{a.activityName}</p>
            <p className="text-xs text-slate-500">{a.activityType} • {a.duration} mins</p>
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
      header: 'Scheduled Date',
      cell: (a) => <span className="text-xs">{new Date(a.scheduledDate).toLocaleDateString()}</span>,
    },
    {
      header: 'Status',
      cell: (a) => <StatusBadge status={a.status} size="sm" />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (a) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => { setEditingAct(a); setIsModalOpen(true); }} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteId(a._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resident Activities"
        description="Schedule and monitor recreational, therapy, exercise, and social activities for residents."
        action={
          <Button onClick={() => { setEditingAct(null); setIsModalOpen(true); }} icon={<Plus className="w-4 h-4" />}>
            Schedule Activity
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <SearchBar value={search} onChange={setSearch} placeholder="Search activity..." className="w-full sm:w-80" />
        <FilterBar filters={filterGroups} onReset={() => { setSearch(''); setStatusFilter('ALL'); setTypeFilter('ALL'); }} />
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} emptyMessage="No activities scheduled." keyExtractor={(a) => a._id} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAct ? 'Edit Activity' : 'Schedule Activity'} maxWidth="md">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <Select label="Resident" options={residents.map((r) => ({ value: r._id, label: `${r.firstName} ${r.lastName} (${r.residentId})` }))} {...register('resident', { required: 'Required' })} error={errors.resident?.message as string} />
          <Input label="Activity Name" {...register('activityName', { required: 'Required' })} error={errors.activityName?.message as string} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Activity Type" options={[{ value: 'EXERCISE', label: 'Exercise' }, { value: 'SOCIAL', label: 'Social' }, { value: 'RECREATIONAL', label: 'Recreational' }, { value: 'THERAPY', label: 'Therapy' }, { value: 'MEAL', label: 'Meal' }, { value: 'MEDICAL', label: 'Medical' }, { value: 'PERSONAL_CARE', label: 'Personal Care' }, { value: 'OTHER', label: 'Other' }]} {...register('activityType')} />
            <Input label="Duration (minutes)" type="number" {...register('duration')} />
            <Input label="Scheduled Date" type="date" {...register('scheduledDate', { required: 'Required' })} />
            <Select label="Status" options={[{ value: 'SCHEDULED', label: 'Scheduled' }, { value: 'IN_PROGRESS', label: 'In Progress' }, { value: 'COMPLETED', label: 'Completed' }, { value: 'CANCELLED', label: 'Cancelled' }]} {...register('status')} />
          </div>

          <Input label="Notes / Description" {...register('description')} />

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>{editingAct ? 'Update Activity' : 'Save Activity'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Activity" message="Are you sure you want to delete this scheduled activity?" isLoading={isDeleting} />
    </div>
  );
};
