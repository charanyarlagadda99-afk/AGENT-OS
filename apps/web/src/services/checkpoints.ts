import { api } from '../lib/api';

export const checkpointsService = {
  listCheckpoints: () => api.get<any[]>('/checkpoints'),
  getCheckpoint: (id: string) => api.get<any>(`/checkpoints/${id}`),
  restoreCheckpoint: (id: string) => api.post<any>(`/checkpoints/${id}/restore`, {})
};
