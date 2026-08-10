import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { residentsApi } from '../../api/residents.api';
import { Resident } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { DataTable, Column } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';
import { FilterBar, FilterGroup } from '../../components/ui/FilterBar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ResidentFormModal } from './ResidentFormModal';
import { Plus, Eye, Edit2, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';

export const ResidentsPage: React.FC = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const res = await residentsApi.getAll();
      if (res.success && res.data) {
        setResidents(res.data);
      }
    } catch (err) {
      toast.error('Failed to fetch resident records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleCreateOrUpdate = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (editingResident) {
        const res = await residentsApi.update(editingResident._id, data);
        if (res.success) {
          toast.success('Resident record updated');
          fetchResidents();
          setIsModalOpen(false);
          setSearch('');
          setStatusFilter('ALL');
        }
      } else {
        const res = await residentsApi.create(data);
        if (res.success) {
          toast.success('New resident added successfully');
          fetchResidents();
          setIsModalOpen(false);
          // Reset search/filter so new resident is visible
          setSearch('');
          setStatusFilter('ALL');
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
      const res = await residentsApi.delete(deleteId);
      if (res.success) {
        toast.success('Resident record deleted');
        setResidents((prev) => prev.filter((r) => r._id !== deleteId));
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete resident');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter & Search Logic
  const filteredResidents = residents.filter((res) => {
    const matchesSearch =
      res.firstName.toLowerCase().includes(search.toLowerCase()) ||
      res.lastName.toLowerCase().includes(search.toLowerCase()) ||
      res.residentId.toLowerCase().includes(search.toLowerCase()) ||
      (res.roomNumber && res.roomNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || res.status === statusFilter;

    return matchesSearch && matchesStatus;
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
        { label: 'Inactive', value: 'INACTIVE' },
        { label: 'Discharged', value: 'DISCHARGED' },
      ],
    },
  ];

  const columns: Column<Resident>[] = [
    {
      header: 'Resident ID',
      accessor: 'residentId',
      cell: (r) => <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{r.residentId}</span>,
    },
    {
      header: 'Name',
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs">
            {r.firstName[0]}
            {r.lastName[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{r.firstName} {r.lastName}</p>
            <p className="text-[11px] text-slate-400">{r.gender}, {r.age} yrs</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Room',
      cell: (r) => <span className="font-medium text-slate-700 dark:text-slate-300">{r.roomNumber || 'N/A'}</span>,
    },
    {
      header: 'Emergency Contact',
      cell: (r) => (
        <div className="text-xs">
          <p className="font-medium text-slate-800 dark:text-slate-200">{r.emergencyContactName}</p>
          <p className="text-slate-400">{r.emergencyContactPhone}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (r) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/residents/${r._id}`)}
            title="View Details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditingResident(r);
              setIsModalOpen(true);
            }}
            title="Edit"
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteId(r._id)}
            title="Delete"
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
        title="Resident Directory"
        description="Comprehensive management of elder facility residents, medical profiles, and care history."
        action={
          <Button
            onClick={() => {
              setEditingResident(null);
              setIsModalOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Add New Resident
          </Button>
        }
      />

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name, ID, or room..."
          className="w-full sm:w-80"
        />
        <FilterBar
          filters={filterGroups}
          onReset={() => {
            setSearch('');
            setStatusFilter('ALL');
          }}
        />
      </div>

      {/* Residents Table */}
      <DataTable
        columns={columns}
        data={filteredResidents}
        isLoading={loading}
        emptyMessage="No resident profiles found."
        onRowClick={(r) => navigate(`/residents/${r._id}`)}
        keyExtractor={(r) => r._id}
      />

      {/* Form Modal */}
      <ResidentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingResident}
        isLoading={isSubmitting}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Resident Record"
        message="Are you sure you want to delete this resident record? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
};
