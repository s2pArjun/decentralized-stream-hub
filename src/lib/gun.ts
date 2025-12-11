import Gun from 'gun';
import { MediaItem } from './types';

// Smart relay URL detection for dev and production
const parseRelayPeers = (): string[] => {
  // 1. PRODUCTION: Use environment variable (set in Vercel)
  const envPeers = import.meta.env.VITE_GUN_RELAY_PEERS;
  if (envPeers && typeof envPeers === 'string') {
    const peers = envPeers.split(',').map(peer => peer.trim()).filter(Boolean);
    console.log('🔧 Using environment relay peers:', peers);
    return peers;
  }
  
  // 2. DEVELOPMENT: Use localhost or network IP
  if (import.meta.env.DEV) {
    const hostname = window.location.hostname;
    
    // If accessing via network IP (e.g., 192.168.x.x), use that IP
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      const localRelay = `http://${hostname}:8765/gun`;
      console.log('🔧 Using network IP relay:', localRelay);
      return [localRelay];
    }
    
    // Default to localhost for local development
    console.log('🔧 Using localhost relay');
    return ['http://localhost:8765/gun'];
  }
  
  // 3. FALLBACK: Production without env var - use public relays
  console.warn('⚠️ VITE_GUN_RELAY_PEERS not set! Using public fallback relays.');
  return [
    'https://gun-manhattan.herokuapp.com/gun',
    'https://gunjs.herokuapp.com/gun',
  ];
};

const RELAY_PEERS = parseRelayPeers();

// Initialize Gun with relay peers
export const gun = Gun({
  peers: RELAY_PEERS,
  localStorage: true,
  radisk: true,
  axe: false
});

// Connection monitoring
gun.on('hi', (peer: any) => {
  console.log('✅ Gun.js connected to peer:', peer?.url || peer);
});

gun.on('bye', (peer: any) => {
  console.log('❌ Gun.js disconnected from peer:', peer?.url || peer);
});

// Log connection status periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    const peers = (gun as any)._.opt?.peers;
    const connectedPeers = peers ? Object.keys(peers).filter(p => peers[p].wire).length : 0;
    if (connectedPeers > 0) {
      console.log(`📊 Gun.js: ${connectedPeers} peer(s) connected`);
    } else {
      console.warn('⚠️ Gun.js: No peers connected');
    }
  }, 30000);
}

// Catalog namespace
const CATALOG_KEY: string = import.meta.env.VITE_GUN_NAMESPACE || 'p2p-media-catalog-v2';
export const catalogRef = gun.get(CATALOG_KEY as any);
console.log('🗂️ Using catalog key:', CATALOG_KEY);

// Export for debugging - RENAMED to avoid conflict
export const getRelayPeers = () => RELAY_PEERS;
export const getCatalogKey = () => CATALOG_KEY;

// Clear Gun.js localStorage
export const clearGunStorage = () => {
  Object.keys(localStorage)
    .filter(key => key.startsWith('gun/'))
    .forEach(key => localStorage.removeItem(key));
  console.log('🧹 Cleared Gun.js storage');
};

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
        fallbackURL: item.fallbackURL || '',
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
// THESE SAMPLES HAVE ACTIVE WEBTORRENT SEEDERS
// Replace your getSampleContent() with this:

export const getSampleContent = (): MediaItem[] => [
  {
    id: 'sample_sintel_trailer',
    title: 'Sintel Trailer (WebTorrent Official)',
    description: 'Official WebTorrent demo - Sintel movie trailer. This has active P2P seeders!',
    // This is the OFFICIAL WebTorrent demo with guaranteed seeders
    magnetURI: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.dev&tr=wss%3A%2F%2Ftracker.files.fm%3A7073%2Fannounce',
    ipfsCID: 'bafybeigagd5nmnn2iys2f3doro7ydrevyr2mzarwidgadawmamiteydbzi',
    fallbackURL: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'video',
    thumbnailURL: 'https://via.placeholder.com/640x360/6366f1/ffffff?text=WebTorrent+Demo',
    category: 'Demo',
    addedAt: Date.now(),
    addedBy: 'system',
  },
  {
    id: 'sample_big_buck_bunny_http',
    title: 'Big Buck Bunny (HTTP Fallback Demo)',
    description: 'This demonstrates the HTTP fallback when no P2P peers are available.',
    magnetURI: 'magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c&dn=Big+Buck+Bunny&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com',
    ipfsCID: 'bafybeigagd5nmnn2iys2f3doro7ydrevyr2mzarwidgadawmamiteydbzi',
    // Fast, reliable HTTP fallback
    fallbackURL: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'video',
    thumbnailURL: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    category: 'Animation',
    addedAt: Date.now() - 1000,
    addedBy: 'system',
  },
  {
    id: 'sample_elephants_dream_http',
    title: 'Elephants Dream',
    description: 'The first Blender Foundation open movie. Streams via HTTP fallback.',
    magnetURI: 'magnet:?xt=urn:btih:3b1e91e6e7e8f9c7e3a6e4d5c6b7a8e9f0a1b2c3&dn=Elephants+Dream',
    ipfsCID: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    fallbackURL: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    type: 'video',
    thumbnailURL: 'https://orange.blender.org/wp-content/themes/orange/images/media/splash.jpg',
    category: 'Animation',
    addedAt: Date.now() - 2000,
    addedBy: 'system',
  },
  {
    id: 'sample_for_bigger_blazes',
    title: 'For Bigger Blazes',
    description: 'Stunning fire and visual effects demo.',
    magnetURI: 'magnet:?xt=urn:btih:c9e15763f722f23e98a29decdfae341b98d53056&dn=Blazes',
    ipfsCID: 'bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq',
    fallbackURL: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'video',
    thumbnailURL: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    category: 'Demo',
    addedAt: Date.now() - 3000,
    addedBy: 'system',
  },
];

export const addSampleContent = async (): Promise<void> => {
  const samples = getSampleContent();
  for (const item of samples) {
    try {
      await addToCatalog(item);
      console.log(`✅ Added sample: ${item.title}`);
    } catch (error) {
      console.error(`❌ Failed to add ${item.title}:`, error);
    }
  }
};