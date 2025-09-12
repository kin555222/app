from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from database import db

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///' + os.path.abspath(os.path.join(os.path.dirname(__file__), 'instance', 'disaster_prep.db')))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Production configuration
if os.getenv('FLASK_ENV') == 'production':
    app.config['DEBUG'] = False
else:
    app.config['DEBUG'] = True

# Initialize extensions
db.init_app(app)
cors = CORS(app)
jwt = JWTManager(app)

# JWT Error Handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({'msg': 'Token has expired'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({'msg': 'Invalid token'}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({'msg': 'Authorization token is required'}), 401

# Import models after db initialization
from models import User, Resource, Quiz, UserProgress, Community, CommunityMember, Message, Alert

# Create tables and handle schema migrations
def ensure_database_schema():
    """Ensure database has the correct schema, handling migrations if needed"""
    try:
        # Try to create all tables (this is safe - won't overwrite existing ones)
        db.create_all()
        
        # Check if users table has the required columns
        inspector = db.inspect(db.engine)
        if 'users' in inspector.get_table_names():
            columns = [col['name'] for col in inspector.get_columns('users')]
            required_columns = ['state', 'city', 'locality', 'phone_number', 'is_admin']
            missing_columns = [col for col in required_columns if col not in columns]
            
            if missing_columns:
                print(f"Missing columns detected: {missing_columns}")
                print("Attempting to add missing columns...")
                
                # Add missing columns
                for column in missing_columns:
                    try:
                        if column == 'state':
                            db.session.execute(text("ALTER TABLE users ADD COLUMN state VARCHAR(100)"))
                        elif column == 'city':
                            db.session.execute(text("ALTER TABLE users ADD COLUMN city VARCHAR(100)"))
                        elif column == 'locality':
                            db.session.execute(text("ALTER TABLE users ADD COLUMN locality VARCHAR(200)"))
                        elif column == 'phone_number':
                            db.session.execute(text("ALTER TABLE users ADD COLUMN phone_number VARCHAR(15)"))
                        elif column == 'is_admin':
                            db.session.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE"))
                        db.session.commit()
                        print(f"Added column: {column}")
                    except Exception as e:
                        print(f"Failed to add column {column}: {e}")
                        db.session.rollback()
        
        print("Database schema check completed successfully")
        return True
    except Exception as e:
        print(f"Database schema check failed: {e}")
        return False

def seed_initial_data():
    """Add initial sample data if database is empty"""
    try:
        # Check if we have any resources
        resource_count = Resource.query.count()
        if resource_count == 0:
            print("Database is empty. Adding sample resources...")
            
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
            print(f"Added {len(sample_resources)} sample resources")
        else:
            print(f"Database already has {resource_count} resources")
        
        return True
    except Exception as e:
        print(f"Failed to seed initial data: {e}")
        db.session.rollback()
        return False

with app.app_context():
    # Import text for SQL operations
    from sqlalchemy import text

# Import routes
from routes import auth_bp, resources_bp, quiz_bp, user_bp, community_bp, message_bp, alert_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(resources_bp, url_prefix='/api')
app.register_blueprint(quiz_bp, url_prefix='/api')
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(community_bp, url_prefix='/api')
app.register_blueprint(message_bp, url_prefix='/api')
app.register_blueprint(alert_bp, url_prefix='/api')

@app.route('/')
def home():
    return jsonify({"message": "Disaster Preparedness API is running!"})

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.utcnow().isoformat()})

if __name__ == '__main__':
    # Initialize database on startup
    with app.app_context():
        print("Initializing database...")
        ensure_database_schema()
        seed_initial_data()
        print("Database initialization complete.")
    
    from waitress import serve
    print("Starting Disaster Preparedness API on http://0.0.0.0:5000")
    serve(app, host='0.0.0.0', port=5000)
