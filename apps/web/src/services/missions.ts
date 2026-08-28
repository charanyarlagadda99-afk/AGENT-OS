import { api } from '../lib/api';

export const missionsService = {
  listMissions: () => api.get<any[]>('/missions'),
  getMission: (id: string) => api.get<any>(`/missions/${id}`),
  createMission: (data: any) => api.post<any>('/missions', data),
  startMission: (id: string) => api.post<any>(`/missions/${id}/start`, {}),
  pauseMission: (id: string) => api.post<any>(`/missions/${id}/pause`, {}),
  resumeMission: (id: string) => api.post<any>(`/missions/${id}/resume`, {}),
  cancelMission: (id: string) => api.post<any>(`/missions/${id}/cancel`, {})
};
