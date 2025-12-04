import { MediaItem } from './types';

export const validateMagnetURI = (uri: string): boolean => {
  return uri.startsWith('magnet:?xt=urn:btih:') && uri.length > 40;
};

export const validateIPFSCID = (cid: string): boolean => {
  return /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[a-z2-7]{58})$/i.test(cid);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().slice(0, 500);
};

export const validateMediaItem = (item: Partial<MediaItem>): string | null => {
  if (!item.title || item.title.length < 3) {
    return 'Title must be at least 3 characters';
  }

  if (!item.magnetURI || !validateMagnetURI(item.magnetURI)) {
    return 'Invalid magnet URI';
  }

  if (!item.ipfsCID || !validateIPFSCID(item.ipfsCID)) {
    return 'Invalid IPFS CID';
  }

  if (!item.type || !['video', 'audio'].includes(item.type)) {
    return 'Type must be video or audio';
  }

  return null;
};

export const generateId = (): string => {
  return `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
