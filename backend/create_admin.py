#!/usr/bin/env python3
"""
Script to create an admin user for the disaster preparedness app.
Run this script to create your first admin user.
"""

import sys
import os
from werkzeug.security import generate_password_hash
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the backend directory to the Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

from models import User, db
from app import app

def create_admin_user():
    with app.app_context():
        # Ensure tables exist
        db.create_all()
        
        print("Creating admin user for Disaster Preparedness App")
        print("=" * 50)
        
        # Get user input
        username = input("Enter admin username: ").strip()
        if not username:
            print("Username cannot be empty!")
            return False
            
        email = input("Enter admin email: ").strip()
        if not email:
            print("Email cannot be empty!")
            return False
            
        # Check if user already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            print(f"User '{username}' already exists!")
            
            # Ask if we should make them admin
            make_admin = input("Make this user an admin? (y/N): ").strip().lower()
            if make_admin == 'y':
                existing_user.is_admin = True
                db.session.commit()
                print(f"✅ User '{username}' is now an admin!")
            return True
            
        existing_email = User.query.filter_by(email=email).first()
        if existing_email:
            print(f"Email '{email}' is already registered!")
            return False
        
        import getpass
        password = getpass.getpass("Enter admin password: ")
        if len(password) < 6:
            print("Password must be at least 6 characters long!")
            return False
            
        confirm_password = getpass.getpass("Confirm password: ")
        if password != confirm_password:
            print("Passwords do not match!")
            return False
        
        # Create admin user
        try:
            admin_user = User(
                username=username,
                email=email,
                password_hash=generate_password_hash(password),
                is_admin=True
            )
            
            db.session.add(admin_user)
            db.session.commit()
            
            print("\\n✅ Admin user created successfully!")
            print(f"Username: {username}")
            print(f"Email: {email}")
            print("You can now log in to the admin panel.")
            
            return True
            
        except Exception as e:
            print(f"❌ Error creating admin user: {e}")
            db.session.rollback()
            return False

def list_admin_users():
    with app.app_context():
        admin_users = User.query.filter_by(is_admin=True).all()
        
        if not admin_users:
            print("No admin users found.")
        else:
            print("Current admin users:")
            print("-" * 30)
            for user in admin_users:
                print(f"• {user.username} ({user.email})")

if __name__ == "__main__":
    print("Disaster Preparedness App - Admin User Management")
    print("=" * 55)
    
    if len(sys.argv) > 1 and sys.argv[1] == "list":
        list_admin_users()
    else:
        if not create_admin_user():
            sys.exit(1)
        
        print("\\n" + "=" * 55)
        print("Next steps:")
        print("1. Start your Flask app: python app.py")
        print("2. Open your browser to the app")
        print("3. Log in with the admin credentials")
        print("4. Navigate to /admin to access the admin panel")
