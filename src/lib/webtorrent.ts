// Simplified WebTorrent client for browser
// WebTorrent requires special handling in browser environments

const TRACKERS = [
  'wss://tracker.btorrent.xyz',
  'wss://tracker.openwebtorrent.com',
  'wss://tracker.webtorrent.dev',
];

let client: any = null;

export const getWebTorrentClient = async () => {
  if (!client) {
    try {
      // Dynamic import to avoid SSR issues
      const WebTorrent = (await import('webtorrent')).default;
      client = new WebTorrent({
        tracker: {
          announce: TRACKERS,
        },
      });

      client.on('error', (err: Error) => {
        console.error('WebTorrent error:', err);
      });
    } catch (error) {
      console.error('Failed to initialize WebTorrent:', error);
      throw error;
    }
  }

  return client;
};

export const destroyClient = () => {
  if (client) {
    client.destroy();
    client = null;
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', destroyClient);
}
