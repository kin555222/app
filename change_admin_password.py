#!/usr/bin/env python3
"""
Script to change the admin password directly via database access.
This is useful for emergency password resets or initial setup.
"""

import sys
import os
import getpass
from werkzeug.security import generate_password_hash

# Add the backend directory to the Python path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend')
sys.path.insert(0, backend_dir)

from models import User, db
from app import app

def change_admin_password():
    with app.app_context():
        print("Admin Password Change Tool")
        print("=" * 40)
        
        # Get admin username
        username = input("Enter admin username (default: admin): ").strip() or "admin"
        
        # Find the user
        user = User.query.filter_by(username=username).first()
        if not user:
            print(f"❌ User '{username}' not found!")
            return False
        
        if not user.is_admin:
            print(f"❌ User '{username}' is not an admin!")
            return False
        
        print(f"Found admin user: {username} ({user.email})")
        
        # Get new password
        print("\nPassword Requirements:")
        print("- At least 8 characters long")
        print("- Must contain uppercase letter, lowercase letter, and digit")
        
        while True:
            new_password = getpass.getpass("Enter new password: ")
            
            if len(new_password) < 8:
                print("❌ Password must be at least 8 characters long!")
                continue
            
            # Check password complexity
            has_upper = any(c.isupper() for c in new_password)
            has_lower = any(c.islower() for c in new_password)
            has_digit = any(c.isdigit() for c in new_password)
            
            if not (has_upper and has_lower and has_digit):
                print("❌ Password must contain at least one uppercase letter, lowercase letter, and digit!")
                continue
            
            # Confirm password
            confirm_password = getpass.getpass("Confirm new password: ")
            if new_password != confirm_password:
                print("❌ Passwords do not match!")
                continue
            
            break
        
        # Update password
        try:
            user.password_hash = generate_password_hash(new_password)
            db.session.commit()
            
            print("✅ Admin password changed successfully!")
            print(f"Username: {username}")
            print("You can now log in with the new password.")
            return True
            
        except Exception as e:
            print(f"❌ Error changing password: {e}")
            db.session.rollback()
            return False

if __name__ == "__main__":
    print("Disaster Preparedness App - Admin Password Change")
    print("=" * 55)
    
    if not change_admin_password():
        sys.exit(1)
    
    print("\n" + "=" * 55)
    print("Password change complete!")
    print("Remember to keep your password secure and don't share it.")
