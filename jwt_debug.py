import jwt
import os
from datetime import datetime

# Token from the login response
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1NzUzNTAwNCwianRpIjoiMTY0NzY0ZDMtYjNkNi00ODhhLTkyMTktYzlhNzY0YTZkY2QyIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzU3NTM1MDA0LCJleHAiOjE3NTc2MjE0MDR9.t0mYZUuiLxGN8BsirxKTAloJQxYaNqZJ08VF7LM-PCg"

try:
    # Try to decode without verification first to see the payload
    decoded = jwt.decode(token, options={"verify_signature": False})
    print("Token payload:", decoded)
    
    # Check expiration
    exp_timestamp = decoded.get('exp')
    if exp_timestamp:
        exp_date = datetime.fromtimestamp(exp_timestamp)
        print(f"Token expires at: {exp_date}")
        print(f"Current time: {datetime.now()}")
        print(f"Token expired: {datetime.now() > exp_date}")
        
except Exception as e:
    print(f"Error decoding token: {e}")
