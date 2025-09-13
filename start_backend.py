#!/usr/bin/env python3
"""
Backend startup script for Vajra
"""
import os
import sys

# Add the backend directory to the path
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_dir)

# Change to backend directory
os.chdir(backend_dir)

# Import and run the app
from app import app

if __name__ == '__main__':
    print("🚨 Starting Vajra Backend Server...")
    print("📍 Server will be available at: http://localhost:5000")
    print("📊 API endpoints available at: http://localhost:5000/api/")
    print("❤️  Health check at: http://localhost:5000/health")
    print("\n🔥 Press Ctrl+C to stop the server\n")
    
    try:
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n\n👋 Backend server stopped. Stay safe!")
