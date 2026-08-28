import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalsService } from '../services/approvals';

export function useApprovals() {
  return useQuery({ queryKey: ['approvals'], queryFn: approvalsService.listApprovals });
}

export function useApproveAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approvalsService.approveAction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['approvals'] })
  });
}

export function useRejectAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string, reason?: string }) => approvalsService.rejectAction(id, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['approvals'] })
  });
}
