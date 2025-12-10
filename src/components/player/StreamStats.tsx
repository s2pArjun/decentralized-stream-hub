import { StreamStats as Stats } from '@/lib/types';
import { Users, Download, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreamStatsProps {
  stats: Stats;
  source: 'webtorrent' | 'ipfs' | 'http' | null;
}

export const StreamStats = ({ stats, source }: StreamStatsProps) => {
  const formatSpeed = (bytes: number) => {
    if (bytes === 0) return '0 B/s';
    const mb = bytes / 1024 / 1024;
    if (mb >= 1) return `${mb.toFixed(1)} MB/s`;
    const kb = bytes / 1024;
    return `${kb.toFixed(0)} KB/s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-4 right-4 glass rounded-lg p-4 text-sm min-w-[200px] z-50"
    >
      {/* HEADER - Always visible */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <div className={`w-3 h-3 rounded-full ${source === 'webtorrent' ? 'bg-status-success animate-pulse' : 'bg-status-warning'}`} />
        <span className="font-semibold">
          {source === 'webtorrent' ? '⚡ P2P Active' : source === 'http' ? '📡 HTTP' : '🌐 IPFS'}
        </span>
      </div>

      {/* PEER COUNT - Always visible, highlighted */}
      <div className="mb-3 p-2 rounded-lg bg-primary/10 border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-semibold">Peers</span>
          </div>
          <span className="text-2xl font-bold text-primary">{stats.peers}</span>
        </div>
        {stats.peers === 0 && source === 'webtorrent' && (
          <p className="text-xs text-status-warning mt-1">⚠️ No peers found - using fallback</p>
        )}
      </div>

      {source === 'webtorrent' && (
        <div className="space-y-2 text-muted-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-status-success" />
              <span>Download</span>
            </div>
            <span className="text-foreground font-medium">{formatSpeed(stats.downloadSpeed)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-secondary" />
              <span>Upload</span>
            </div>
            <span className="text-foreground font-medium">{formatSpeed(stats.uploadSpeed)}</span>
          </div>

          <div className="pt-2 mt-2 border-t border-border">
            <div className="flex items-center justify-between mb-1">
              <span>Progress</span>
              <span className="text-foreground font-medium">
                {(stats.progress * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.progress * 100}%` }}
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              />
            </div>
          </div>
        </div>
      )}

      {source === 'ipfs' && (
        <div className="text-xs text-muted-foreground">
          <p>⚠️ WebTorrent timeout - using IPFS gateway</p>
          <p className="mt-1">Try seeding this file to help others!</p>
        </div>
      )}

      {source === 'http' && (
        <div className="text-xs text-muted-foreground">
          <p>📡 Streaming via direct HTTP</p>
          <p className="mt-1">IPFS unavailable - using fallback URL</p>
        </div>
      )}
    </motion.div>
  );
};
