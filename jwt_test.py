import os
import sys
sys.path.insert(0, 'backend')

from flask import Flask, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token
from dotenv import load_dotenv

load_dotenv('backend/.env')

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
jwt = JWTManager(app)

@app.route('/test-jwt', methods=['GET'])
@jwt_required()
def test_jwt():
    user_id = get_jwt_identity()
    return jsonify({'user_id': user_id, 'message': 'JWT is working'})

@app.route('/create-test-token', methods=['GET'])
def create_test_token():
    token = create_access_token(identity=1)
    return jsonify({'token': token})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
