import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { RechargeRequest } from '../types';
import toast from 'react-hot-toast';

export const useRecharges = () => {
  return useQuery({
    queryKey: ['recharges'],
    queryFn: () => apiService.getRecharges(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useMemberRecharges = (memberId: string) => {
  return useQuery({
    queryKey: ['recharges', 'member', memberId],
    queryFn: () => apiService.getRechargesByMember(memberId),
    enabled: !!memberId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateRecharge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recharge: RechargeRequest) => apiService.createRecharge(recharge),
    onSuccess: (_, { memberId }) => {
      queryClient.invalidateQueries({ queryKey: ['recharges'] });
      queryClient.invalidateQueries({ queryKey: ['recharges', 'member', memberId] });
      queryClient.invalidateQueries({ queryKey: ['members', memberId] });
      toast.success('Account recharged successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to recharge account');
    },
  });
};
