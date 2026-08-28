import { api } from '../lib/api';

export const workspacesService = {
  listWorkspaces: () => api.get<any[]>('/workspaces'),
  getFileTree: (id: string) => api.get<any>(`/workspaces/${id}/tree`),
  readFile: (id: string, path: string) => api.get<any>(`/workspaces/${id}/file?path=${encodeURIComponent(path)}`),
  createFile: (id: string, data: any) => api.post<any>(`/workspaces/${id}/file`, data),
  updateFile: (id: string, data: any) => api.patch<any>(`/workspaces/${id}/file`, data),
  deleteFile: (id: string, path: string) => api.delete<any>(`/workspaces/${id}/file?path=${encodeURIComponent(path)}`)
};
