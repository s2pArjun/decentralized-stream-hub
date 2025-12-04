import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useWebTorrent } from '@/hooks/useWebTorrent';
import { getIPFSUrl } from '@/lib/ipfs';
import { MediaItem } from '@/lib/types';
import { StreamStats } from './StreamStats';
import { PlayerSkeleton } from '../common/LoadingSkeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface VideoPlayerProps {
  item: MediaItem;
}

export const VideoPlayer = ({ item }: VideoPlayerProps) => {
  const { videoURL, loading, error, stats } = useWebTorrent(item.magnetURI);
  const [source, setSource] = useState<'webtorrent' | 'ipfs' | null>(null);
  const [finalURL, setFinalURL] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(true);
  const [ipfsFallback, setIpfsFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoURL) {
      setSource('webtorrent');
      setFinalURL(videoURL);
      return;
    }

    // Fallback to IPFS after 8 seconds or on error
    if ((!loading && !videoURL) || error) {
      const timeout = setTimeout(() => {
        const ipfsURL = getIPFSUrl(item.ipfsCID);
        setSource('ipfs');
        setFinalURL(ipfsURL);
        setIpfsFallback(true);
      }, error ? 0 : 8000);

      return () => clearTimeout(timeout);
    }
  }, [videoURL, loading, error, item.ipfsCID]);

  if (!finalURL && loading) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <PlayerSkeleton />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full mb-4"
          />
          <p className="text-muted-foreground">Connecting to P2P network...</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Finding peers to stream from
          </p>
        </div>
      </div>
    );
  }

  if (!finalURL && error && !ipfsFallback) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted flex items-center justify-center">
        <div className="text-center p-8">
          <AlertCircle className="w-12 h-12 text-status-error mx-auto mb-4" />
          <p className="text-foreground font-medium mb-2">Unable to start P2P stream</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">Trying IPFS fallback...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-background group"
    >
      <video
        ref={videoRef}
        src={finalURL || undefined}
        controls
        autoPlay
        className="w-full h-full object-contain"
        onPlay={() => setShowStats(false)}
        onPause={() => setShowStats(true)}
      />

      {/* Stats overlay */}
      {showStats && <StreamStats stats={stats} source={source} />}

      {/* Source indicator */}
      <div className="absolute bottom-20 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          source === 'webtorrent' 
            ? 'bg-status-success/20 text-status-success' 
            : 'bg-status-warning/20 text-status-warning'
        }`}>
          {source === 'webtorrent' ? '⚡ P2P Stream' : '🌐 IPFS Gateway'}
        </div>
      </div>
    </motion.div>
  );
};
