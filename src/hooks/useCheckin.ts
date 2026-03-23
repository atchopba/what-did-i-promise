import { useCallback, useEffect, useState } from 'react';
import { DailyCheckin } from '../types';
import { buildDailyCheckin, completeCheckin } from '../services/CheckinService';

export const useCheckin = () => {
  const [checkin, setCheckin] = useState<DailyCheckin | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await buildDailyCheckin();
      setCheckin(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const finish = useCallback(async () => {
    await completeCheckin();
    await load();
  }, [load]);

  useEffect(() => { load(); }, [load]);

  return { checkin, isLoading, refresh: load, finish };
};
