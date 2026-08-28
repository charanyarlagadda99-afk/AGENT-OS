import { api } from '../lib/api';

export const agentsService = {
  listAgents: () => api.get<any[]>('/agents'),
  getAgent: (id: string) => api.get<any>(`/agents/${id}`),
  createAgent: (data: any) => api.post<any>('/agents', data),
  updateAgent: (id: string, data: any) => api.patch<any>(`/agents/${id}`, data),
  deleteAgent: (id: string) => api.delete<any>(`/agents/${id}`),
  pauseAgent: (id: string) => api.post<any>(`/agents/${id}/pause`, {}),
  resumeAgent: (id: string) => api.post<any>(`/agents/${id}/resume`, {}),
  terminateAgent: (id: string) => api.post<any>(`/agents/${id}/terminate`, {})
};
