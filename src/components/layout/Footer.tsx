import { Zap, Github, Globe } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm">
              StreamPeer — Decentralized P2P Media Platform
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              Powered by WebTorrent & Gun.js
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
