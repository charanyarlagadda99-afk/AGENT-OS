import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './layouts/AppShell';
import { AuthLayout } from './layouts/AuthLayout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Agents } from './pages/Agents';
import { AgentNew } from './pages/AgentNew';
import { AgentDetail } from './pages/AgentDetail';
import { Missions } from './pages/Missions';
import { MissionNew } from './pages/MissionNew';
import { MissionDetail } from './pages/MissionDetail';
import { WorkspaceDetail } from './pages/WorkspaceDetail';
import { Approvals } from './pages/Approvals';
import { Memory } from './pages/Memory';
import { Tools } from './pages/Tools';
import { Checkpoints } from './pages/Checkpoints';
import { Runs } from './pages/Runs';
import { RunDetail } from './pages/RunDetail';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/agents/new" element={<AgentNew />} />
            <Route path="/agents/:id" element={<AgentDetail />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/missions/new" element={<MissionNew />} />
            <Route path="/missions/:id" element={<MissionDetail />} />
            <Route path="/workspaces/:id" element={<WorkspaceDetail />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/memory" element={<Memory />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/checkpoints" element={<Checkpoints />} />
            <Route path="/runs" element={<Runs />} />
            <Route path="/runs/:id" element={<RunDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
