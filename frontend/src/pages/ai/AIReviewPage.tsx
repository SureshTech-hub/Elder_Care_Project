import React, { useEffect, useState } from 'react';
import { aiApi } from '../../api/ai.api';
import { residentsApi } from '../../api/residents.api';
import { AIReview, Resident, AICategory } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { DataTable, Column } from '../../components/ui/DataTable';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { Bot, Sparkles, Send, History } from 'lucide-react';
import toast from 'react-hot-toast';

export const AIReviewPage: React.FC = () => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [reviews, setReviews] = useState<AIReview[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedResident, setSelectedResident] = useState('');
  const [category, setCategory] = useState<AICategory>('GENERAL');
  const [inputContext, setInputContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [latestResult, setLatestResult] = useState<AIReview | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resRes, revRes] = await Promise.all([residentsApi.getAll(), aiApi.getReviews()]);
      if (resRes.success && resRes.data) {
        setResidents(resRes.data);
        if (resRes.data.length > 0) setSelectedResident(resRes.data[0]._id);
      }
      if (revRes.success && revRes.data) {
        setReviews(revRes.data);
      }
    } catch (err) {
      toast.error('Failed to load AI review history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResident || !inputContext.trim()) {
      toast.error('Please select a resident and enter operational context');
      return;
    }

    try {
      setIsGenerating(true);
      const res = await aiApi.generateReview({
        resident: selectedResident,
        input: inputContext,
        category,
      });

      if (res.success && res.data) {
        setLatestResult(res.data);
        setReviews((prev) => [res.data!, ...prev]);
        toast.success('AI operational review generated');
        setInputContext('');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to generate AI review');
    } finally {
      setIsGenerating(false);
    }
  };

  const columns: Column<AIReview>[] = [
    {
      header: 'Resident',
      cell: (r) => {
        const name = typeof r.resident === 'object' ? `${r.resident.firstName} ${r.resident.lastName}` : 'Resident';
        return <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{name}</span>;
      },
    },
    {
      header: 'Category',
      cell: (r) => (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          {r.category}
        </span>
      ),
    },
    {
      header: 'Input Context',
      cell: (r) => <p className="text-xs text-slate-500 line-clamp-1 max-w-xs">{r.input}</p>,
    },
    {
      header: 'AI Output Preview',
      cell: (r) => <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-1 max-w-md">{r.response}</p>,
    },
    {
      header: 'Date',
      cell: (r) => <span className="text-[11px] text-slate-400">{new Date(r.createdAt || Date.now()).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Operations Review Assistant"
        description="Generates concise operational insights, care plan suggestions, and risk summaries powered by backend Gemini AI intelligence."
      />

      {/* Mandatory Clinical Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
        <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold">Important Operational Disclaimer</p>
          <p className="text-slate-600 dark:text-slate-300">
            "AI-generated operational assistance. Not a medical diagnosis." This tool assists staff with logistics, care plan summaries, and risk triage.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Request AI Operations Review</h3>
          </div>

          <form onSubmit={handleGenerateReview} className="space-y-4">
            <Select
              label="Target Resident"
              options={residents.map((r) => ({ value: r._id, label: `${r.firstName} ${r.lastName} (${r.residentId})` }))}
              value={selectedResident}
              onChange={(e) => setSelectedResident(e.target.value)}
              required
            />

            <Select
              label="Review Category"
              options={[
                { value: 'GENERAL', label: 'General Operations' },
                { value: 'HEALTH', label: 'Health Indicators' },
                { value: 'CARE_PLAN', label: 'Care Plan Evaluation' },
                { value: 'MEDICATION', label: 'Medication Adherence' },
                { value: 'INCIDENT', label: 'Incident Review' },
                { value: 'RISK', label: 'Risk Assessment' },
              ]}
              value={category}
              onChange={(e) => setCategory(e.target.value as AICategory)}
            />

            <div className="w-full">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Input Context / Observational Notes
              </label>
              <textarea
                rows={4}
                value={inputContext}
                onChange={(e) => setInputContext(e.target.value)}
                placeholder="Enter resident behavior, recent vitals, missed tasks, or care observations..."
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <Button type="submit" className="w-full" isLoading={isGenerating} icon={<Send className="w-4 h-4" />}>
              Generate AI Review
            </Button>
          </form>
        </div>

        {/* Latest AI Output Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3 mb-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" /> AI Response Output
              </h3>
              {latestResult && (
                <span className="text-[10px] font-bold text-slate-400">
                  Model: {latestResult.model || 'Gemini'}
                </span>
              )}
            </div>

            {isGenerating ? (
              <div className="py-12 text-center space-y-3">
                <Bot className="w-10 h-10 text-indigo-600 animate-bounce mx-auto" />
                <p className="text-xs text-slate-500 font-semibold">Generating AI operational response...</p>
              </div>
            ) : latestResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-slate-900/50 border border-indigo-100 dark:border-slate-700 text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                  {latestResult.response}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-slate-400">
                Submit resident context on the left to generate real-time AI operational insights.
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400 italic text-center pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-4">
            AI-generated operational assistance. Not a medical diagnosis.
          </p>
        </div>
      </div>

      {/* Review History Table */}
      <div className="space-y-3">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" /> AI Review History
        </h3>
        <DataTable columns={columns} data={reviews} isLoading={loading} emptyMessage="No AI review history." keyExtractor={(r) => r._id} />
      </div>
    </div>
  );
};
