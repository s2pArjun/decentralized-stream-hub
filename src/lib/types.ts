export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  magnetURI: string;
  ipfsCID: string;
  type: 'video' | 'audio';
  thumbnailURL?: string;
  duration?: number;
  addedAt: number;
  addedBy?: string;
  deleted?: boolean;
  deletedAt?: number;
  tags?: string[];
  category?: string;
    /** Optional fallback HTTP streaming URL */
  fallbackURL?: string;   // ← ADD THIS
  
}

export interface StreamStats {
  peers: number;
  downloadSpeed: number;
  uploadSpeed: number;
  progress: number;
  timeRemaining: number;
}

export interface ConnectionStatus {
  gunConnected: boolean;
  gunPeers: number;
  webrtcAvailable: boolean;
}
