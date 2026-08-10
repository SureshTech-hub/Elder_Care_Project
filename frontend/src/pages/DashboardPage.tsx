import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboard.api';
import { alertsApi } from '../api/alerts.api';
import { predictionsApi } from '../api/predictions.api';
import { DashboardStats, Alert, Prediction } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { ChartCard } from '../components/ui/ChartCard';
import { PageHeader } from '../components/ui/PageHeader';
import { RiskBadge } from '../components/ui/RiskBadge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import {
  Users,
  UserCheck,
  CheckSquare,
  Bell,
  AlertTriangle,
  Pill,
  TrendingUp,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [recentPredictions, setRecentPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(false);
      const [dashRes, alertRes, predRes] = await Promise.all([
        dashboardApi.getStats(),
        alertsApi.getAll(),
        predictionsApi.getAll(),
      ]);

      if (dashRes.success && dashRes.data) {
        setStats(dashRes.data);
      }
      if (alertRes.success && alertRes.data) {
        setRecentAlerts(alertRes.data.slice(0, 5));
      }
      if (predRes.success && predRes.data) {
        setRecentPredictions(predRes.data.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSkeleton rows={4} columns={3} />;
  }

  if (error || !stats) {
    return (
      <ErrorState
        title="Unable to load operations dashboard"
        message="Could not fetch real-time stats from backend APIs."
        onRetry={fetchDashboardData}
      />
    );
  }

  // Visual chart data prepared from real stats & predictions
  const riskCounts = {
    LOW: recentPredictions.filter((p) => p.riskLevel === 'LOW').length,
    MEDIUM: recentPredictions.filter((p) => p.riskLevel === 'MEDIUM').length,
    HIGH: recentPredictions.filter((p) => p.riskLevel === 'HIGH').length,
    CRITICAL: recentPredictions.filter((p) => p.riskLevel === 'CRITICAL').length,
  };

  const riskPieData = [
    { name: 'Low Risk', value: riskCounts.LOW || 1, color: '#10b981' },
    { name: 'Medium Risk', value: riskCounts.MEDIUM || 1, color: '#f59e0b' },
    { name: 'High Risk', value: riskCounts.HIGH || 1, color: '#f97316' },
    { name: 'Critical Risk', value: riskCounts.CRITICAL || 1, color: '#ef4444' },
  ];

  const opsBarData = [
    { name: 'Residents', count: stats.residents },
    { name: 'Tasks', count: stats.tasks },
    { name: 'Active Alerts', count: stats.activeAlerts },
    { name: 'Incidents', count: stats.incidents },
    { name: 'Medications', count: stats.activeMedications },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations Command Center"
        description="Real-time facility overview, active alerts, operational tasks, and AI-driven predictive risks."
      />

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Residents"
          value={stats.residents}
          icon={<Users className="w-5 h-5" />}
          color="indigo"
          description="Total active facility residents"
        />
        <StatCard
          title="Staff Users"
          value={stats.users}
          icon={<UserCheck className="w-5 h-5" />}
          color="blue"
          description="Registered staff members"
        />
        <StatCard
          title="Total Tasks"
          value={stats.tasks}
          icon={<CheckSquare className="w-5 h-5" />}
          color="purple"
          description="Active & scheduled tasks"
        />
        <StatCard
          title="Active Alerts"
          value={stats.activeAlerts}
          icon={<Bell className="w-5 h-5" />}
          color="amber"
          description="Requires staff attention"
        />
        <StatCard
          title="Incidents"
          value={stats.incidents}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="rose"
          description="Total reported incidents"
        />
        <StatCard
          title="Medications"
          value={stats.activeMedications}
          icon={<Pill className="w-5 h-5" />}
          color="emerald"
          description="Active prescriptions"
        />
      </div>

      {/* Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Facility Operations Distribution"
          subtitle="Breakdown of system records"
          className="lg:col-span-2"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={opsBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    color: '#fff',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Predictive Risk Distribution" subtitle="Active risk assessments">
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    color: '#fff',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-3 text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Critical
            </span>
          </div>
        </ChartCard>
      </div>

      {/* Tables Row: Recent Alerts & Recent Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" /> Recent System Alerts
            </h3>
          </div>
          {recentAlerts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No recent alerts recorded.</p>
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert._id}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {alert.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {alert.message}
                    </p>
                  </div>
                  <RiskBadge level={alert.severity} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Predictive Risk Highlights */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" /> Predictive Intelligence
            </h3>
          </div>
          {recentPredictions.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No predictions recorded.</p>
          ) : (
            <div className="space-y-3">
              {recentPredictions.map((pred) => (
                <div
                  key={pred._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {pred.predictionType.replace(/_/g, ' ')}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Probability: {((pred.probability || 0) * 100).toFixed(0)}%
                    </p>
                  </div>
                  <RiskBadge level={pred.riskLevel} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
