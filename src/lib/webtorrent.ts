// // WebTorrent client for browser - Fixed for Vercel production builds
// import WebTorrent from 'webtorrent';

// const TRACKERS = [
//   'wss://tracker.btorrent.xyz',
//   'wss://tracker.openwebtorrent.com',
//   'wss://tracker.webtorrent.dev',
//   'wss://tracker.fastcast.nz',
//   'wss://tracker.files.fm:7073/announce',
//   'wss://tracker.openwebtorrent.com:443/announce',
// ];

// let client: WebTorrent.Instance | null = null;

// export const getWebTorrentClient = async (): Promise<WebTorrent.Instance> => {
//   if (!client) {
//     try {
//       console.log('🔧 Initializing WebTorrent client...');
      
//       client = new WebTorrent({
//         tracker: {
//           announce: TRACKERS,
//         },
//       });

//       client.on('error', (err: Error) => {
//         console.error('❌ WebTorrent client error:', err);
//       });

//       console.log('✅ WebTorrent client initialized');
//     } catch (error) {
//       console.error('❌ Failed to initialize WebTorrent:', error);
//       throw error;
//     }
//   }

//   return client;
// };

// export const destroyClient = () => {
//   if (client) {
//     try {
//       client.destroy();
//       client = null;
//       console.log('🧹 WebTorrent client destroyed');
//     } catch (err) {
//       console.error('Error destroying client:', err);
//     }
//   }
// };

// if (typeof window !== 'undefined') {
//   window.addEventListener('beforeunload', destroyClient);
// }

// Stubbed WebTorrent for Vercel compatibility
// Real WebTorrent doesn't work in serverless environments

export const getWebTorrentClient = async (): Promise<any> => {
  console.warn('⚠️ WebTorrent is disabled in production');
  throw new Error('WebTorrent not available in this environment');
};

export const destroyClient = () => {
  // No-op
};
