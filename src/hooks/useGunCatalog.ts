import { useState, useEffect, useCallback } from 'react';
import { subscribeToCatalog, addToCatalog, removeFromCatalog } from '@/lib/gun';
import { MediaItem } from '@/lib/types';

export const useGunCatalog = () => {
  const [catalog, setCatalog] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = subscribeToCatalog((items) => {
      if (!mounted) return;

      const sortedItems = items.sort((a, b) =>
        (b.addedAt || 0) - (a.addedAt || 0)
      );

      setCatalog(sortedItems);
      setLoading(false);
      setConnected(true);
    });

    // Set loading to false after timeout if no data
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        setLoading(false);
      }
    }, 5000);

    return () => {
      mounted = false;
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleAddContent = useCallback(async (item: MediaItem) => {
    try {
      await addToCatalog(item);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add content';
      setError(message);
      throw err;
    }
  }, []);

  const handleRemoveContent = useCallback(async (id: string) => {
    try {
      await removeFromCatalog(id);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove content';
      setError(message);
      throw err;
    }
  }, []);

  const getItemById = useCallback((id: string) => {
    return catalog.find(item => item.id === id);
  }, [catalog]);

  return {
    catalog,
    loading,
    connected,
    error,
    addContent: handleAddContent,
    removeContent: handleRemoveContent,
    getItemById,
  };
};
