import Gun from 'gun';
import http from 'http';

// CORS middleware
const cors = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return true;
  }
  return false;
};

const server = http.createServer((req, res) => {
  // Handle CORS
  if (cors(req, res)) return;
  
  // Health check endpoint
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      service: 'Gun.js Relay Server',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }));
    return;
  }
  
  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

// Initialize Gun with the HTTP server
const gun = Gun({
  web: server,
  file: 'radata',
  peers: [],
  radisk: true,
  localStorage: false,
  axe: false
});

// Log when peers connect/disconnect
gun.on('hi', (peer) => {
  console.log('✅ Peer connected:', peer?.url || 'anonymous');
});

gun.on('bye', (peer) => {
  console.log('❌ Peer disconnected:', peer?.url || 'anonymous');
});

const PORT = process.env.PORT || 8765;

server.listen(PORT, '0.0.0.0', () => {
  console.log('=================================');
  console.log('🔫 Gun.js Relay Server Running');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 Gun endpoint: /gun`);
  console.log(`💚 Health check: /health`);
  console.log('=================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('⚠️ SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});