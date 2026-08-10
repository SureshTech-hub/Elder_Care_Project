import React, { useEffect, useState } from 'react';
import { predictionsApi } from '../../api/predictions.api';
import { residentsApi } from '../../api/residents.api';
import { Prediction, Resident } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { DataTable, Column } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';
import { FilterBar, FilterGroup } from '../../components/ui/FilterBar';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { TrendingUp, Plus, AlertCircle, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const PredictionsPage: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, rRes] = await Promise.all([predictionsApi.getAll(), residentsApi.getAll()]);
      if (pRes.success && pRes.data) setPredictions(pRes.data);
      if (rRes.success && rRes.data) setResidents(rRes.data);
    } catch (err) {
      toast.error('Failed to load predictive risk records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFormSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        probability: Number(formData.probability),
        score: Number(formData.score),
        recommendations: formData.recommendations ? formData.recommendations.split(',').map((s: string) => s.trim()) : [],
      };
      const res = await predictionsApi.create(payload);
      if (res.success) {
        toast.success('Predictive risk record generated');
        fetchData();
        setIsModalOpen(false);
        reset();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = predictions.filter((p) => {
    const typeMatch = p.predictionType.toLowerCase().includes(search.toLowerCase());
    const riskMatch = riskFilter === 'ALL' || p.riskLevel === riskFilter;
    return typeMatch && riskMatch;
  });

  const filterGroups: FilterGroup[] = [
    {
      key: 'riskLevel',
      label: 'Risk Level',
      value: riskFilter,
      onChange: setRiskFilter,
      options: [
        { label: 'All Risk Levels', value: 'ALL' },
        { label: 'Critical', value: 'CRITICAL' },
        { label: 'High', value: 'HIGH' },
        { label: 'Medium', value: 'MEDIUM' },
        { label: 'Low', value: 'LOW' },
      ],
    },
  ];

  const columns: Column<Prediction>[] = [
    {
      header: 'Prediction Category',
      cell: (p) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{p.predictionType.replace(/_/g, ' ')}</p>
            <p className="text-xs text-slate-400">Model {p.modelVersion || 'v1'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Resident',
      cell: (p) => {
        const name = typeof p.resident === 'object' ? `${p.resident.firstName} ${p.resident.lastName}` : 'Resident';
        return <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-xs">{name}</span>;
      },
    },
    {
      header: 'Probability Score',
      cell: (p) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(p.probability || 0) * 100}%` }} />
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {((p.probability || 0) * 100).toFixed(0)}%
          </span>
        </div>
      ),
    },
    {
      header: 'Risk Level',
      cell: (p) => <RiskBadge level={p.riskLevel} size="sm" />,
    },
    {
      header: 'Status',
      cell: (p) => <StatusBadge status={p.status} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Predictive Risk Management"
        description="AI and rules-based predictive algorithms identifying fall risks, health deterioration, and hospitalization probability."
        action={
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Generate Risk Prediction
          </Button>
        }
      />

      {/* Clinical Disclaimer Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200">
        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <p className="font-bold">Operational Predictive Intelligence Disclaimer</p>
          <p className="text-slate-600 dark:text-slate-300">
            This module provides operational decision support and trend indicators. It is not a medical diagnosis and does not replace professional clinical evaluation.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <SearchBar value={search} onChange={setSearch} placeholder="Search risk predictions..." className="w-full sm:w-80" />
        <FilterBar filters={filterGroups} onReset={() => { setSearch(''); setRiskFilter('ALL'); }} />
      </div>

      <DataTable columns={columns} data={filtered} isLoading={loading} emptyMessage="No risk prediction records found." keyExtractor={(p) => p._id} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate Risk Prediction" maxWidth="md">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <Select label="Resident" options={residents.map((r) => ({ value: r._id, label: `${r.firstName} ${r.lastName} (${r.residentId})` }))} {...register('resident', { required: 'Required' })} error={errors.resident?.message as string} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Prediction Type" options={[{ value: 'FALL_RISK', label: 'Fall Risk' }, { value: 'HEALTH_RISK', label: 'Health Risk' }, { value: 'MEDICATION_RISK', label: 'Medication Risk' }, { value: 'HOSPITALIZATION', label: 'Hospitalization' }, { value: 'OTHER', label: 'Other' }]} {...register('predictionType')} />
            <Select label="Risk Level" options={[{ value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'HIGH', label: 'High' }, { value: 'CRITICAL', label: 'Critical' }]} {...register('riskLevel')} />
            <Input label="Probability (0 - 1.0)" type="number" step="0.01" defaultValue="0.75" {...register('probability', { required: 'Required' })} />
            <Input label="Risk Score (0 - 100)" type="number" defaultValue="75" {...register('score')} />
          </div>

          <Input label="Explanation / Reasoning" placeholder="Resident showed gait instability and 2 missed doses." {...register('explanation')} />
          <Input label="Recommendations (comma separated)" placeholder="Install bedside rail, increase vitals checks" {...register('recommendations')} />

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Submit Prediction</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
