#!/usr/bin/env python3
"""
Test script to verify registration API endpoint
"""
import requests
import json

# Test data
test_user = {
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "TestPassword123",
    "password_confirm": "TestPassword123"
}

# API endpoint
api_url = "http://localhost:8000/api/auth/register/"

def test_registration():
    print("Testing registration endpoint...")
    print(f"URL: {api_url}")
    print(f"Data: {json.dumps({**test_user, 'password': '[HIDDEN]', 'password_confirm': '[HIDDEN]'}, indent=2)}")
    
    try:
        response = requests.post(
            api_url,
            json=test_user,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            print(f"Response Data: {json.dumps(response_data, indent=2)}")
        except json.JSONDecodeError:
            print(f"Response Text: {response.text}")
            
        if response.status_code == 201:
            print("\n✅ Registration successful!")
        else:
            print(f"\n❌ Registration failed with status {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("\n❌ Connection failed - Is the Django server running on localhost:8000?")
    except requests.exceptions.Timeout:
        print("\n❌ Request timed out")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    test_registration()