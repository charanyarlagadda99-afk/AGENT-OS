import { api } from '../lib/api';

export const approvalsService = {
  listApprovals: () => api.get<any[]>('/approvals'),
  getApproval: (id: string) => api.get<any>(`/approvals/${id}`),
  approveAction: (id: string) => api.post<any>(`/approvals/${id}/approve`, {}),
  rejectAction: (id: string, reason?: string) => api.post<any>(`/approvals/${id}/reject`, { reason })
};
