import os

# Server configuration
bind = "0.0.0.0:" + str(os.getenv("PORT", "5000"))
workers = int(os.getenv("WORKERS", "2"))
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 50
preload_app = True

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "disaster-prep-api"

# SSL (if needed)
# keyfile = "/path/to/key.pem"
# certfile = "/path/to/cert.pem"
