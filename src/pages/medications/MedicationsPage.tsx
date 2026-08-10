import React, { useEffect, useState } from 'react';
import { medicationsApi } from '../../api/medications.api';
import { residentsApi } from '../../api/residents.api';
import { Medication, Resident } from '../../types';
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
import { Plus, Edit2, Trash2, Pill } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const MedicationsPage: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mRes, rRes] = await Promise.all([medicationsApi.getAll(), residentsApi.getAll()]);
      if (mRes.success && mRes.data) setMedications(mRes.data);
      if (rRes.success && rRes.data) setResidents(rRes.data);
    } catch (err) {
      toast.error('Failed to load medications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingMed) {
      const resId = typeof editingMed.resident === 'object' ? editingMed.resident._id : editingMed.resident;
      reset({
        resident: resId,
        medicationName: editingMed.medicationName,
        dosage: editingMed.dosage,
        frequency: editingMed.frequency,
        route: editingMed.route || 'ORAL',
        status: editingMed.status || 'ACTIVE',
        instructions: editingMed.instructions || '',
        startDate: editingMed.startDate ? editingMed.startDate.split('T')[0] : '',
      });
    } else {
      reset({
        resident: residents[0]?._id || '',
        medicationName: '',
        dosage: '10mg',
        frequency: 'Once daily',
        route: 'ORAL',
        status: 'ACTIVE',
        startDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingMed, reset, residents]);

  const onFormSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      if (editingMed) {
        const res = await medicationsApi.update(editingMed._id, formData);
        if (res.success) {
          toast.success('Medication updated');
          fetchData();
          setIsModalOpen(false);
        }
      } else {
        const res = await medicationsApi.create(formData);
        if (res.success) {
          toast.success('Medication prescribed');
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
      const res = await medicationsApi.delete(deleteId);
      if (res.success) {
        toast.success('Medication record removed');
        setMedications((prev) => prev.filter((m) => m._id !== deleteId));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const filtered = medications.filter((m) => {
    const nameMatch = m.medicationName.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter === 'ALL' || m.status === statusFilter;
    return nameMatch && statusMatch;
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
        { label: 'Discontinued', value: 'DISCONTINUED' },
        { label: 'On Hold', value: 'ON_HOLD' },
      ],
    },
  ];

  const columns: Column<Medication>[] = [
    {
      header: 'Medication',
      cell: (m) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <Pill className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{m.medicationName}</p>
            <p className="text-xs text-slate-500">{m.dosage} • {m.route}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Resident',
      cell: (m) => {
        const name = typeof m.resident === 'object' ? `${m.resident.firstName} ${m.resident.lastName}` : 'Resident';
        return <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-xs">{name}</span>;
      },
    },
    {
      header: 'Frequency',
      accessor: 'frequency',
    },
    {
      header: 'Start Date',
      cell: (m) => <span className="text-xs">{new Date(m.startDate).toLocaleDateString()}</span>,
    },
    {
      header: 'Status',
      cell: (m) => <StatusBadge status={m.status} size="sm" />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (m) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => {
              setEditingMed(m);
              setIsModalOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteId(m._id)}
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
        title="Medication Administration"
        description="Prescription schedules, dosages, route details, and active medication administration tracking."
        action={
          <Button onClick={() => { setEditingMed(null); setIsModalOpen(true); }} icon={<Plus className="w-4 h-4" />}>
            Prescribe Medication
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <SearchBar value={search} onChange={setSearch} placeholder="Search medication..." className="w-full sm:w-80" />
        <FilterBar filters={filterGroups} onReset={() => { setSearch(''); setStatusFilter('ALL'); }} />
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} emptyMessage="No medications recorded." keyExtractor={(m) => m._id} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMed ? 'Edit Medication' : 'Prescribe Medication'} maxWidth="md">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <Select
            label="Resident"
            options={residents.map((r) => ({ value: r._id, label: `${r.firstName} ${r.lastName} (${r.residentId})` }))}
            {...register('resident', { required: 'Resident is required' })}
            error={errors.resident?.message as string}
          />
          <Input label="Medication Name" {...register('medicationName', { required: 'Medication name required' })} error={errors.medicationName?.message as string} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Dosage" placeholder="e.g. 500mg" {...register('dosage', { required: 'Dosage required' })} error={errors.dosage?.message as string} />
            <Input label="Frequency" placeholder="e.g. Twice daily" {...register('frequency', { required: 'Frequency required' })} error={errors.frequency?.message as string} />
            <Select label="Route" options={[{ value: 'ORAL', label: 'Oral' }, { value: 'TOPICAL', label: 'Topical' }, { value: 'INJECTION', label: 'Injection' }, { value: 'INHALATION', label: 'Inhalation' }, { value: 'OPHTHALMIC', label: 'Ophthalmic' }, { value: 'OTIC', label: 'Otic' }, { value: 'NASAL', label: 'Nasal' }, { value: 'OTHER', label: 'Other' }]} {...register('route')} />
            <Select label="Status" options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'COMPLETED', label: 'Completed' }, { value: 'DISCONTINUED', label: 'Discontinued' }, { value: 'ON_HOLD', label: 'On Hold' }]} {...register('status')} />
          </div>

          <Input label="Start Date" type="date" {...register('startDate', { required: 'Start date required' })} />
          <Input label="Special Instructions" placeholder="Take after meals" {...register('instructions')} />

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>{editingMed ? 'Update Medication' : 'Save Prescription'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Remove Medication" message="Are you sure you want to remove this medication prescription?" isLoading={isDeleting} />
    </div>
  );
};
