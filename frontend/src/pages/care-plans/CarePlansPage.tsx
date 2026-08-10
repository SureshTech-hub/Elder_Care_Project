import React, { useEffect, useState } from 'react';
import { carePlansApi } from '../../api/carePlans.api';
import { residentsApi } from '../../api/residents.api';
import { CarePlan, Resident } from '../../types';
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
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const CarePlansPage: React.FC = () => {
  const [carePlans, setCarePlans] = useState<CarePlan[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CarePlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cpRes, resRes] = await Promise.all([
        carePlansApi.getAll(),
        residentsApi.getAll(),
      ]);

      if (cpRes.success && cpRes.data) setCarePlans(cpRes.data);
      if (resRes.success && resRes.data) setResidents(resRes.data);
    } catch (err) {
      toast.error('Failed to load care plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingPlan) {
      const residentId = typeof editingPlan.resident === 'object' ? editingPlan.resident._id : editingPlan.resident;
      reset({
        resident: residentId,
        title: editingPlan.title,
        description: editingPlan.description,
        status: editingPlan.status,
        priority: editingPlan.priority,
        startDate: editingPlan.startDate ? editingPlan.startDate.split('T')[0] : '',
        endDate: editingPlan.endDate ? editingPlan.endDate.split('T')[0] : '',
        goals: editingPlan.goals ? editingPlan.goals.join(', ') : '',
        interventions: editingPlan.interventions ? editingPlan.interventions.join(', ') : '',
      });
    } else {
      reset({
        resident: residents[0]?._id || '',
        title: '',
        description: '',
        status: 'ACTIVE',
        priority: 'MEDIUM',
        startDate: new Date().toISOString().split('T')[0],
        goals: '',
        interventions: '',
      });
    }
  }, [editingPlan, reset, residents]);

  const onFormSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        goals: formData.goals ? formData.goals.split(',').map((s: string) => s.trim()) : [],
        interventions: formData.interventions ? formData.interventions.split(',').map((s: string) => s.trim()) : [],
      };

      if (editingPlan) {
        const res = await carePlansApi.update(editingPlan._id, payload);
        if (res.success) {
          toast.success('Care plan updated');
          fetchData();
          setIsModalOpen(false);
        }
      } else {
        const res = await carePlansApi.create(payload);
        if (res.success) {
          toast.success('Care plan created');
          fetchData();
          setIsModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const res = await carePlansApi.delete(deleteId);
      if (res.success) {
        toast.success('Care plan deleted');
        setCarePlans((prev) => prev.filter((cp) => cp._id !== deleteId));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const filtered = carePlans.filter((cp) => {
    const titleMatch = cp.title.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter === 'ALL' || cp.status === statusFilter;
    const priorityMatch = priorityFilter === 'ALL' || cp.priority === priorityFilter;
    return titleMatch && statusMatch && priorityMatch;
  });

  const filterGroups: FilterGroup[] = [
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: 'All Statuses', value: 'ALL' },
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'On Hold', value: 'ON_HOLD' },
        { label: 'Cancelled', value: 'CANCELLED' },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      value: priorityFilter,
      onChange: setPriorityFilter,
      options: [
        { label: 'All Priorities', value: 'ALL' },
        { label: 'Low', value: 'LOW' },
        { label: 'Medium', value: 'MEDIUM' },
        { label: 'High', value: 'HIGH' },
        { label: 'Critical', value: 'CRITICAL' },
      ],
    },
  ];

  const columns: Column<CarePlan>[] = [
    {
      header: 'Title & Resident',
      cell: (cp) => {
        const resName = typeof cp.resident === 'object' ? `${cp.resident.firstName} ${cp.resident.lastName}` : 'Resident';
        return (
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{cp.title}</p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{resName}</p>
          </div>
        );
      },
    },
    {
      header: 'Start Date',
      cell: (cp) => <span className="text-xs">{new Date(cp.startDate).toLocaleDateString()}</span>,
    },
    {
      header: 'Priority',
      cell: (cp) => <RiskBadge level={cp.priority} size="sm" />,
    },
    {
      header: 'Status',
      cell: (cp) => <StatusBadge status={cp.status} size="sm" />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (cp) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => {
              setEditingPlan(cp);
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteId(cp._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Care Plan Management"
        description="Develop, track, and execute tailored healthcare plans for facility residents."
        action={
          <Button
            onClick={() => {
              setEditingPlan(null);
              setIsModalOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            New Care Plan
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <SearchBar value={search} onChange={setSearch} placeholder="Search care plans..." className="w-full sm:w-80" />
        <FilterBar filters={filterGroups} onReset={() => { setSearch(''); setStatusFilter('ALL'); setPriorityFilter('ALL'); }} />
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} emptyMessage="No care plans found." keyExtractor={(cp) => cp._id} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPlan ? 'Edit Care Plan' : 'Create Care Plan'} maxWidth="lg">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <Select
            label="Target Resident"
            options={residents.map((r) => ({ value: r._id, label: `${r.firstName} ${r.lastName} (${r.residentId})` }))}
            {...register('resident', { required: 'Resident selection required' })}
            error={errors.resident?.message as string}
          />
          <Input label="Care Plan Title" {...register('title', { required: 'Title is required' })} error={errors.title?.message as string} />
          <Input label="Description" {...register('description', { required: 'Description is required' })} error={errors.description?.message as string} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Priority" options={[{ value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'HIGH', label: 'High' }, { value: 'CRITICAL', label: 'Critical' }]} {...register('priority')} />
            <Select label="Status" options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'COMPLETED', label: 'Completed' }, { value: 'ON_HOLD', label: 'On Hold' }, { value: 'CANCELLED', label: 'Cancelled' }]} {...register('status')} />
            <Input label="Start Date" type="date" {...register('startDate', { required: 'Start date required' })} />
            <Input label="End Date (Optional)" type="date" {...register('endDate')} />
          </div>

          <Input label="Goals (comma separated)" placeholder="Improve mobility, stabilize BP" {...register('goals')} />
          <Input label="Interventions (comma separated)" placeholder="Physical therapy twice weekly, daily vitals" {...register('interventions')} />

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>{editingPlan ? 'Update Plan' : 'Save Plan'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Care Plan" message="Are you sure you want to delete this care plan?" isLoading={isDeleting} />
    </div>
  );
};
