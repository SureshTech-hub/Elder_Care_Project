import React, { useEffect, useState } from 'react';
import { auditsApi } from '../../api/audits.api';
import { AuditLog } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable, Column } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';
import { FilterBar, FilterGroup } from '../../components/ui/FilterBar';
import { Shield, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await auditsApi.getAll();
      if (res.success && res.data) setLogs(res.data);
    } catch (err) {
      toast.error('Failed to load system audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter((log) => {
    const actionMatch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase()) ||
      (log.description && log.description.toLowerCase().includes(search.toLowerCase()));
    const moduleMatch = moduleFilter === 'ALL' || log.module === moduleFilter;
    return actionMatch && moduleMatch;
  });

  const filterGroups: FilterGroup[] = [
    {
      key: 'module',
      label: 'Module',
      value: moduleFilter,
      onChange: setModuleFilter,
      options: [
        { label: 'All Modules', value: 'ALL' },
        { label: 'AUTH', value: 'AUTH' },
        { label: 'RESIDENTS', value: 'RESIDENTS' },
        { label: 'CARE_PLANS', value: 'CARE_PLANS' },
        { label: 'MEDICATIONS', value: 'MEDICATIONS' },
        { label: 'TASKS', value: 'TASKS' },
        { label: 'INCIDENTS', value: 'INCIDENTS' },
      ],
    },
  ];

  const columns: Column<AuditLog>[] = [
    {
      header: 'Action & Module',
      cell: (log) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{log.action}</p>
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{log.module}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Performed By User',
      cell: (log) => {
        const name = typeof log.user === 'object' ? log.user.fullName : 'System User';
        return <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">{name}</span>;
      },
    },
    {
      header: 'HTTP Method & Route',
      cell: (log) => (
        <div className="text-xs">
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{log.method || 'GET'}</span>{' '}
          <span className="text-slate-500 font-mono text-[11px]">{log.endpoint || '/'}</span>
        </div>
      ),
    },
    {
      header: 'IP Address',
      cell: (log) => <span className="font-mono text-xs text-slate-500">{log.ipAddress || '127.0.0.1'}</span>,
    },
    {
      header: 'Timestamp',
      cell: (log) => <span className="text-xs text-slate-400">{new Date(log.createdAt || Date.now()).toLocaleString()}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Complete security and compliance audit trail tracking system activity and staff data access."
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <SearchBar value={search} onChange={setSearch} placeholder="Search audit logs..." className="w-full sm:w-80" />
        <FilterBar filters={filterGroups} onReset={() => { setSearch(''); setModuleFilter('ALL'); }} />
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} emptyMessage="No audit logs recorded." keyExtractor={(log) => log._id} />
    </div>
  );
};
