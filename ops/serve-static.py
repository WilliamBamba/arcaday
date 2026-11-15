#!/usr/bin/env python3
"""Private static preview: loopback only, no listings or files outside the release."""
import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

parser = argparse.ArgumentParser()
parser.add_argument('directory', type=Path)
parser.add_argument('--port', type=int, default=4173)
args = parser.parse_args()

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        # Resolve the atomic current link once per request.
        self.root = args.directory.resolve(strict=True)
        super().__init__(*a, directory=str(self.root), **kw)

    def send_head(self):
        parts = Path(unquote(urlsplit(self.path).path)).parts
        if any(p.startswith('.') for p in parts):
            self.send_error(404)
            return None
        target = Path(self.translate_path(self.path)).resolve()
        if not target.is_relative_to(self.root):
            self.send_error(404)
            return None
        return super().send_head()

    def list_directory(self, path):
        self.send_error(404)
        return None

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

ThreadingHTTPServer(('127.0.0.1', args.port), Handler).serve_forever()
