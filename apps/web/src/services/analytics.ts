import { api } from '../lib/api';

export const analyticsService = {
  getOverview: () => api.get<any>('/analytics/overview'),
  getAgentMetrics: (agentId: string) => api.get<any>(`/analytics/agents/${agentId}`),
  getMissionMetrics: (missionId: string) => api.get<any>(`/analytics/missions/${missionId}`)
};
