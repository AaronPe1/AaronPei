from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from threading import Timer
import webbrowser
root = Path(__file__).resolve().parent / 'dist'
for port in range(8795, 8806):
    try:
        server = ThreadingHTTPServer(('127.0.0.1', port), partial(SimpleHTTPRequestHandler, directory=str(root)))
        break
    except OSError:
        continue
else:
    raise SystemExit('No available local preview port between 8795 and 8805.')
url = f'http://127.0.0.1:{port}/'
print('AP1 original photography website: ' + url, flush=True)
print('Keep this window open while browsing. Press Ctrl+C to stop.', flush=True)
Timer(0.6, lambda: webbrowser.open(url)).start()
try:
    server.serve_forever()
except KeyboardInterrupt:
    server.server_close()
