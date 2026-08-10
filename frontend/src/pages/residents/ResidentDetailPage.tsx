import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { residentsApi } from '../../api/residents.api';
import { carePlansApi } from '../../api/carePlans.api';
import { medicationsApi } from '../../api/medications.api';
import { activitiesApi } from '../../api/activities.api';
import { tasksApi } from '../../api/tasks.api';
import { incidentsApi } from '../../api/incidents.api';
import { predictionsApi } from '../../api/predictions.api';
import { alertsApi } from '../../api/alerts.api';

import {
  Resident,
  CarePlan,
  Medication,
  Activity,
  Task,
  Incident,
  Prediction,
  Alert,
} from '../../types';

import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';

import {
  User,
  Phone,
  MapPin,
  Calendar,
  Heart,
  AlertCircle,
  ClipboardList,
  Pill,
  Activity as ActivityIcon,
  CheckSquare,
  AlertTriangle,
  TrendingUp,
  Bell,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

type DetailTab =
  | 'overview'
  | 'care-plans'
  | 'medications'
  | 'activities'
  | 'tasks'
  | 'incidents'
  | 'predictions'
  | 'alerts';

export const ResidentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(true);

  // Tab Data States
  const [carePlans, setCarePlans] = useState<CarePlan[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (!id) return;
    const fetchResidentDetails = async () => {
      try {
        setLoading(true);
        const res = await residentsApi.getById(id);
        if (res.success && res.data) {
          setResident(res.data);
        }

        // Fetch associated module data for this resident in parallel
        const [cpRes, medRes, actRes, taskRes, incRes, predRes, alertRes] = await Promise.allSettled([
          carePlansApi.getByResident(id),
          medicationsApi.getByResident(id),
          activitiesApi.getByResident(id),
          tasksApi.getByResident(id),
          incidentsApi.getByResident(id),
          predictionsApi.getByResident(id),
          alertsApi.getByResident(id),
        ]);

        if (cpRes.status === 'fulfilled' && cpRes.value.success && cpRes.value.data)
          setCarePlans(cpRes.value.data);
        if (medRes.status === 'fulfilled' && medRes.value.success && medRes.value.data)
          setMedications(medRes.value.data);
        if (actRes.status === 'fulfilled' && actRes.value.success && actRes.value.data)
          setActivities(actRes.value.data);
        if (taskRes.status === 'fulfilled' && taskRes.value.success && taskRes.value.data)
          setTasks(taskRes.value.data);
        if (incRes.status === 'fulfilled' && incRes.value.success && incRes.value.data)
          setIncidents(incRes.value.data);
        if (predRes.status === 'fulfilled' && predRes.value.success && predRes.value.data)
          setPredictions(predRes.value.data);
        if (alertRes.status === 'fulfilled' && alertRes.value.success && alertRes.value.data)
          setAlerts(alertRes.value.data);
      } catch (err) {
        toast.error('Failed to load resident profile');
      } finally {
        setLoading(false);
      }
    };

    fetchResidentDetails();
  }, [id]);

  if (loading) {
    return <LoadingSkeleton rows={6} columns={2} />;
  }

  if (!resident) {
    return (
      <ErrorState
        title="Resident profile not found"
        message="The requested resident record could not be retrieved from the server."
        onRetry={() => navigate('/residents')}
      />
    );
  }

  const tabs: { key: DetailTab; label: string; count?: number; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { key: 'care-plans', label: 'Care Plans', count: carePlans.length, icon: <ClipboardList className="w-4 h-4" /> },
    { key: 'medications', label: 'Medications', count: medications.length, icon: <Pill className="w-4 h-4" /> },
    { key: 'activities', label: 'Activities', count: activities.length, icon: <ActivityIcon className="w-4 h-4" /> },
    { key: 'tasks', label: 'Tasks', count: tasks.length, icon: <CheckSquare className="w-4 h-4" /> },
    { key: 'incidents', label: 'Incidents', count: incidents.length, icon: <AlertTriangle className="w-4 h-4" /> },
    { key: 'predictions', label: 'Predictions', count: predictions.length, icon: <TrendingUp className="w-4 h-4" /> },
    { key: 'alerts', label: 'Alerts', count: alerts.length, icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={<Breadcrumbs />}
        title={`${resident.firstName} ${resident.lastName}`}
        description={`ID: ${resident.residentId} • Room ${resident.roomNumber || 'Unassigned'} • Age ${resident.age}`}
        action={
          <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/residents')}>
            Back to Directory
          </Button>
        }
      />

      {/* Header Profile Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 font-extrabold text-white text-xl shadow-md">
            {resident.firstName[0]}
            {resident.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {resident.firstName} {resident.lastName}
              </h2>
              <StatusBadge status={resident.status} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Gender: <span className="font-semibold text-slate-700 dark:text-slate-300">{resident.gender}</span> | Blood Group:{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">{resident.bloodGroup || 'N/A'}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block font-semibold text-[10px] uppercase">Emergency Contact</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{resident.emergencyContactName}</span>
            <span className="text-slate-500 block">{resident.emergencyContactPhone}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block font-semibold text-[10px] uppercase">Admission Date</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {new Date(resident.admissionDate || resident.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Header Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  activeTab === tab.key
                    ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content Display */}
      <div className="space-y-4">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-indigo-600">
                Personal Information
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-slate-400">Phone</span>
                  <span className="font-semibold">{resident.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-slate-400">Date of Birth</span>
                  <span className="font-semibold">
                    {resident.dateOfBirth ? new Date(resident.dateOfBirth).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700/50">
                  <span className="text-slate-400">Address</span>
                  <span className="font-semibold">{resident.address || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-rose-600">
                Medical Indicators & Allergies
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1.5 font-semibold">Medical Conditions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {resident.medicalConditions && resident.medicalConditions.length > 0 ? (
                      resident.medicalConditions.map((cond, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-semibold">
                          {cond}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">None reported</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1.5 font-semibold">Known Allergies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {resident.allergies && resident.allergies.length > 0 ? (
                      resident.allergies.map((alg, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold">
                          {alg}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">No known allergies</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'care-plans' && (
          <div className="space-y-3">
            {carePlans.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center bg-white dark:bg-slate-800 rounded-xl">No care plans on record for this resident.</p>
            ) : (
              carePlans.map((cp) => (
                <div key={cp._id} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{cp.title}</h4>
                      <StatusBadge status={cp.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cp.description}</p>
                  </div>
                  <RiskBadge level={cp.priority} size="sm" />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="space-y-3">
            {medications.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center bg-white dark:bg-slate-800 rounded-xl">No medications prescribed for this resident.</p>
            ) : (
              medications.map((m) => (
                <div key={m._id} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{m.medicationName}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Dosage: {m.dosage} • Frequency: {m.frequency}</p>
                  </div>
                  <StatusBadge status={m.status} size="sm" />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center bg-white dark:bg-slate-800 rounded-xl">No activities logged for this resident.</p>
            ) : (
              activities.map((a) => (
                <div key={a._id} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{a.activityName}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Scheduled: {new Date(a.scheduledDate).toLocaleString()}</p>
                  </div>
                  <StatusBadge status={a.status} size="sm" />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center bg-white dark:bg-slate-800 rounded-xl">No operational tasks assigned for this resident.</p>
            ) : (
              tasks.map((t) => (
                <div key={t._id} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{t.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Due: {new Date(t.dueDate).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={t.status} size="sm" />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'incidents' && (
          <div className="space-y-3">
            {incidents.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center bg-white dark:bg-slate-800 rounded-xl">No incidents recorded for this resident.</p>
            ) : (
              incidents.map((inc) => (
                <div key={inc._id} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{inc.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{inc.description}</p>
                  </div>
                  <RiskBadge level={inc.severity} size="sm" />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'predictions' && (
          <div className="space-y-3">
            {predictions.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center bg-white dark:bg-slate-800 rounded-xl">No AI/Predictive risks active for this resident.</p>
            ) : (
              predictions.map((p) => (
                <div key={p._id} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{p.predictionType.replace(/_/g, ' ')}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Probability: {((p.probability || 0) * 100).toFixed(0)}%</p>
                  </div>
                  <RiskBadge level={p.riskLevel} size="sm" />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center bg-white dark:bg-slate-800 rounded-xl">No alerts recorded for this resident.</p>
            ) : (
              alerts.map((al) => (
                <div key={al._id} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{al.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{al.message}</p>
                  </div>
                  <RiskBadge level={al.severity} size="sm" />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
