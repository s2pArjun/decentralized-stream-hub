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

    setLoading(true);
    setError(null);
    let cancelled = false;
    let torrentRef: any = null;
    let statsInterval: NodeJS.Timeout | null = null;

    const initTorrent = async () => {
      try {
        console.log('🔧 Initializing WebTorrent client...');
        
        // Import with error handling
        const { getWebTorrentClient } = await import('@/lib/webtorrent').catch(err => {
          console.error('Failed to import WebTorrent module:', err);
          throw new Error('WebTorrent module failed to load');
        });
        
        const client = await getWebTorrentClient().catch(err => {
          console.error('Failed to get WebTorrent client:', err);
          throw new Error('WebTorrent client initialization failed');
        });
        
        console.log('✅ WebTorrent client ready');

        if (cancelled) return;

        // Check if torrent already exists
        const existingTorrent = client.torrents?.find((t: any) => t.magnetURI === magnetURI);
        if (existingTorrent) {
          console.log('♻️ Reusing existing torrent');
          torrentRef = existingTorrent;
        } else {
          console.log('➕ Adding new torrent:', magnetURI?.substring(0, 60) + '...');
          torrentRef = client.add(magnetURI);
        }

        torrentRef.on('error', (err: Error) => {
          if (cancelled) return;
          console.error('❌ Torrent error:', err);
          setError(err.message);
          setLoading(false);
        });

        torrentRef.on('infoHash', () => {
          console.log('🔑 Got infoHash:', torrentRef.infoHash);
        });

        torrentRef.on('metadata', () => {
          console.log('📋 Got metadata, files:', torrentRef.files?.length);
        });

        torrentRef.on('wire', () => {
          console.log('👥 Peer connected! Total peers:', torrentRef.numPeers);
        });

        torrentRef.on('ready', () => {
          if (cancelled) return;
          console.log('✅ Torrent ready! Peers:', torrentRef.numPeers);

          const videoFile = torrentRef.files
            .filter((file: any) => file.name.match(/\.(mp4|webm|mkv|avi|mov)$/i))
            .sort((a: any, b: any) => b.length - a.length)[0];

          if (!videoFile) {
            console.error('❌ No video file found in torrent');
            setError('No video file found in torrent');
            setLoading(false);
            return;
          }

          console.log('🎥 Video file found:', videoFile.name, '(' + Math.round(videoFile.length / 1024 / 1024) + 'MB)');

          videoFile.getBlobURL((err: Error | null, url: string | undefined) => {
            if (cancelled) return;
            if (err) {
              console.error('❌ Failed to create blob URL:', err);
              setError('Failed to create video URL');
              setLoading(false);
              return;
            }

            console.log('🎉 Blob URL created successfully');
            setVideoURL(url || null);
            setLoading(false);
          });
        });

        // Stats update interval
        statsInterval = setInterval(() => {
          if (!torrentRef || cancelled) return;

          setStats({
            peers: torrentRef.numPeers || 0,
            downloadSpeed: torrentRef.downloadSpeed || 0,
            uploadSpeed: torrentRef.uploadSpeed || 0,
            progress: torrentRef.progress || 0,
            timeRemaining: torrentRef.timeRemaining || Infinity,
          });
        }, 1000);

      } catch (err) {
        if (cancelled) return;
        console.error('❌ WebTorrent init error:', err);
        setError(err instanceof Error ? err.message : 'Failed to start streaming');
        setLoading(false);
      }
    };

    initTorrent();

    return () => {
      cancelled = true;
      if (statsInterval) {
        clearInterval(statsInterval);
      }
    };
  }, [magnetURI]);

  return { videoURL, loading, error, stats };
};