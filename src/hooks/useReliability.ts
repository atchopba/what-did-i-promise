import { useCallback, useEffect, useState } from 'react';
import { ReliabilityScore } from '../types';
import { computeReliabilityScore } from '../services/ReliabilityService';

export const useReliability = () => {
  const [score, setScore] = useState<ReliabilityScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await computeReliabilityScore();
      setScore(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { score, isLoading, refresh: load };
};
