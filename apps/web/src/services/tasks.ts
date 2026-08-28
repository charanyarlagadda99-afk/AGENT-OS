import { api } from '../lib/api';

export const tasksService = {
  listTasks: () => api.get<any[]>('/tasks'),
  getTask: (id: string) => api.get<any>(`/tasks/${id}`),
  createTask: (data: any) => api.post<any>('/tasks', data),
  updateTask: (id: string, data: any) => api.patch<any>(`/tasks/${id}`, data)
};
