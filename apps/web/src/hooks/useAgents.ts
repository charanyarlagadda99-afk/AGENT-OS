import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agentsService } from '../services/agents';

export function useAgents() {
  return useQuery({ queryKey: ['agents'], queryFn: agentsService.listAgents });
}

export function useAgent(id: string) {
  return useQuery({ queryKey: ['agents', id], queryFn: () => agentsService.getAgent(id), enabled: !!id });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: agentsService.createAgent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agents'] })
  });
}
