import { Buffer } from 'buffer';
import { EventEmitter } from 'events';

// Polyfills for WebTorrent browser compatibility
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = window;
  (window as any).EventEmitter = EventEmitter;
  
  if (!(window as any).process) {
    (window as any).process = { 
      env: {}, 
      nextTick: (fn: (...args: any[]) => void, ...args: any[]) => setTimeout(() => fn(...args), 0)
    };
  }
}

export {};
