from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from database import db
from models import User, Resource, Quiz, UserProgress, Community, CommunityMember, Message, Alert
import json

# Create blueprints
auth_bp = Blueprint('auth', __name__)
resources_bp = Blueprint('resources', __name__)
quiz_bp = Blueprint('quiz', __name__)
user_bp = Blueprint('user', __name__)
community_bp = Blueprint('community', __name__)
message_bp = Blueprint('message', __name__)
alert_bp = Blueprint('alert', __name__)

# Authentication routes
@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Username, email, and password are required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # Create new user
        password_hash = generate_password_hash(data['password'])
        new_user = User(
            username=data['username'],
            email=data['email'],
            password_hash=password_hash
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=new_user.id)
        
        return jsonify({
            'message': 'User created successfully',
            'access_token': access_token,
            'user': new_user.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password are required'}), 400
        
        # Find user
        user = User.query.filter_by(username=data['username']).first()
        
        if not user or not check_password_hash(user.password_hash, data['password']):
            return jsonify({'error': 'Invalid username or password'}), 401
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Resource routes
@resources_bp.route('/resources', methods=['GET'])
def get_resources():
    try:
        category = request.args.get('category')
        
        if category:
            resources = Resource.query.filter_by(category=category).all()
        else:
            resources = Resource.query.all()
        
        return jsonify({
            'resources': [resource.to_dict() for resource in resources],
            'count': len(resources)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@resources_bp.route('/resources/<int:resource_id>', methods=['GET'])
def get_resource(resource_id):
    try:
        resource = Resource.query.get(resource_id)
        
        if not resource:
            return jsonify({'error': 'Resource not found'}), 404
        
        # Get quizzes for this resource
        quizzes = Quiz.query.filter_by(resource_id=resource_id).all()
        
        return jsonify({
            'resource': resource.to_dict(),
            'quizzes': [quiz.to_dict() for quiz in quizzes]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Quiz routes
@quiz_bp.route('/quiz/submit', methods=['POST'])
@jwt_required()
def submit_quiz():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or not data.get('resource_id') or not data.get('answers'):
            return jsonify({'error': 'Resource ID and answers are required'}), 400
        
        resource_id = data['resource_id']
        user_answers = data['answers']  # List of answer indices
        
        # Get all quizzes for this resource
        quizzes = Quiz.query.filter_by(resource_id=resource_id).all()
        
        if not quizzes:
            return jsonify({'error': 'No quizzes found for this resource'}), 404
        
        if len(user_answers) != len(quizzes):
            return jsonify({'error': 'Number of answers does not match number of questions'}), 400
        
        # Calculate score
        correct_answers = 0
        total_questions = len(quizzes)
        
        for i, quiz in enumerate(quizzes):
            if i < len(user_answers) and user_answers[i] == quiz.correct_answer:
                correct_answers += 1
        
        score = (correct_answers / total_questions) * 100
        
        # Save or update user progress
        progress = UserProgress.query.filter_by(user_id=user_id, resource_id=resource_id).first()
        
        if progress:
            progress.quiz_score = score
            progress.completed_at = datetime.utcnow()
        else:
            progress = UserProgress(
                user_id=user_id,
                resource_id=resource_id,
                quiz_score=score
            )
            db.session.add(progress)
        
        db.session.commit()
        
        return jsonify({
            'score': score,
            'correct_answers': correct_answers,
            'total_questions': total_questions,
            'passed': score >= 70,  # 70% passing grade
            'progress': progress.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# User routes
@user_bp.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_profile(user_id):
    try:
        current_user_id = get_jwt_identity()
        
        # Users can only access their own profile
        if current_user_id != user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user progress
        progress = UserProgress.query.filter_by(user_id=user_id).all()
        
        # Calculate badges/achievements
        badges = []
        completed_resources = len([p for p in progress if p.quiz_score and p.quiz_score >= 70])
        
        if completed_resources >= 1:
            badges.append("First Steps")
        if completed_resources >= 3:
            badges.append("Safety Aware")
        if completed_resources >= 5:
            badges.append("Emergency Expert")
        
        return jsonify({
            'user': user.to_dict(),
            'progress': [p.to_dict() for p in progress],
            'badges': badges,
            'completed_resources': completed_resources
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Community routes
@community_bp.route('/communities', methods=['GET'])
@jwt_required()
def get_communities():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        # Get query parameters
        state = request.args.get('state', user.state if user else None)
        city = request.args.get('city', user.city if user else None)
        locality = request.args.get('locality')
        
        # Build query
        query = Community.query.filter_by(is_public=True)
        
        if state:
            query = query.filter_by(state=state)
        if city:
            query = query.filter_by(city=city)
        if locality:
            query = query.filter_by(locality=locality)
            
        communities = query.all()
        
        return jsonify({
            'communities': [community.to_dict() for community in communities],
            'count': len(communities)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@community_bp.route('/communities', methods=['POST'])
@jwt_required()
def create_community():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('name') or not data.get('state') or not data.get('city'):
            return jsonify({'error': 'Name, state, and city are required'}), 400
        
        # Create new community
        new_community = Community(
            name=data['name'],
            description=data.get('description'),
            state=data['state'],
            city=data['city'],
            locality=data.get('locality'),
            is_public=data.get('is_public', True),
            max_members=data.get('max_members', 500),
            creator_id=user_id
        )
        
        db.session.add(new_community)
        db.session.flush()  # Get the ID
        
        # Add creator as admin member
        creator_member = CommunityMember(
            community_id=new_community.id,
            user_id=user_id,
            role='admin',
            status='active'
        )
        
        db.session.add(creator_member)
        db.session.commit()
        
        return jsonify({
            'message': 'Community created successfully',
            'community': new_community.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@community_bp.route('/communities/<int:community_id>', methods=['GET'])
@jwt_required()
def get_community(community_id):
    try:
        user_id = get_jwt_identity()
        
        community = Community.query.get(community_id)
        if not community:
            return jsonify({'error': 'Community not found'}), 404
        
        # Check if user is a member
        membership = CommunityMember.query.filter_by(
            community_id=community_id, 
            user_id=user_id
        ).first()
        
        if not community.is_public and not membership:
            return jsonify({'error': 'Access denied'}), 403
        
        # Get community members
        members = CommunityMember.query.filter_by(
            community_id=community_id,
            status='active'
        ).all()
        
        # Get recent messages (last 50)
        recent_messages = Message.query.filter_by(
            community_id=community_id
        ).order_by(Message.created_at.desc()).limit(50).all()
        
        return jsonify({
            'community': community.to_dict(),
            'members': [member.to_dict() for member in members],
            'recent_messages': [msg.to_dict() for msg in reversed(recent_messages)],
            'user_membership': membership.to_dict() if membership else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@community_bp.route('/communities/<int:community_id>/join', methods=['POST'])
@jwt_required()
def join_community(community_id):
    try:
        user_id = get_jwt_identity()
        
        community = Community.query.get(community_id)
        if not community:
            return jsonify({'error': 'Community not found'}), 404
        
        # Check if already a member
        existing_membership = CommunityMember.query.filter_by(
            community_id=community_id,
            user_id=user_id
        ).first()
        
        if existing_membership:
            if existing_membership.status == 'active':
                return jsonify({'error': 'Already a member of this community'}), 400
            else:
                # Reactivate membership
                existing_membership.status = 'active'
                existing_membership.joined_at = datetime.utcnow()
        else:
            # Check member limit
            current_members = CommunityMember.query.filter_by(
                community_id=community_id,
                status='active'
            ).count()
            
            if current_members >= community.max_members:
                return jsonify({'error': 'Community is full'}), 400
            
            # Create new membership
            new_membership = CommunityMember(
                community_id=community_id,
                user_id=user_id,
                role='member',
                status='active'
            )
            db.session.add(new_membership)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Successfully joined community',
            'membership': existing_membership.to_dict() if existing_membership else new_membership.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@community_bp.route('/communities/<int:community_id>/leave', methods=['POST'])
@jwt_required()
def leave_community(community_id):
    try:
        user_id = get_jwt_identity()
        
        membership = CommunityMember.query.filter_by(
            community_id=community_id,
            user_id=user_id
        ).first()
        
        if not membership:
            return jsonify({'error': 'Not a member of this community'}), 400
        
        # Creators cannot leave their own community
        community = Community.query.get(community_id)
        if community.creator_id == user_id:
            return jsonify({'error': 'Community creators cannot leave their community'}), 400
        
        membership.status = 'inactive'
        db.session.commit()
        
        return jsonify({'message': 'Successfully left community'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Messaging routes
@message_bp.route('/communities/<int:community_id>/messages', methods=['GET'])
@jwt_required()
def get_messages(community_id):
    try:
        user_id = get_jwt_identity()
        
        # Check if user is a member of the community
        membership = CommunityMember.query.filter_by(
            community_id=community_id,
            user_id=user_id,
            status='active'
        ).first()
        
        if not membership:
            return jsonify({'error': 'Access denied - not a member of this community'}), 403
        
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        
        # Get messages with pagination
        messages = Message.query.filter_by(
            community_id=community_id
        ).order_by(Message.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'messages': [msg.to_dict() for msg in reversed(messages.items)],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': messages.total,
                'pages': messages.pages,
                'has_next': messages.has_next,
                'has_prev': messages.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@message_bp.route('/communities/<int:community_id>/messages', methods=['POST'])
@jwt_required()
def send_message(community_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or not data.get('content'):
            return jsonify({'error': 'Message content is required'}), 400
        
        # Check if user is a member of the community
        membership = CommunityMember.query.filter_by(
            community_id=community_id,
            user_id=user_id,
            status='active'
        ).first()
        
        if not membership:
            return jsonify({'error': 'Access denied - not a member of this community'}), 403
        
        # Create new message
        new_message = Message(
            community_id=community_id,
            sender_id=user_id,
            content=data['content'],
            message_type=data.get('message_type', 'text'),
            is_emergency=data.get('is_emergency', False)
        )
        
        db.session.add(new_message)
        db.session.commit()
        
        return jsonify({
            'message': 'Message sent successfully',
            'message_data': new_message.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@message_bp.route('/messages/<int:message_id>/pin', methods=['POST'])
@jwt_required()
def pin_message(message_id):
    try:
        user_id = get_jwt_identity()
        
        message = Message.query.get(message_id)
        if not message:
            return jsonify({'error': 'Message not found'}), 404
        
        # Check if user has admin/moderator role in the community
        membership = CommunityMember.query.filter_by(
            community_id=message.community_id,
            user_id=user_id,
            status='active'
        ).first()
        
        if not membership or membership.role not in ['admin', 'moderator']:
            return jsonify({'error': 'Access denied - admin/moderator role required'}), 403
        
        message.is_pinned = not message.is_pinned
        db.session.commit()
        
        return jsonify({
            'message': f'Message {"pinned" if message.is_pinned else "unpinned"} successfully',
            'message_data': message.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Alert routes
@alert_bp.route('/alerts', methods=['GET'])
@jwt_required()
def get_alerts():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        # Get active alerts for user's location
        query = Alert.query.filter_by(is_active=True)
        
        # Filter by location if user has location set
        if user and user.state:
            location_filter = db.or_(
                Alert.state.is_(None),  # Global alerts
                Alert.state == user.state
            )
            query = query.filter(location_filter)
            
            if user.city:
                city_filter = db.or_(
                    Alert.city.is_(None),
                    Alert.city == user.city
                )
                query = query.filter(city_filter)
        
        # Get user's community alerts
        user_communities = [m.community_id for m in user.community_memberships if m.status == 'active']
        if user_communities:
            community_alerts = Alert.query.filter(
                Alert.community_id.in_(user_communities),
                Alert.is_active == True
            ).all()
        else:
            community_alerts = []
        
        location_alerts = query.order_by(Alert.issued_at.desc()).all()
        
        # Combine and sort alerts
        all_alerts = location_alerts + community_alerts
        all_alerts = sorted(all_alerts, key=lambda x: x.issued_at, reverse=True)
        
        return jsonify({
            'alerts': [alert.to_dict() for alert in all_alerts],
            'count': len(all_alerts)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@alert_bp.route('/alerts', methods=['POST'])
@jwt_required()
def create_alert():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or not data.get('title') or not data.get('message') or not data.get('alert_type') or not data.get('severity'):
            return jsonify({'error': 'Title, message, alert_type, and severity are required'}), 400
        
        # If creating a community alert, check permissions
        if data.get('community_id'):
            membership = CommunityMember.query.filter_by(
                community_id=data['community_id'],
                user_id=user_id,
                status='active'
            ).first()
            
            if not membership or membership.role not in ['admin', 'moderator']:
                return jsonify({'error': 'Access denied - admin/moderator role required for community alerts'}), 403
        
        # Create new alert
        new_alert = Alert(
            title=data['title'],
            message=data['message'],
            alert_type=data['alert_type'],
            severity=data['severity'],
            category=data.get('category'),
            state=data.get('state'),
            city=data.get('city'),
            locality=data.get('locality'),
            community_id=data.get('community_id'),
            expires_at=datetime.fromisoformat(data['expires_at']) if data.get('expires_at') else None,
            source=data.get('source', 'community')
        )
        
        db.session.add(new_alert)
        db.session.commit()
        
        return jsonify({
            'message': 'Alert created successfully',
            'alert': new_alert.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@alert_bp.route('/alerts/<int:alert_id>/dismiss', methods=['POST'])
@jwt_required()
def dismiss_alert(alert_id):
    try:
        user_id = get_jwt_identity()
        
        alert = Alert.query.get(alert_id)
        if not alert:
            return jsonify({'error': 'Alert not found'}), 404
        
        # For now, we'll just mark it as inactive (in a real app, you might track user dismissals)
        alert.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Alert dismissed successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
