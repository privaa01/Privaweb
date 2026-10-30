"""Serve the actual approved demo build for navigation verification, not fixtures."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from shutil import copytree, rmtree
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / '.test-output' / 'navigation-demo-build'
rmtree(OUTPUT, ignore_errors=True)
copytree(ROOT / '.demo-dist', OUTPUT)
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(OUTPUT), **kwargs)
    def copyfile(self, source, outputfile):
        # Navigation may cancel pending public audio/image transfers.
        try:
            super().copyfile(source, outputfile)
        except (BrokenPipeError, ConnectionResetError):
            pass
    def log_message(self, *_args):
        pass
ThreadingHTTPServer(('127.0.0.1', 4340), Handler).serve_forever()
