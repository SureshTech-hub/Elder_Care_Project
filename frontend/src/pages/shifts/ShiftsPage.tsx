import React, { useEffect, useState } from 'react';
import { shiftsApi } from '../../api/shifts.api';
import { Shift } from '../../types';
import { useAuth } from '../../context/AuthContext';
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
import { Plus, Edit2, Trash2, Calendar, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const ShiftsPage: React.FC = () => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [shiftTypeFilter, setShiftTypeFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const res = await shiftsApi.getAll();
      if (res.success && res.data) setShifts(res.data);
    } catch (err) {
      toast.error('Failed to load caregiver shifts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  useEffect(() => {
    if (editingShift) {
      reset({
        shiftType: editingShift.shiftType,
        shiftDate: editingShift.shiftDate ? editingShift.shiftDate.split('T')[0] : '',
        startTime: editingShift.startTime,
        endTime: editingShift.endTime,
        status: editingShift.status || 'SCHEDULED',
        notes: editingShift.notes || '',
      });
    } else {
      reset({
        shiftType: 'MORNING',
        shiftDate: new Date().toISOString().split('T')[0],
        startTime: '07:00',
        endTime: '15:00',
        status: 'SCHEDULED',
        notes: '',
      });
    }
  }, [editingShift, reset]);

  const onFormSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        caregiver: user?._id, // Assign to current authenticated staff
      };

      if (editingShift) {
        const res = await shiftsApi.update(editingShift._id, payload);
        if (res.success) {
          toast.success('Shift updated');
          fetchShifts();
          setIsModalOpen(false);
        }
      } else {
        const res = await shiftsApi.create(payload);
        if (res.success) {
          toast.success('Shift scheduled');
          fetchShifts();
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
      const res = await shiftsApi.delete(deleteId);
      if (res.success) {
        toast.success('Shift deleted');
        setShifts((prev) => prev.filter((s) => s._id !== deleteId));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const filtered = shifts.filter((s) => {
    const typeMatch = s.shiftType.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter === 'ALL' || s.status === statusFilter;
    const shiftTypeMatch = shiftTypeFilter === 'ALL' || s.shiftType === shiftTypeFilter;
    return typeMatch && statusMatch && shiftTypeMatch;
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
      key: 'shiftType',
      label: 'Shift Type',
      value: shiftTypeFilter,
      onChange: setShiftTypeFilter,
      options: [
        { label: 'All Types', value: 'ALL' },
        { label: 'Morning', value: 'MORNING' },
        { label: 'Afternoon', value: 'AFTERNOON' },
        { label: 'Night', value: 'NIGHT' },
        { label: 'Custom', value: 'CUSTOM' },
      ],
    },
  ];

  const columns: Column<Shift>[] = [
    {
      header: 'Shift & Caregiver',
      cell: (s) => {
        const staffName = typeof s.caregiver === 'object' ? `${s.caregiver.fullName}` : 'Caregiver';
        return (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">{staffName}</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{s.shiftType} SHIFT</p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Shift Date',
      cell: (s) => <span className="text-xs">{new Date(s.shiftDate).toLocaleDateString()}</span>,
    },
    {
      header: 'Hours',
      cell: (s) => (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" /> {s.startTime} - {s.endTime}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (s) => <StatusBadge status={s.status} size="sm" />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (s) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => { setEditingShift(s); setIsModalOpen(true); }} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteId(s._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shift & Duty Roster"
        description="Caregiver shift assignments, morning/afternoon/night coverage schedules, and operational attendance."
        action={
          <Button onClick={() => { setEditingShift(null); setIsModalOpen(true); }} icon={<Plus className="w-4 h-4" />}>
            Schedule Shift
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <SearchBar value={search} onChange={setSearch} placeholder="Search shift..." className="w-full sm:w-80" />
        <FilterBar filters={filterGroups} onReset={() => { setSearch(''); setStatusFilter('ALL'); setShiftTypeFilter('ALL'); }} />
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} emptyMessage="No shifts scheduled." keyExtractor={(s) => s._id} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingShift ? 'Edit Shift Schedule' : 'Schedule New Shift'} maxWidth="md">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Shift Type" options={[{ value: 'MORNING', label: 'Morning (07:00 - 15:00)' }, { value: 'AFTERNOON', label: 'Afternoon (15:00 - 23:00)' }, { value: 'NIGHT', label: 'Night (23:00 - 07:00)' }, { value: 'CUSTOM', label: 'Custom' }]} {...register('shiftType')} />
            <Select label="Status" options={[{ value: 'SCHEDULED', label: 'Scheduled' }, { value: 'IN_PROGRESS', label: 'In Progress' }, { value: 'COMPLETED', label: 'Completed' }, { value: 'CANCELLED', label: 'Cancelled' }]} {...register('status')} />
            <Input label="Shift Date" type="date" {...register('shiftDate', { required: 'Required' })} />
            <Input label="Start Time" type="time" {...register('startTime', { required: 'Required' })} />
            <Input label="End Time" type="time" {...register('endTime', { required: 'Required' })} />
          </div>

          <Input label="Notes" placeholder="Covering East Wing" {...register('notes')} />

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>{editingShift ? 'Update Shift' : 'Save Shift'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Shift Schedule" message="Are you sure you want to delete this shift assignment?" isLoading={isDeleting} />
    </div>
  );
};
