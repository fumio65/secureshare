#!/usr/bin/env python3
"""
Debug script to test registration API and identify field validation issues
"""
import requests
import json

# Test data that matches what the frontend sends
test_user_data = {
    "first_name": "John",
    "last_name": "Doe", 
    "email": "john.doe@example.com",
    "password": "TestPassword123"
}

# API endpoint
api_url = "http://localhost:8000/api/auth/register/"

def test_registration_scenarios():
    """Test different registration scenarios to identify the issue"""
    
    scenarios = [
        {
            "name": "Frontend Data (without password_confirm)",
            "data": test_user_data
        },
        {
            "name": "Complete Data (with password_confirm)",
            "data": {
                **test_user_data,
                "password_confirm": "TestPassword123"
            }
        },
        {
            "name": "Complete Data with Username",
            "data": {
                **test_user_data,
                "password_confirm": "TestPassword123",
                "username": "johndoe"
            }
        },
        {
            "name": "Empty Username",
            "data": {
                **test_user_data,
                "password_confirm": "TestPassword123",
                "username": ""
            }
        }
    ]
    
    for scenario in scenarios:
        print(f"\n{'='*50}")
        print(f"Testing: {scenario['name']}")
        print(f"{'='*50}")
        
        data = scenario['data']
        print(f"Sending data: {json.dumps({**data, 'password': '[HIDDEN]', 'password_confirm': '[HIDDEN]' if 'password_confirm' in data else None}, indent=2)}")
        
        try:
            response = requests.post(
                api_url,
                json=data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            print(f"\nResponse Status: {response.status_code}")
            
            try:
                response_data = response.json()
                print(f"Response Data: {json.dumps(response_data, indent=2)}")
                
                if response.status_code == 201:
                    print("✅ Registration successful!")
                elif response.status_code == 400:
                    print("❌ Validation error")
                    if 'errors' in response_data:
                        print("Field errors:")
                        for field, errors in response_data['errors'].items():
                            print(f"  - {field}: {errors}")
                else:
                    print(f"❌ Unexpected status code: {response.status_code}")
                    
            except json.JSONDecodeError:
                print(f"Response Text: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print("❌ Connection failed - Is the Django server running on localhost:8000?")
            break
        except requests.exceptions.Timeout:
            print("❌ Request timed out")
        except Exception as e:
            print(f"❌ Error: {e}")

def test_field_requirements():
    """Test individual field requirements"""
    print(f"\n{'='*50}")
    print("Testing Individual Field Requirements")
    print(f"{'='*50}")
    
    # Test missing each field one by one
    base_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "test@example.com",
        "password": "TestPassword123",
        "password_confirm": "TestPassword123"
    }
    
    fields_to_test = ['first_name', 'last_name', 'email', 'password', 'password_confirm']
    
    for field in fields_to_test:
        print(f"\nTesting without '{field}':")
        test_data = {k: v for k, v in base_data.items() if k != field}
        
        try:
            response = requests.post(
                api_url,
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=5
            )
            
            if response.status_code == 400:
                response_data = response.json()
                if 'errors' in response_data and field in response_data['errors']:
                    print(f"  ✅ Field '{field}' is required: {response_data['errors'][field]}")
                else:
                    print(f"  ❓ Field '{field}' - unexpected response: {response_data}")
            else:
                print(f"  ❌ Field '{field}' - unexpected status: {response.status_code}")
                
        except Exception as e:
            print(f"  ❌ Error testing '{field}': {e}")

if __name__ == "__main__":
    print("SecureShare Registration Debug Tool")
    print("This script will test various registration scenarios to identify the issue.")
    
    test_registration_scenarios()
    test_field_requirements()
    
    print(f"\n{'='*50}")
    print("Debug Summary:")
    print("1. Check if the backend server is running on localhost:8000")
    print("2. Look for validation errors in the responses above")
    print("3. The frontend should send 'password_confirm' field")
    print("4. Check if any required fields are missing from the frontend form")
    print(f"{'='*50}")