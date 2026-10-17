"""Serve generated test fixtures only; never authenticates or serves production pages."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

OUTPUT = Path(__file__).resolve().parents[3] / '.test-output' / 'navigation'

class FixtureHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(OUTPUT), **kwargs)

    def do_GET(self):
        # An explicit fixture alias; this is not an administrative service.
        if urlsplit(self.path).path == '/admin/login':
            self.path = '/admin/login.html'
        super().do_GET()

    def log_message(self, *_args):
        pass

ThreadingHTTPServer(('127.0.0.1', 4322), FixtureHandler).serve_forever()
