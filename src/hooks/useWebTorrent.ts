import { useState, useEffect, useCallback } from 'react';
import { StreamStats } from '@/lib/types';
import { getIPFSUrl } from '@/lib/ipfs';

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
        const { getWebTorrentClient } = await import('@/lib/webtorrent');
        const client = await getWebTorrentClient();

        if (cancelled) return;

        // Check if torrent already exists
        const existingTorrent = client.torrents?.find((t: any) => t.magnetURI === magnetURI);
        if (existingTorrent) {
          torrentRef = existingTorrent;
        } else {
          torrentRef = client.add(magnetURI);
        }

        torrentRef.on('error', (err: Error) => {
          if (cancelled) return;
          console.error('Torrent error:', err);
          setError(err.message);
          setLoading(false);
        });

        torrentRef.on('ready', () => {
          if (cancelled) return;

          const videoFile = torrentRef.files
            .filter((file: any) => file.name.match(/\.(mp4|webm|mkv|avi|mov)$/i))
            .sort((a: any, b: any) => b.length - a.length)[0];

          if (!videoFile) {
            setError('No video file found in torrent');
            setLoading(false);
            return;
          }

          videoFile.getBlobURL((err: Error | null, url: string | undefined) => {
            if (cancelled) return;
            if (err) {
              setError('Failed to create video URL');
              setLoading(false);
              return;
            }

            setVideoURL(url || null);
            setLoading(false);
          });
        });

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
        console.error('WebTorrent init error:', err);
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
