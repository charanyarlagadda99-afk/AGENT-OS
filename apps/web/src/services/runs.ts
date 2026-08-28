import { api } from '../lib/api';

export const runsService = {
  listRuns: () => api.get<any[]>('/runs'),
  getRun: (id: string) => api.get<any>(`/runs/${id}`),
  getRunSteps: (id: string) => api.get<any[]>(`/runs/${id}/steps`)
};
