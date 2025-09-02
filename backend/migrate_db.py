#!/usr/bin/env python3
"""
Database migration script to add missing columns to the users table
"""

import os
import sys
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Database configuration - use Railway's DATABASE_URL if available
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///disaster_prep.db')

# Handle SQLite vs PostgreSQL URL format
if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

def check_column_exists(table_name, column_name):
    """Check if a column exists in a table"""
    try:
        if 'sqlite' in DATABASE_URL.lower():
            # SQLite specific query
            result = db.session.execute(text(f"PRAGMA table_info({table_name})"))
            columns = [row[1] for row in result]
            return column_name in columns
        else:
            # PostgreSQL specific query
            result = db.session.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = :table_name AND column_name = :column_name
            """), {'table_name': table_name, 'column_name': column_name})
            return result.fetchone() is not None
    except Exception as e:
        logger.error(f"Error checking column {column_name} in {table_name}: {e}")
        return False

def add_column_if_not_exists(table_name, column_name, column_definition):
    """Add a column to a table if it doesn't exist"""
    try:
        if not check_column_exists(table_name, column_name):
            logger.info(f"Adding column {column_name} to {table_name}")
            db.session.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_definition}"))
            db.session.commit()
            logger.info(f"Successfully added column {column_name}")
        else:
            logger.info(f"Column {column_name} already exists in {table_name}")
    except Exception as e:
        logger.error(f"Error adding column {column_name}: {e}")
        db.session.rollback()
        raise

def migrate_users_table():
    """Add missing columns to users table"""
    logger.info("Starting users table migration...")
    
    # Define the columns to add
    columns_to_add = [
        ('state', 'VARCHAR(100)'),
        ('city', 'VARCHAR(100)'),
        ('locality', 'VARCHAR(200)'),
        ('phone_number', 'VARCHAR(15)')
    ]
    
    with app.app_context():
        try:
            # Check if users table exists
            if 'sqlite' in DATABASE_URL.lower():
                result = db.session.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='users'"))
            else:
                result = db.session.execute(text("SELECT table_name FROM information_schema.tables WHERE table_name='users'"))
            
            if not result.fetchone():
                logger.error("Users table does not exist!")
                return False
            
            # Add each missing column
            for column_name, column_def in columns_to_add:
                add_column_if_not_exists('users', column_name, column_def)
            
            logger.info("Users table migration completed successfully!")
            return True
            
        except Exception as e:
            logger.error(f"Migration failed: {e}")
            return False

def main():
    """Main migration function"""
    logger.info("Starting database migration...")
    logger.info(f"Database URL: {DATABASE_URL.split('@')[0]}@***")  # Hide password in logs
    
    try:
        success = migrate_users_table()
        if success:
            logger.info("Migration completed successfully!")
            sys.exit(0)
        else:
            logger.error("Migration failed!")
            sys.exit(1)
    except Exception as e:
        logger.error(f"Migration error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
