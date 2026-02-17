const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Các loại MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Xử lý đường dẫn
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './jmiiwedding.com/dathaaaaa/index.html';
  }

  // Lấy phần mở rộng của file
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // Đọc file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File không tồn tại
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - Không tìm thấy trang</h1>', 'utf-8');
      } else {
        // Lỗi server
        res.writeHead(500);
        res.end('Lỗi server: ' + error.code + ' ..\n');
      }
    } else {
      // Thành công
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🎉 Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📄 Mở trình duyệt và truy cập: http://localhost:${PORT}\n`);
  console.log('Nhấn Ctrl+C để dừng server\n');
});
