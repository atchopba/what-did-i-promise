import { useCallback, useEffect, useState } from 'react';
import { PromiseWithPerson, RiskLevel } from '../types';
import { getRiskPromises } from '../services/RiskService';

export const useRiskPromises = (minLevel: RiskLevel = RiskLevel.ATTENTION) => {
  const [promises, setPromises] = useState<PromiseWithPerson[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getRiskPromises(minLevel);
      setPromises(data);
    } finally {
      setIsLoading(false);
    }
  }, [minLevel]);

  useEffect(() => { load(); }, [load]);

  return { promises, isLoading, refresh: load };
};
