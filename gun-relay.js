import Gun from 'gun';
import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Gun relay server is running!\n');
});

const gun = Gun({
  web: server,
  file: 'radata',
  peers: []
});

const PORT = process.env.PORT || 8765;
server.listen(PORT, () => {
  console.log('🔫 Gun.js relay server running on http://localhost:' + PORT + '/gun');
});
