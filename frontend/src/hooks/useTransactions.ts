import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Transaction, GamePurchaseRequest, ProductPurchaseRequest } from '../types';
import toast from 'react-hot-toast';

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiService.getTransactions(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useMemberTransactions = (memberId: string) => {
  return useQuery({
    queryKey: ['transactions', 'member', memberId],
    queryFn: () => apiService.getTransactionsByMember(memberId),
    enabled: !!memberId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transaction: Omit<Transaction, 'id'>) => apiService.createTransaction(transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create transaction');
    },
  });
};

export const usePurchaseGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (purchase: GamePurchaseRequest) => apiService.purchaseGame(purchase),
    onSuccess: (_, { memberId }) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'member', memberId] });
      queryClient.invalidateQueries({ queryKey: ['members', memberId] });
      toast.success('Game purchased successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to purchase game');
    },
  });
};

export const usePurchaseProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (purchase: ProductPurchaseRequest) => apiService.purchaseProduct(purchase),
    onSuccess: (_, { memberId }) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'member', memberId] });
      queryClient.invalidateQueries({ queryKey: ['members', memberId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product purchased successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to purchase product');
    },
  });
};
