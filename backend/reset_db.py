#!/usr/bin/env python3
"""
Database reset script - drops and recreates all tables with correct schema
WARNING: This will delete all existing data!
"""

import os
import sys
from flask import Flask
from dotenv import load_dotenv

load_dotenv()

# Import database and models
from database import db
from models import User, Resource, Quiz, UserProgress, Community, CommunityMember, Message, Alert
from werkzeug.security import generate_password_hash

# Initialize Flask app
app = Flask(__name__)

# Configuration
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///disaster_prep.db')

# Handle SQLite vs PostgreSQL URL format
if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['FLASK_ENV'] = os.getenv('FLASK_ENV', 'development')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-key')

# Initialize database
db.init_app(app)

def reset_database():
    """Drop all tables and recreate them with correct schema"""
    print("🗄️  Starting database reset...")
    print(f"📍 Database: {DATABASE_URL.split('@')[0] if '@' in DATABASE_URL else DATABASE_URL}")
    
    with app.app_context():
        try:
            print("🗑️  Dropping all existing tables...")
            db.drop_all()
            print("✅ All tables dropped successfully")
            
            print("🔧 Creating all tables with correct schema...")
            db.create_all()
            print("✅ All tables created successfully")
            
            # Verify tables were created
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"📋 Created tables: {', '.join(tables)}")
            
            # Check User table schema
            if 'users' in tables:
                columns = inspector.get_columns('users')
                column_names = [col['name'] for col in columns]
                print(f"👤 User table columns: {', '.join(column_names)}")
                
                required_columns = ['id', 'username', 'email', 'password_hash', 'state', 'city', 'locality', 'phone_number', 'created_at']
                missing_columns = [col for col in required_columns if col not in column_names]
                if missing_columns:
                    print(f"⚠️  Missing columns: {', '.join(missing_columns)}")
                else:
                    print("✅ All required User columns present")
            
            print("🎉 Database reset completed successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Database reset failed: {e}")
            return False

def seed_sample_data():
    """Add some sample data for testing"""
    print("Seeding sample data...")
    
    with app.app_context():
        try:
            # Add sample resources
            sample_resources = [
                {
                    'title': 'Earthquake Preparedness Guide',
                    'description': 'Complete guide to preparing for earthquakes',
                    'category': 'earthquake',
                    'content_type': 'article'
                },
                {
                    'title': 'Flood Safety Measures',
                    'description': 'How to stay safe during floods',
                    'category': 'flood',
                    'content_type': 'article'
                },
                {
                    'title': 'Emergency Kit Essentials',
                    'description': 'What to include in your emergency kit',
                    'category': 'general',
                    'content_type': 'infographic'
                }
            ]
            
            for resource_data in sample_resources:
                resource = Resource(**resource_data)
                db.session.add(resource)
            
            db.session.commit()
            print("Sample resources added")

            # Add sample admin user
            admin_user = User(
                username='admin',
                email='admin@example.com',
                password_hash='admin_password', # Using plain text for testing
                is_admin=True
            )
            db.session.add(admin_user)
            db.session.commit()
            print("Added sample admin user: admin/admin_password")
            return True
            
        except Exception as e:
            print(f"Failed to seed data: {e}")
            db.session.rollback()
            return False

def main():
    """Main function"""
    print("🚀 Disaster Preparedness App - Database Reset Tool (Automated)")
    print("=" * 60)

    # Automatically confirm for automated execution
    print("⚠️  WARNING: This will DELETE ALL DATA in the database. Proceeding automatically...")

    # Reset database
    if reset_database():
        # Automatically add sample data
        print("Adding sample data for testing automatically...")
        seed_sample_data()

        print("\n✨ Database is ready for use!")
        print("🔗 You can now test user registration and other features.")
    else:
        print("\n💥 Database reset failed!")
        sys.exit(1)

if __name__ == '__main__':
    main()
