"""Isolated fixture server with single byte-range audio support, never production API."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import re
ROOT = Path(__file__).resolve().parents[3] / '.test-output/stories'
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def send_head(self):
        self.range_remaining = None
        path = Path(self.translate_path(self.path))
        header = self.headers.get('Range')
        if header and path.is_file():
            match = re.fullmatch(r'bytes=(\d+)-(\d*)', header)
            size = path.stat().st_size
            if not match:
                self.send_error(416); return None
            start = int(match[1]); end = min(int(match[2]) if match[2] else size-1, size-1)
            if start >= size or start > end:
                self.send_response(416); self.send_header('Content-Range', f'bytes */{size}'); self.end_headers(); return None
            file = path.open('rb'); file.seek(start)
            self.send_response(206); self.send_header('Content-Type', self.guess_type(str(path)))
            self.send_header('Accept-Ranges','bytes'); self.send_header('Content-Length',str(end-start+1))
            self.send_header('Content-Range',f'bytes {start}-{end}/{size}'); self.end_headers()
            self.range_remaining = end-start+1
            return file
        return super().send_head()
    def copyfile(self, source, outputfile):
        if self.range_remaining is None:
            return super().copyfile(source, outputfile)
        while self.range_remaining:
            data = source.read(min(65536,self.range_remaining))
            if not data: break
            outputfile.write(data); self.range_remaining -= len(data)
ThreadingHTTPServer(('127.0.0.1',4324), Handler).serve_forever()
