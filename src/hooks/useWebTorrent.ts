// import { useState, useEffect } from 'react';
// import { StreamStats } from '@/lib/types';

// export const useWebTorrent = (magnetURI: string | null) => {
//   const [videoURL, setVideoURL] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [stats, setStats] = useState<StreamStats>({
//     peers: 0,
//     downloadSpeed: 0,
//     uploadSpeed: 0,
//     progress: 0,
//     timeRemaining: Infinity,
//   });

//   useEffect(() => {
//     if (!magnetURI) return;

//     setLoading(true);
//     setError(null);
//     let cancelled = false;
//     let torrentRef: any = null;
//     let statsInterval: NodeJS.Timeout | null = null;
//     let timeoutId: NodeJS.Timeout | null = null;

//     const initTorrent = async () => {
//       try {
//         console.log('🔧 Attempting WebTorrent initialization...');
        
//         // Set a 5-second timeout for WebTorrent initialization
//         timeoutId = setTimeout(() => {
//           if (!cancelled && !videoURL) {
//             console.log('⏱️ WebTorrent initialization timeout - using fallback');
//             setError('WebTorrent timeout - using fallback');
//             setLoading(false);
//           }
//         }, 5000);

//         // Try to load WebTorrent
//         const { getWebTorrentClient } = await import('@/lib/webtorrent').catch((err) => {
//           console.warn('⚠️ WebTorrent import failed:', err);
//           throw new Error('WebTorrent not available');
//         });
        
//         const client = await getWebTorrentClient().catch((err) => {
//           console.warn('⚠️ WebTorrent client init failed:', err);
//           throw new Error('WebTorrent client unavailable');
//         });
        
//         if (timeoutId) clearTimeout(timeoutId);
        
//         console.log('✅ WebTorrent client ready');

//         if (cancelled) return;

//         // Check if torrent already exists
//         const existingTorrent = client.torrents?.find((t: any) => t.magnetURI === magnetURI);
//         if (existingTorrent) {
//           console.log('♻️ Reusing existing torrent');
//           torrentRef = existingTorrent;
//         } else {
//           console.log('➕ Adding new torrent');
//           torrentRef = client.add(magnetURI);
//         }

//         torrentRef.on('error', (err: Error) => {
//           if (cancelled) return;
//           console.error('❌ Torrent error:', err);
//           setError('P2P unavailable - using fallback');
//           setLoading(false);
//         });

//         torrentRef.on('ready', () => {
//           if (cancelled) return;
//           console.log('✅ Torrent ready! Peers:', torrentRef.numPeers);

//           const videoFile = torrentRef.files
//             .filter((file: any) => file.name.match(/\.(mp4|webm|mkv|avi|mov)$/i))
//             .sort((a: any, b: any) => b.length - a.length)[0];

//           if (!videoFile) {
//             console.error('❌ No video file found');
//             setError('No video in torrent - using fallback');
//             setLoading(false);
//             return;
//           }

//           videoFile.getBlobURL((err: Error | null, url: string | undefined) => {
//             if (cancelled) return;
//             if (err) {
//               console.error('❌ Blob URL failed:', err);
//               setError('P2P failed - using fallback');
//               setLoading(false);
//               return;
//             }

//             console.log('🎉 P2P streaming ready!');
//             setVideoURL(url || null);
//             setLoading(false);
//           });
//         });

//         // Stats update
//         statsInterval = setInterval(() => {
//           if (!torrentRef || cancelled) return;
//           setStats({
//             peers: torrentRef.numPeers || 0,
//             downloadSpeed: torrentRef.downloadSpeed || 0,
//             uploadSpeed: torrentRef.uploadSpeed || 0,
//             progress: torrentRef.progress || 0,
//             timeRemaining: torrentRef.timeRemaining || Infinity,
//           });
//         }, 1000);

//       } catch (err) {
//         if (cancelled) return;
//         console.warn('⚠️ WebTorrent unavailable:', err);
//         setError('P2P unavailable - using fallback');
//         setLoading(false);
//       }
//     };

//     // Start initialization
//     initTorrent();

//     // Cleanup
//     return () => {
//       cancelled = true;
//       if (timeoutId) clearTimeout(timeoutId);
//       if (statsInterval) clearInterval(statsInterval);
//     };
//   }, [magnetURI]);

//   return { videoURL, loading, error, stats };
// };

import { useState, useEffect } from 'react';
import { StreamStats } from '@/lib/types';

export const useWebTorrent = (magnetURI: string | null) => {
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StreamStats>({
    peers: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
    progress: 0,
    timeRemaining: Infinity,
  });

  useEffect(() => {
    if (!magnetURI) return;

    // In production, immediately fail and use fallback
    console.log('⚠️ WebTorrent disabled - using HTTP/IPFS fallback');
    setLoading(false);
    setError('P2P unavailable - using fallback');
  }, [magnetURI]);

  return { videoURL: null, loading: false, error, stats };
};
