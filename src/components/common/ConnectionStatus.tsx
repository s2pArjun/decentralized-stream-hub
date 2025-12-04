import { Wifi, WifiOff, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConnectionStatusProps {
  connected: boolean;
  peerCount?: number;
}

export const ConnectionStatus = ({ connected, peerCount = 0 }: ConnectionStatusProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm"
    >
      {connected ? (
        <>
          <div className="relative">
            <Wifi className="w-4 h-4 text-status-success" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-status-success rounded-full animate-pulse" />
          </div>
          <span className="text-status-success font-medium">P2P Network</span>
          {peerCount > 0 && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-3 h-3" />
              {peerCount}
            </span>
          )}
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-status-warning" />
          <span className="text-status-warning font-medium">Connecting...</span>
        </>
      )}
    </motion.div>
  );
};
