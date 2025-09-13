#!/usr/bin/env python3
"""
Railway deployment script to ensure admin user exists.
This script will be run on Railway to create the admin user if it doesn't exist.
"""

import os
import sys
from werkzeug.security import generate_password_hash

# Add the backend directory to the Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

from models import User, db
from app import app

def ensure_admin_user():
    with app.app_context():
        print("Ensuring admin user exists for Railway deployment...")
        
        # Check if admin user already exists
        admin_user = User.query.filter_by(username='admin').first()
        
        if admin_user:
            print(f"Admin user already exists: {admin_user.username}")
            if not admin_user.is_admin:
                admin_user.is_admin = True
                db.session.commit()
                print("✅ Updated existing user to admin")
            else:
                print("✅ Admin user is properly configured")
            return True
        
        # Create admin user
        try:
            admin_user = User(
                username='admin',
                email='admin@disasterprep.com',
                password_hash=generate_password_hash('Admin123!'),
                is_admin=True
            )
            
            db.session.add(admin_user)
            db.session.commit()
            
            print("✅ Admin user created successfully!")
            print("Username: admin")
            print("Email: admin@disasterprep.com")
            print("Password: Admin123!")
            
            return True
            
        except Exception as e:
            print(f"❌ Error creating admin user: {e}")
            db.session.rollback()
            return False

def initialize_database():
    """Initialize database for Railway deployment"""
    with app.app_context():
        try:
            print("Initializing Railway database...")
            
            # Create all tables
            db.create_all()
            print("✅ Database tables created")
            
            # Ensure admin user exists
            ensure_admin_user()
            
            print("🚀 Railway deployment setup complete!")
            return True
            
        except Exception as e:
            print(f"❌ Railway setup failed: {e}")
            return False

if __name__ == "__main__":
    if not initialize_database():
        sys.exit(1)
