import { useQuery } from '@tanstack/react-query';
import { fetchIndexes, fetchIndexById } from '../api/indexes.api';

export const indexesKeys = {
  all: ['indexes'] as const,
  detail: (id: string) => ['indexes', id] as const,
};

export function useGetIndexes() {
  return useQuery({
    queryKey: indexesKeys.all,
    queryFn: fetchIndexes,
  });
}

export function useGetIndexById(id: string) {
  return useQuery({
    queryKey: indexesKeys.detail(id),
    queryFn: () => fetchIndexById(id),
    enabled: Boolean(id),
  });
}
