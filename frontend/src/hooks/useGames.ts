import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Game } from '../types';
import toast from 'react-hot-toast';

export const useGames = () => {
  return useQuery({
    queryKey: ['games'],
    queryFn: () => apiService.getGames(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGame = (id: string) => {
  return useQuery({
    queryKey: ['games', id],
    queryFn: () => apiService.getGame(id),
    enabled: !!id,
  });
};

export const useCreateGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (game: Omit<Game, 'id'>) => apiService.createGame(game),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      toast.success('Game created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create game');
    },
  });
};

export const useUpdateGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, game }: { id: string; game: Partial<Game> }) => 
      apiService.updateGame(id, game),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['games', id] });
      toast.success('Game updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update game');
    },
  });
};

export const useDeleteGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteGame(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      toast.success('Game deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete game');
    },
  });
};
