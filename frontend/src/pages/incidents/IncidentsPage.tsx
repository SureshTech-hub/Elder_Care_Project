import React, { useEffect, useState } from 'react';
import { incidentsApi } from '../../api/incidents.api';
import { residentsApi } from '../../api/residents.api';
import { Incident, Resident } from '../../types';
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
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInc, setEditingInc] = useState<Incident | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [iRes, rRes] = await Promise.all([incidentsApi.getAll(), residentsApi.getAll()]);
      if (iRes.success && iRes.data) setIncidents(iRes.data);
      if (rRes.success && rRes.data) setResidents(rRes.data);
    } catch (err) {
      toast.error('Failed to load incident records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingInc) {
      const resId = typeof editingInc.resident === 'object' ? editingInc.resident._id : editingInc.resident;
      reset({
        resident: resId,
        incidentType: editingInc.incidentType,
        title: editingInc.title,
        description: editingInc.description,
        severity: editingInc.severity || 'MEDIUM',
        status: editingInc.status || 'OPEN',
        location: editingInc.location || '',
        actionTaken: editingInc.actionTaken || '',
        incidentDate: editingInc.incidentDate ? editingInc.incidentDate.split('T')[0] : '',
      });
    } else {
      reset({
        resident: residents[0]?._id || '',
        incidentType: 'FALL',
        title: '',
        description: '',
        severity: 'HIGH',
        status: 'OPEN',
        location: '',
        actionTaken: '',
        incidentDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingInc, reset, residents]);

  const onFormSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      if (editingInc) {
        const res = await incidentsApi.update(editingInc._id, formData);
        if (res.success) {
          toast.success('Incident updated');
          fetchData();
          setIsModalOpen(false);
        }
      } else {
        const res = await incidentsApi.create(formData);
        if (res.success) {
          toast.success('Incident logged');
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
      const res = await incidentsApi.delete(deleteId);
      if (res.success) {
        toast.success('Incident record removed');
        setIncidents((prev) => prev.filter((i) => i._id !== deleteId));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const filtered = incidents.filter((i) => {
    const titleMatch = i.title.toLowerCase().includes(search.toLowerCase());
    const severityMatch = severityFilter === 'ALL' || i.severity === severityFilter;
    const statusMatch = statusFilter === 'ALL' || i.status === statusFilter;
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
        { label: 'Low', value: 'LOW' },
        { label: 'Medium', value: 'MEDIUM' },
        { label: 'High', value: 'HIGH' },
        { label: 'Critical', value: 'CRITICAL' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: 'All Statuses', value: 'ALL' },
        { label: 'Open', value: 'OPEN' },
        { label: 'Investigating', value: 'INVESTIGATING' },
        { label: 'Resolved', value: 'RESOLVED' },
        { label: 'Closed', value: 'CLOSED' },
      ],
    },
  ];

  const columns: Column<Incident>[] = [
    {
      header: 'Incident',
      cell: (i) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{i.title}</p>
            <p className="text-xs text-slate-500">{i.incidentType.replace(/_/g, ' ')}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Resident',
      cell: (i) => {
        const name = typeof i.resident === 'object' ? `${i.resident.firstName} ${i.resident.lastName}` : 'Resident';
        return <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-xs">{name}</span>;
      },
    },
    {
      header: 'Incident Date',
      cell: (i) => {
        const d = new Date(i.incidentDate);
        return <span className="text-xs">{isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString()}</span>;
      },
    },
    {
      header: 'Severity',
      cell: (i) => <RiskBadge level={i.severity} size="sm" />,
    },
    {
      header: 'Status',
      cell: (i) => <StatusBadge status={i.status} size="sm" />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (i) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => { setEditingInc(i); setIsModalOpen(true); }} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => setDeleteId(i._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incident Management"
        description="Comprehensive tracking of falls, medical events, medication errors, and safety investigations."
        action={
          <Button onClick={() => { setEditingInc(null); setIsModalOpen(true); }} icon={<Plus className="w-4 h-4" />}>
            Report Incident
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <SearchBar value={search} onChange={setSearch} placeholder="Search incident title..." className="w-full sm:w-80" />
        <FilterBar filters={filterGroups} onReset={() => { setSearch(''); setSeverityFilter('ALL'); setStatusFilter('ALL'); }} />
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} emptyMessage="No incident records found." keyExtractor={(i) => i._id} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingInc ? 'Update Incident Report' : 'Report New Incident'} maxWidth="lg">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <Select label="Resident" options={residents.map((r) => ({ value: r._id, label: `${r.firstName} ${r.lastName} (${r.residentId})` }))} {...register('resident', { required: 'Required' })} error={errors.resident?.message as string} />
          <Input label="Incident Title" {...register('title', { required: 'Required' })} error={errors.title?.message as string} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Type" options={[{ value: 'FALL', label: 'Fall' }, { value: 'MEDICATION_ERROR', label: 'Medication Error' }, { value: 'INJURY', label: 'Injury' }, { value: 'BEHAVIORAL', label: 'Behavioral' }, { value: 'MEDICAL', label: 'Medical' }, { value: 'MISSING_PERSON', label: 'Missing Person' }, { value: 'OTHER', label: 'Other' }]} {...register('incidentType')} />
            <Select label="Severity" options={[{ value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'HIGH', label: 'High' }, { value: 'CRITICAL', label: 'Critical' }]} {...register('severity')} />
            <Select label="Status" options={[{ value: 'OPEN', label: 'Open' }, { value: 'INVESTIGATING', label: 'Investigating' }, { value: 'RESOLVED', label: 'Resolved' }, { value: 'CLOSED', label: 'Closed' }]} {...register('status')} />
            <Input label="Date of Incident" type="date" {...register('incidentDate', { required: 'Required' })} />
          </div>

          <Input label="Location" placeholder="e.g. Dining Hall, Room 102" {...register('location')} />
          <Input label="Incident Description" {...register('description', { required: 'Required' })} error={errors.description?.message as string} />
          <Input label="Immediate Action Taken" {...register('actionTaken')} />

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>{editingInc ? 'Update Report' : 'Submit Incident Report'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Incident Record" message="Are you sure you want to delete this incident record?" isLoading={isDeleting} />
    </div>
  );
};
