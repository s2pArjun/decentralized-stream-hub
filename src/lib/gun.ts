import Gun from 'gun';
import { MediaItem } from './types';



const getRelayURL = () => {
  const hostname = window.location.hostname;
  
  // If accessing via network IP, use that IP for relay too
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:8765/gun`;
  }
  
  // Otherwise use localhost
  return 'http://localhost:8765/gun';
}


// Default relay peers (fallback if env var not set)
const DEFAULT_RELAY_PEERS = [
  getRelayURL(),
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

// Connection monitoring for debugging
gun.on('hi', (peer: any) => {
  console.log('✅ Gun.js connected to peer:', peer?.url || peer);
});

gun.on('bye', (peer: any) => {
  console.log('❌ Gun.js disconnected from peer:', peer?.url || peer);
});

// Catalog namespace (v2 for fresh start - avoids old corrupted data)
const CATALOG_KEY: string = import.meta.env.VITE_GUN_NAMESPACE || 'p2p-media-catalog-v2';
export const catalogRef = gun.get(CATALOG_KEY as any);
console.log('🗂️ Using catalog key:', CATALOG_KEY);

// Clear all Gun.js localStorage for fresh start
export const clearGunStorage = () => {
  Object.keys(localStorage)
    .filter(key => key.startsWith('gun/'))
    .forEach(key => localStorage.removeItem(key));
  console.log('🧹 Cleared Gun.js storage');
};

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

// Sample content - Blender Foundation open movies with reliable HTTP fallbacks
export const getSampleContent = (): MediaItem[] => [
  {
    id: 'sample_sintel',
    title: 'Sintel (Blender Open Movie)',
    description: 'A fantasy short film about a girl named Sintel searching for her pet dragon.',
    magnetURI: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337',
    ipfsCID: 'QmQc6vqZAnpUfTy7FW9zqXd9RCqLdCU7GqQN1GE5LqAqBb',
    fallbackURL: 'https://download.blender.org/demo/movies/Sintel.2010.720p.mkv',
    type: 'video',
    thumbnailURL: 'https://durian.blender.org/wp-content/uploads/2010/06/sintel-dragon-1920.jpg',
    category: 'Animation',
    addedAt: Date.now(),
    addedBy: 'system',
  },
  {
    id: 'sample_bigbuckbunny',
    title: 'Big Buck Bunny (Blender Open Movie)',
    description: 'A comedy short film about a giant rabbit who takes revenge on three bullies.',
    magnetURI: 'magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c&dn=Big+Buck+Bunny&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337',
    ipfsCID: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    fallbackURL: 'https://download.blender.org/demo/movies/BBB/bbb_sunflower_1080p_30fps_normal.mp4',
    type: 'video',
    thumbnailURL: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg',
    category: 'Animation',
    addedAt: Date.now() - 1000,
    addedBy: 'system',
  },
  {
    id: 'sample_tearsofsteel',
    title: 'Tears of Steel (Blender Open Movie)',
    description: 'A sci-fi short film featuring warriors and scientists in a futuristic setting.',
    magnetURI: 'magnet:?xt=urn:btih:209c8226b299b308beaf2b9cd3fb49212dbd13ec&dn=Tears+Of+Steel&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337',
    ipfsCID: 'QmQcX3rZLVgvuKDe8hRMZn3SJGFXw9LwY3tDsv4hRQqGpH',
    fallbackURL: 'https://download.blender.org/demo/movies/ToS/tears_of_steel_720p.mov',
    type: 'video',
    thumbnailURL: 'https://mango.blender.org/wp-content/uploads/2012/09/01_intro_03.jpg',
    category: 'Sci-Fi',
    addedAt: Date.now() - 2000,
    addedBy: 'system',
  },
];

export const addSampleContent = async (): Promise<void> => {
  const samples = getSampleContent();
  for (const item of samples) {
    try {
      await addToCatalog(item);
      console.log(`Added sample: ${item.title}`);
    } catch (error) {
      console.error(`Failed to add ${item.title}:`, error);
    }
  }
};
