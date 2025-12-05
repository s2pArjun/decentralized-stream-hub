import Gun from 'gun';
import { MediaItem } from './types';

// Default relay peers (fallback if env var not set)
const DEFAULT_RELAY_PEERS = [
  'https://gun-manhattan.herokuapp.com/gun',
  'https://gun-us.herokuapp.com/gun',
];

// Parse relay peers from environment variable (comma-separated)
const parseRelayPeers = (): string[] => {
  const envPeers = import.meta.env.VITE_GUN_RELAY_PEERS;
  if (envPeers && typeof envPeers === 'string') {
    return envPeers.split(',').map(peer => peer.trim()).filter(Boolean);
  }
  return DEFAULT_RELAY_PEERS;
};

const RELAY_PEERS = parseRelayPeers();

// Initialize Gun with relay peers
export const gun = Gun({
  peers: RELAY_PEERS,
  localStorage: true,
});

// Catalog namespace (can be customized via env var)
const CATALOG_KEY: string = import.meta.env.VITE_GUN_NAMESPACE || 'p2p-media-catalog-v1';
export const catalogRef = gun.get(CATALOG_KEY as any);

// Export for debugging/status display
export const getRelayPeers = () => RELAY_PEERS;
export const getCatalogKey = () => CATALOG_KEY;

export const addToCatalog = (item: MediaItem): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      if (!item.id || !item.magnetURI || !item.ipfsCID) {
        throw new Error('Missing required fields');
      }

      (catalogRef.get(item.id as any) as any).put({
        id: item.id,
        title: item.title,
        description: item.description || '',
        magnetURI: item.magnetURI,
        ipfsCID: item.ipfsCID,
        type: item.type,
        thumbnailURL: item.thumbnailURL || '',
        category: item.category || '',
        addedAt: Date.now(),
        addedBy: 'anonymous',
      }, (ack: any) => {
        if (ack.err) {
          reject(new Error(ack.err));
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const removeFromCatalog = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      (catalogRef.get(id as any) as any).put({ deleted: true, deletedAt: Date.now() }, (ack: any) => {
        if (ack.err) {
          reject(new Error(ack.err));
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const isValidMediaItem = (data: any): data is MediaItem => {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    typeof data.magnetURI === 'string' &&
    typeof data.ipfsCID === 'string' &&
    ['video', 'audio'].includes(data.type) &&
    !data.deleted
  );
};

export const subscribeToCatalog = (
  callback: (items: MediaItem[]) => void
): (() => void) => {
  const items: Record<string, MediaItem> = {};
  let unsubscribed = false;

  const handler = (catalogRef.map() as any).on((data: any, id: string) => {
    if (unsubscribed) return;

    try {
      if (!data || data.deleted) {
        delete items[id];
      } else if (isValidMediaItem(data)) {
        items[id] = { ...data, id };
      }

      callback(Object.values(items));
    } catch (error) {
      console.error('Gun.js sync error:', error);
    }
  });

  return () => {
    unsubscribed = true;
  };
};
