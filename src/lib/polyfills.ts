import { Buffer } from 'buffer';

// Polyfills for WebTorrent browser compatibility
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.Buffer = Buffer;
  // @ts-ignore
  window.global = window;
  // @ts-ignore
  if (!window.process) {
    // @ts-ignore
    window.process = { env: {}, nextTick: (fn: Function) => setTimeout(fn, 0) };
  }
}

export {};
