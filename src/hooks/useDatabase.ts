import { useEffect, useState } from 'react';
import { initDatabase } from '../db/database';

export const useDatabase = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initDatabase()
      .then(() => setIsReady(true))
      .catch((e) => setError(e.message ?? 'Database initialization failed'));
  }, []);

  return { isReady, error };
};
