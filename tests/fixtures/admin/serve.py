from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlsplit
class Handler(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
    def do_GET(self):
        path=urlsplit(self.path).path
        if path.startswith('/admin/_astro/'):
            self.path=path[len('/admin'):]
        elif path in ['/admin','/admin/login','/admin/historias','/admin/contacto','/admin/recuperar','/admin/restablecer']:
            self.path='/'+('panel' if path=='/admin' else path.rsplit('/',1)[1])+'.html'
        super().do_GET()
    def __init__(self,*args,**kwargs):super().__init__(*args,directory='.test-output/admin',**kwargs)
HTTPServer(('127.0.0.1',4328),Handler).serve_forever()
