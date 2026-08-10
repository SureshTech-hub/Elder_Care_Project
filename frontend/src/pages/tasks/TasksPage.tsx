import React, { useEffect, useState } from 'react';
import { tasksApi } from '../../api/tasks.api';
import { residentsApi } from '../../api/residents.api';
import { Task, Resident } from '../../types';
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
import { Plus, Edit2, Trash2, CheckSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tRes, rRes] = await Promise.all([tasksApi.getAll(), residentsApi.getAll()]);
      if (tRes.success && tRes.data) setTasks(tRes.data);
      if (rRes.success && rRes.data) setResidents(rRes.data);
    } catch (err) {
      toast.error('Failed to load operational tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingTask) {
      const resId = typeof editingTask.resident === 'object' ? editingTask.resident._id : editingTask.resident;
      reset({
        resident: resId,
        title: editingTask.title,
        description: editingTask.description || '',
        taskType: editingTask.taskType || 'OTHER',
        priority: editingTask.priority || 'MEDIUM',
        status: editingTask.status || 'PENDING',
        dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '',
      });
    } else {
      reset({
        resident: residents[0]?._id || '',
        title: '',
        description: '',
        taskType: 'CARE',
        priority: 'MEDIUM',
        status: 'PENDING',
        dueDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingTask, reset, residents]);

  const onFormSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      if (editingTask) {
        const res = await tasksApi.update(editingTask._id, formData);
        if (res.success) {
          toast.success('Task updated');
          fetchData();
          setIsModalOpen(false);
          setSearch('');
          setStatusFilter('ALL');
          setPriorityFilter('ALL');
        }
      } else {
        const res = await tasksApi.create(formData);
        if (res.success) {
          toast.success('Task created');
          fetchData();
          setIsModalOpen(false);
          setSearch('');
          setStatusFilter('ALL');
          setPriorityFilter('ALL');
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
      const res = await tasksApi.delete(deleteId);
      if (res.success) {
        toast.success('Task deleted');
        setTasks((prev) => prev.filter((t) => t._id !== deleteId));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const filtered = tasks.filter((t) => {
    const titleMatch = t.title.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter === 'ALL' || t.status === statusFilter;
    const priorityMatch = priorityFilter === 'ALL' || t.priority === priorityFilter;
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
        { label: 'Pending', value: 'PENDING' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Completed', value: 'COMPLETED' },
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
        { label: 'Urgent', value: 'URGENT' },
      ],
    },
  ];

  const columns: Column<Task>[] = [
    {
      header: 'Task Title',
      cell: (t) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{t.title}</p>
            <p className="text-xs text-slate-500">{t.taskType}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Resident',
      cell: (t) => {
        const name = typeof t.resident === 'object' ? `${t.resident.firstName} ${t.resident.lastName}` : 'Resident';
        return <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-xs">{name}</span>;
      },
    },
    {
      header: 'Due Date',
      cell: (t) => {
        const d = new Date(t.dueDate);
        return <span className="text-xs">{isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString()}</span>;
      },
    },
    {
      header: 'Priority',
      cell: (t) => <RiskBadge level={t.priority} size="sm" />,
    },
    {
      header: 'Status',
      cell: (t) => <StatusBadge status={t.status} size="sm" />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (t) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => { setEditingTask(t); setIsModalOpen(true); }} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteId(t._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task Management"
        description="Caregiver tasks, medication distribution duties, monitoring checklists, and hygiene routines."
        action={
          <Button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} icon={<Plus className="w-4 h-4" />}>
            Create Task
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." className="w-full sm:w-80" />
        <FilterBar filters={filterGroups} onReset={() => { setSearch(''); setStatusFilter('ALL'); setPriorityFilter('ALL'); }} />
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} emptyMessage="No operational tasks found." keyExtractor={(t) => t._id} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTask ? 'Edit Task' : 'Create Task'} maxWidth="md">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <Select label="Target Resident" options={residents.map((r) => ({ value: r._id, label: `${r.firstName} ${r.lastName} (${r.residentId})` }))} {...register('resident', { required: 'Required' })} error={errors.resident?.message as string} />
          <Input label="Task Title" {...register('title', { required: 'Required' })} error={errors.title?.message as string} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Task Type" options={[{ value: 'MEDICATION', label: 'Medication' }, { value: 'CARE', label: 'Care' }, { value: 'MEAL', label: 'Meal' }, { value: 'ACTIVITY', label: 'Activity' }, { value: 'HYGIENE', label: 'Hygiene' }, { value: 'MONITORING', label: 'Monitoring' }, { value: 'OTHER', label: 'Other' }]} {...register('taskType')} />
            <Select label="Priority" options={[{ value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'HIGH', label: 'High' }, { value: 'URGENT', label: 'Urgent' }]} {...register('priority')} />
            <Select label="Status" options={[{ value: 'PENDING', label: 'Pending' }, { value: 'IN_PROGRESS', label: 'In Progress' }, { value: 'COMPLETED', label: 'Completed' }, { value: 'CANCELLED', label: 'Cancelled' }]} {...register('status')} />
            <Input label="Due Date" type="date" {...register('dueDate', { required: 'Required' })} />
          </div>

          <Input label="Description / Instructions" {...register('description')} />

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>{editingTask ? 'Update Task' : 'Save Task'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Task" message="Are you sure you want to delete this task?" isLoading={isDeleting} />
    </div>
  );
};
