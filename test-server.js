const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Minimal server is running\n');
});
const PORT = 3005; // Different port
server.listen(PORT, () => {
  console.log(`Minimal server running at http://localhost:${PORT}/`);
});
