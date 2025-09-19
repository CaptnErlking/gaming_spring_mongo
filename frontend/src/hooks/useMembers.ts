import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Member } from '../types';
import toast from 'react-hot-toast';

export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: () => apiService.getMembers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMember = (id: string) => {
  return useQuery({
    queryKey: ['members', id],
    queryFn: () => apiService.getMember(id),
    enabled: !!id,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (member: Omit<Member, 'id'>) => apiService.createMember(member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create member');
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, member }: { id: string; member: Partial<Member> }) => 
      apiService.updateMember(id, member),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members', id] });
      toast.success('Member updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update member');
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete member');
    },
  });
};
