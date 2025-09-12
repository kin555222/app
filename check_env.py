import os
import sys
sys.path.insert(0, 'backend')
from dotenv import load_dotenv

print("Loading .env file...")
load_dotenv('backend/.env')

print(f"JWT_SECRET_KEY from env: {os.getenv('JWT_SECRET_KEY')}")
print(f"FLASK_ENV: {os.getenv('FLASK_ENV')}")

# Check if the app loads it correctly
from backend.app import app
with app.app_context():
    print(f"App JWT_SECRET_KEY config: {app.config.get('JWT_SECRET_KEY')}")
