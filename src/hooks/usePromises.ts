import { useEffect } from 'react';
import { usePromiseStore } from '../store/usePromiseStore';
import { PromiseFilters } from '../types';

export const usePromises = (filters?: PromiseFilters) => {
  const { promises, sections, isLoading, error, loadPromises } = usePromiseStore();

  // loadPromises is a stable Zustand action; serialise filters to detect changes
  useEffect(() => {
    loadPromises(filters);
  }, [JSON.stringify(filters)]);

  return { promises, sections, isLoading, error, refresh: () => loadPromises(filters) };
};
