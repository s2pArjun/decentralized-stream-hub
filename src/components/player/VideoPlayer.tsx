import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useWebTorrent } from '@/hooks/useWebTorrent';
import { getIPFSUrl } from '@/lib/ipfs';
import { MediaItem } from '@/lib/types';
import { StreamStats } from './StreamStats';
import { PlayerSkeleton } from '../common/LoadingSkeleton';
import { AlertCircle, Users } from 'lucide-react';

interface VideoPlayerProps {
  item: MediaItem;
}

export const VideoPlayer = ({ item }: VideoPlayerProps) => {
  const { videoURL, loading, error, stats } = useWebTorrent(item.magnetURI);
  const [source, setSource] = useState<'webtorrent' | 'ipfs' | 'http' | null>(null);
  const [finalURL, setFinalURL] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(true);
  const [ipfsFallback, setIpfsFallback] = useState(false);
  const [ipfsError, setIpfsError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log('🎬 VideoPlayer:', item.title);
    console.log('📎 Magnet:', item.magnetURI?.substring(0, 80) + '...');
    
    if (videoURL) {
      console.log('✅ WebTorrent stream ready');
      setSource('webtorrent');
      setFinalURL(videoURL);
      return;
    }

    // Fallback to IPFS after 15 seconds or on error
    if ((!loading && !videoURL) || error) {
      const timeout = setTimeout(() => {
        console.log('⏱️ WebTorrent timeout, falling back to IPFS');
        const ipfsURL = getIPFSUrl(item.ipfsCID);
        console.log('🌐 IPFS URL:', ipfsURL);
        setSource('ipfs');
        setFinalURL(ipfsURL);
        setIpfsFallback(true);
      }, error ? 0 : 15000);

      return () => clearTimeout(timeout);
    }
  }, [videoURL, loading, error, item.ipfsCID, item.title, item.magnetURI]);

  // Handle IPFS failure - fallback to direct HTTP URL
  const handleVideoError = () => {
    if (source === 'ipfs' && item.fallbackURL && !ipfsError) {
      console.log('IPFS failed, falling back to HTTP:', item.fallbackURL);
      setIpfsError(true);
      setSource('http');
      setFinalURL(item.fallbackURL);
    }
  };

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
        onError={handleVideoError}
      />

      {/* Stats overlay */}
      {showStats && <StreamStats stats={stats} source={source} />}

      {/* BOTTOM PEER COUNT - Always visible */}
      <div className="absolute bottom-20 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className={`px-4 py-2 rounded-full text-sm font-medium backdrop-blur-xl ${
          source === 'webtorrent' 
            ? 'bg-status-success/20 text-status-success border border-status-success/30' 
            : source === 'http'
            ? 'bg-primary/20 text-primary border border-primary/30'
            : 'bg-status-warning/20 text-status-warning border border-status-warning/30'
        }`}>
          {source === 'webtorrent' ? '⚡ P2P Stream' : source === 'http' ? '📡 Direct' : '🌐 IPFS'}
        </div>
        
        <div className="px-4 py-2 rounded-full bg-background/50 backdrop-blur-xl text-foreground text-sm font-medium flex items-center gap-2 border border-border/30">
          <Users className="w-4 h-4" />
          <span>{stats.peers} {stats.peers === 1 ? 'Peer' : 'Peers'}</span>
        </div>
      </div>
    </motion.div>
  );
};
