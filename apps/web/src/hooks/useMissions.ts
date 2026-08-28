import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { missionsService } from '../services/missions';

export function useMissions() {
  return useQuery({ queryKey: ['missions'], queryFn: missionsService.listMissions });
}

export function useMission(id: string) {
  return useQuery({ queryKey: ['missions', id], queryFn: () => missionsService.getMission(id), enabled: !!id });
}

export function useCreateMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: missionsService.createMission,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['missions'] })
  });
}

export function useStartMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => missionsService.startMission(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['missions'] })
  });
}

export function usePauseMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => missionsService.pauseMission(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['missions'] })
  });
}

export function useResumeMission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => missionsService.resumeMission(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['missions'] })
  });
}
