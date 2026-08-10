import React, { useEffect, useState } from 'react';
import { reportsApi } from '../../api/reports.api';
import { SummaryReport } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Printer, FileText, Users, CheckSquare, AlertTriangle, Pill, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReportsPage: React.FC = () => {
  const [report, setReport] = useState<SummaryReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await reportsApi.getSummary();
      if (res.success && res.data) {
        setReport(res.data);
      }
    } catch (err) {
      setError(true);
      toast.error('Failed to generate summary report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingSkeleton rows={4} columns={3} />;

  if (error || !report) {
    return (
      <ErrorState
        title="Failed to fetch operations report"
        message="Unable to compile facility operational summary report."
        onRetry={fetchReport}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="no-print">
        <PageHeader
          title="Facility Summary Report"
          description="Consolidated facility operations summary report powered by live backend analytics."
          action={
            <Button onClick={handlePrint} icon={<Printer className="w-4 h-4" />}>
              Print Report
            </Button>
          }
        />
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                ELDER CARE OPERATIONS REPORT
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generated At: {new Date(report.generatedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            OFFICIAL SUMMARY
          </span>
        </div>

        {/* Report Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Residents"
            value={report.totalResidents}
            icon={<Users className="w-5 h-5" />}
            color="indigo"
          />
          <StatCard
            title="Total Tasks"
            value={report.totalTasks}
            icon={<CheckSquare className="w-5 h-5" />}
            color="purple"
          />
          <StatCard
            title="Total Incidents"
            value={report.totalIncidents}
            icon={<AlertTriangle className="w-5 h-5" />}
            color="rose"
          />
          <StatCard
            title="Active Medications"
            value={report.activeMedications}
            icon={<Pill className="w-5 h-5" />}
            color="emerald"
          />
          <StatCard
            title="Active System Alerts"
            value={report.activeAlerts}
            icon={<Bell className="w-5 h-5" />}
            color="amber"
          />
        </div>

        {/* Executive Narrative Section */}
        <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Facility Executive Summary
          </h3>
          <p>
            The facility is currently managing <strong>{report.totalResidents} residents</strong> across all wings. Staff have logged <strong>{report.totalTasks} operational tasks</strong> and maintain <strong>{report.activeMedications} active prescription orders</strong>.
          </p>
          <p>
            System monitors report <strong>{report.activeAlerts} active alerts</strong> and <strong>{report.totalIncidents} recorded incidents</strong> requiring ongoing supervisory review.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-700/60 text-center text-[11px] text-slate-400">
          Elder Care Predictive Operations Command Center &bull; Confidential Administrative Record
        </div>
      </div>
    </div>
  );
};
