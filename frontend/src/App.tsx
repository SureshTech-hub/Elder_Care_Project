import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResidentsPage } from './pages/residents/ResidentsPage';
import { ResidentDetailPage } from './pages/residents/ResidentDetailPage';
import { CarePlansPage } from './pages/care-plans/CarePlansPage';
import { MedicationsPage } from './pages/medications/MedicationsPage';
import { ActivitiesPage } from './pages/activities/ActivitiesPage';
import { TasksPage } from './pages/tasks/TasksPage';
import { IncidentsPage } from './pages/incidents/IncidentsPage';
import { ShiftsPage } from './pages/shifts/ShiftsPage';
import { AlertsPage } from './pages/alerts/AlertsPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { PredictionsPage } from './pages/predictions/PredictionsPage';
import { AIReviewPage } from './pages/ai/AIReviewPage';
import { AuditLogsPage } from './pages/audits/AuditLogsPage';
import { UsersPage } from './pages/users/UsersPage';
import { ReportsPage } from './pages/reports/ReportsPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Dashboard Layout Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/residents" element={<ResidentsPage />} />
                <Route path="/residents/:id" element={<ResidentDetailPage />} />
                <Route path="/care-plans" element={<CarePlansPage />} />
                <Route path="/medications" element={<MedicationsPage />} />
                <Route path="/activities" element={<ActivitiesPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/incidents" element={<IncidentsPage />} />
                <Route path="/shifts" element={<ShiftsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/predictions" element={<PredictionsPage />} />
                <Route path="/ai" element={<AIReviewPage />} />
                <Route path="/audits" element={<AuditLogsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Route>
            </Route>

            {/* Default Catch-all Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
