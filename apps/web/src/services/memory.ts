import { api } from '../lib/api';

export const memoryService = {
  listMemories: () => api.get<any[]>('/memory'),
  createMemory: (data: any) => api.post<any>('/memory', data),
  searchMemories: (query: string) => api.get<any[]>(`/memory/search?q=${encodeURIComponent(query)}`),
  deleteMemory: (id: string) => api.delete<any>(`/memory/${id}`)
};
