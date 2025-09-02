from app import app
from database import db
from models import Resource, Quiz
import json

def create_sample_data():
    """Create sample educational resources and quizzes"""
    
    # Sample resources for different disaster categories
    resources_data = [
        {
            "title": "Earthquake Safety Basics",
            "description": "Learn the fundamental principles of earthquake preparedness and response.",
            "content_url": "https://example.com/earthquake-basics",
            "content_type": "article",
            "category": "Earthquake"
        },
        {
            "title": "Drop, Cover, and Hold On",
            "description": "Master the essential earthquake response technique that can save your life.",
            "content_url": "https://example.com/drop-cover-hold",
            "content_type": "video",
            "category": "Earthquake"
        },
        {
            "title": "Flood Preparedness Guide",
            "description": "Comprehensive guide to preparing for and responding to flood emergencies.",
            "content_url": "https://example.com/flood-prep",
            "content_type": "article",
            "category": "Flood"
        },
        {
            "title": "Home Fire Safety",
            "description": "Essential fire safety measures for your home and family.",
            "content_url": "https://example.com/fire-safety",
            "content_type": "infographic",
            "category": "Fire"
        },
        {
            "title": "Basic First Aid Techniques",
            "description": "Learn life-saving first aid skills for emergency situations.",
            "content_url": "https://example.com/first-aid",
            "content_type": "video",
            "category": "First Aid"
        },
        {
            "title": "Pandemic Preparedness",
            "description": "How to prepare your family for pandemic emergencies.",
            "content_url": "https://example.com/pandemic-prep",
            "content_type": "article",
            "category": "Pandemic"
        }
    ]
    
    # Create resources
    for resource_data in resources_data:
        resource = Resource(**resource_data)
        db.session.add(resource)
    
    db.session.commit()
    print(f"Created {len(resources_data)} resources")
    
    # Sample quizzes for each resource
    quizzes_data = [
        # Earthquake Safety Basics quizzes
        {
            "resource_id": 1,
            "question": "What should you do immediately when you feel an earthquake?",
            "options": json.dumps([
                "Run outside immediately",
                "Drop, Cover, and Hold On",
                "Stand in a doorway",
                "Hide under a bed"
            ]),
            "correct_answer": 1
        },
        {
            "resource_id": 1,
            "question": "Which location is safest during an earthquake?",
            "options": json.dumps([
                "Under a heavy desk or table",
                "Near a window",
                "In an elevator",
                "On a staircase"
            ]),
            "correct_answer": 0
        },
        
        # Drop, Cover, and Hold On quizzes
        {
            "resource_id": 2,
            "question": "In 'Drop, Cover, and Hold On', what does 'Drop' mean?",
            "options": json.dumps([
                "Drop to your hands and knees",
                "Drop everything you're holding",
                "Drop to the ground and lie flat",
                "Drop and roll"
            ]),
            "correct_answer": 0
        },
        
        # Flood Preparedness quizzes
        {
            "resource_id": 3,
            "question": "How much moving water can knock you down?",
            "options": json.dumps([
                "6 inches",
                "12 inches",
                "18 inches",
                "24 inches"
            ]),
            "correct_answer": 0
        },
        {
            "resource_id": 3,
            "question": "What should you do if your car is caught in flood water?",
            "options": json.dumps([
                "Drive through quickly",
                "Abandon the car and move to higher ground",
                "Stay in the car and wait for help",
                "Open all windows"
            ]),
            "correct_answer": 1
        },
        
        # Home Fire Safety quizzes
        {
            "resource_id": 4,
            "question": "How often should you test smoke detectors?",
            "options": json.dumps([
                "Once a year",
                "Every 6 months",
                "Once a month",
                "Once a week"
            ]),
            "correct_answer": 2
        },
        
        # Basic First Aid quizzes
        {
            "resource_id": 5,
            "question": "What is the correct ratio for chest compressions to rescue breaths in CPR?",
            "options": json.dumps([
                "15:2",
                "30:2",
                "20:2",
                "10:1"
            ]),
            "correct_answer": 1
        },
        {
            "resource_id": 5,
            "question": "How deep should chest compressions be for an adult?",
            "options": json.dumps([
                "1 inch",
                "1.5 inches",
                "2 inches",
                "3 inches"
            ]),
            "correct_answer": 2
        },
        
        # Pandemic Preparedness quizzes
        {
            "resource_id": 6,
            "question": "How many days of supplies should you have for pandemic preparedness?",
            "options": json.dumps([
                "3 days",
                "7 days",
                "14 days",
                "30 days"
            ]),
            "correct_answer": 2
        }
    ]
    
    # Create quizzes
    for quiz_data in quizzes_data:
        quiz = Quiz(**quiz_data)
        db.session.add(quiz)
    
    db.session.commit()
    print("Sample data created successfully!")

if __name__ == '__main__':
    with app.app_context():
        # Clear existing data
        Quiz.query.delete()
        Resource.query.delete()
        db.session.commit()
        
        # Create new sample data
        create_sample_data()
