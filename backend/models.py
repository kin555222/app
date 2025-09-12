from datetime import datetime
import json
from database import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Location information for community and alerts
    state = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    locality = db.Column(db.String(200), nullable=True)
    phone_number = db.Column(db.String(15), nullable=True)
    is_admin = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    progress = db.relationship('UserProgress', backref='user', lazy=True)
    community_memberships = db.relationship('CommunityMember', backref='user', lazy=True)
    sent_messages = db.relationship('Message', foreign_keys='Message.sender_id', backref='sender', lazy=True)
    created_communities = db.relationship('Community', backref='creator', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'state': self.state,
            'city': self.city,
            'locality': self.locality,
            'phone_number': self.phone_number,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat()
        }

class Resource(db.Model):
    __tablename__ = 'resources'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    content_url = db.Column(db.String(500), nullable=True)
    content_type = db.Column(db.String(50), default='article')  # article, video, infographic
    category = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    quizzes = db.relationship('Quiz', backref='resource', lazy=True)
    progress = db.relationship('UserProgress', backref='resource', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'content_url': self.content_url,
            'content_type': self.content_type,
            'category': self.category,
            'created_at': self.created_at.isoformat(),
            'quiz_count': len(self.quizzes)
        }

class Quiz(db.Model):
    __tablename__ = 'quizzes'
    
    id = db.Column(db.Integer, primary_key=True)
    resource_id = db.Column(db.Integer, db.ForeignKey('resources.id'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    options = db.Column(db.Text, nullable=False)  # JSON string
    correct_answer = db.Column(db.Integer, nullable=False)  # 0-3 for A,B,C,D
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'resource_id': self.resource_id,
            'question': self.question,
            'options': json.loads(self.options),
            'created_at': self.created_at.isoformat()
        }
    
    def to_dict_with_answer(self):
        data = self.to_dict()
        data['correct_answer'] = self.correct_answer
        return data

class UserProgress(db.Model):
    __tablename__ = 'user_progress'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    resource_id = db.Column(db.Integer, db.ForeignKey('resources.id'), nullable=False)
    quiz_score = db.Column(db.Float, nullable=True)  # percentage (0-100)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint to prevent duplicate progress entries
    __table_args__ = (db.UniqueConstraint('user_id', 'resource_id', name='_user_resource_uc'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'resource_id': self.resource_id,
            'quiz_score': self.quiz_score,
            'completed_at': self.completed_at.isoformat()
        }


class Community(db.Model):
    __tablename__ = 'communities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    # Location-based community
    state = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    locality = db.Column(db.String(200), nullable=True)
    
    # Community settings
    is_public = db.Column(db.Boolean, default=True)
    max_members = db.Column(db.Integer, default=500)
    
    # Community creator
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    members = db.relationship('CommunityMember', backref='community', lazy=True, cascade='all, delete-orphan')
    messages = db.relationship('Message', backref='community', lazy=True, cascade='all, delete-orphan')
    alerts = db.relationship('Alert', backref='community', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'state': self.state,
            'city': self.city,
            'locality': self.locality,
            'is_public': self.is_public,
            'max_members': self.max_members,
            'creator_id': self.creator_id,
            'member_count': len(self.members),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class CommunityMember(db.Model):
    __tablename__ = 'community_members'
    
    id = db.Column(db.Integer, primary_key=True)
    community_id = db.Column(db.Integer, db.ForeignKey('communities.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Member role and status
    role = db.Column(db.String(50), default='member')  # member, moderator, admin
    status = db.Column(db.String(50), default='active')  # active, inactive, banned
    
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Unique constraint to prevent duplicate memberships
    __table_args__ = (db.UniqueConstraint('community_id', 'user_id', name='_community_user_uc'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'community_id': self.community_id,
            'user_id': self.user_id,
            'role': self.role,
            'status': self.status,
            'joined_at': self.joined_at.isoformat(),
            'user': self.user.to_dict() if self.user else None
        }

class Message(db.Model):
    __tablename__ = 'messages'
    
    id = db.Column(db.Integer, primary_key=True)
    community_id = db.Column(db.Integer, db.ForeignKey('communities.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    content = db.Column(db.Text, nullable=False)
    message_type = db.Column(db.String(50), default='text')  # text, emergency, announcement
    
    # Message metadata
    is_emergency = db.Column(db.Boolean, default=False)
    is_pinned = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'community_id': self.community_id,
            'sender_id': self.sender_id,
            'content': self.content,
            'message_type': self.message_type,
            'is_emergency': self.is_emergency,
            'is_pinned': self.is_pinned,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'sender': self.sender.to_dict() if self.sender else None
        }

class Alert(db.Model):
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    
    # Alert classification
    alert_type = db.Column(db.String(50), nullable=False)  # weather, emergency, community, government
    severity = db.Column(db.String(20), nullable=False)  # low, medium, high, critical
    category = db.Column(db.String(100), nullable=True)  # earthquake, flood, cyclone, fire, etc.
    
    # Geographic targeting
    state = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    locality = db.Column(db.String(200), nullable=True)
    
    # Community specific alerts
    community_id = db.Column(db.Integer, db.ForeignKey('communities.id'), nullable=True)
    
    # Alert timing
    issued_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=True)
    
    # Alert status
    is_active = db.Column(db.Boolean, default=True)
    source = db.Column(db.String(100), nullable=True)  # IMD, NDMA, community, etc.
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'message': self.message,
            'alert_type': self.alert_type,
            'severity': self.severity,
            'category': self.category,
            'state': self.state,
            'city': self.city,
            'locality': self.locality,
            'community_id': self.community_id,
            'issued_at': self.issued_at.isoformat(),
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'is_active': self.is_active,
            'source': self.source,
            'created_at': self.created_at.isoformat()
        }

