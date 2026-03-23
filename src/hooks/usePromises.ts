import { useEffect, useRef } from 'react';
import { usePromiseStore } from '../store/usePromiseStore';
import { PromiseFilters } from '../types';

export const usePromises = (filters?: PromiseFilters) => {
  const { promises, sections, isLoading, error, loadPromises } = usePromiseStore();
  const filtersKey = JSON.stringify(filters ?? {});
  const prevKey = useRef<string | null>(null);

  useEffect(() => {
    if (prevKey.current !== filtersKey) {
      prevKey.current = filtersKey;
      loadPromises(filters);
    }
  });

  return { promises, sections, isLoading, error, refresh: () => loadPromises(filters) };
};
