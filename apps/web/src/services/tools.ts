import { api } from '../lib/api';

export const toolsService = {
  listTools: () => api.get<any[]>('/tools'),
  createTool: (data: any) => api.post<any>('/tools', data),
  updateTool: (id: string, data: any) => api.patch<any>(`/tools/${id}`, data),
  getAgentTools: (agentId: string) => api.get<any[]>(`/agents/${agentId}/tools`),
  assignTool: (agentId: string, toolId: string) => api.post<any>(`/agents/${agentId}/tools`, { toolId }),
  removeTool: (agentId: string, toolId: string) => api.delete<any>(`/agents/${agentId}/tools/${toolId}`)
};
