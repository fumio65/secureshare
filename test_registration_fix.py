#!/usr/bin/env python3
"""
Test script to verify the registration fix works correctly
"""
import requests
import json
import time

# API endpoint
api_url = "http://localhost:8000/api/auth/register/"

def test_registration_with_password_confirm():
    """Test registration with password_confirm field (should work now)"""
    print("Testing Registration with password_confirm field")
    print("=" * 50)
    
    test_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": f"test{int(time.time())}@example.com",  # Unique email
        "password": "TestPassword123",
        "password_confirm": "TestPassword123"
    }
    
    print(f"Sending data: {json.dumps({**test_data, 'password': '[HIDDEN]', 'password_confirm': '[HIDDEN]'}, indent=2)}")
    
    try:
        response = requests.post(
            api_url,
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"\nResponse Status: {response.status_code}")
        
        try:
            response_data = response.json()
            print(f"Response Data: {json.dumps(response_data, indent=2)}")
            
            if response.status_code == 201:
                print("✅ Registration successful!")
                print("✅ Fix confirmed: password_confirm field is now being sent correctly")
                return True
            elif response.status_code == 400:
                print("❌ Validation error")
                if 'errors' in response_data:
                    print("Field errors:")
                    for field, errors in response_data['errors'].items():
                        print(f"  - {field}: {errors}")
                return False
            else:
                print(f"❌ Unexpected status code: {response.status_code}")
                return False
                
        except json.JSONDecodeError:
            print(f"Response Text: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - Is the Django server running on localhost:8000?")
        return False
    except requests.exceptions.Timeout:
        print("❌ Request timed out")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_registration_without_password_confirm():
    """Test registration without password_confirm field (should fail)"""
    print("\nTesting Registration without password_confirm field")
    print("=" * 50)
    
    test_data = {
        "first_name": "Jane",
        "last_name": "Smith",
        "email": f"test{int(time.time())+1}@example.com",  # Unique email
        "password": "TestPassword123"
        # Note: no password_confirm field
    }
    
    print(f"Sending data: {json.dumps({**test_data, 'password': '[HIDDEN]'}, indent=2)}")
    
    try:
        response = requests.post(
            api_url,
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"\nResponse Status: {response.status_code}")
        
        try:
            response_data = response.json()
            print(f"Response Data: {json.dumps(response_data, indent=2)}")
            
            if response.status_code == 400:
                if 'errors' in response_data and 'password_confirm' in response_data['errors']:
                    print("✅ Correctly rejected: password_confirm field is required")
                    return True
                else:
                    print("❓ Rejected but not for password_confirm field")
                    return False
            else:
                print(f"❌ Unexpected: should have failed with 400 status")
                return False
                
        except json.JSONDecodeError:
            print(f"Response Text: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_password_mismatch():
    """Test registration with mismatched passwords"""
    print("\nTesting Registration with password mismatch")
    print("=" * 50)
    
    test_data = {
        "first_name": "Bob",
        "last_name": "Wilson",
        "email": f"test{int(time.time())+2}@example.com",  # Unique email
        "password": "TestPassword123",
        "password_confirm": "DifferentPassword456"
    }
    
    print(f"Sending data: {json.dumps({**test_data, 'password': '[HIDDEN]', 'password_confirm': '[HIDDEN]'}, indent=2)}")
    
    try:
        response = requests.post(
            api_url,
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"\nResponse Status: {response.status_code}")
        
        try:
            response_data = response.json()
            print(f"Response Data: {json.dumps(response_data, indent=2)}")
            
            if response.status_code == 400:
                if 'errors' in response_data and 'password_confirm' in response_data['errors']:
                    print("✅ Correctly rejected: password confirmation does not match")
                    return True
                else:
                    print("❓ Rejected but not for password mismatch")
                    return False
            else:
                print(f"❌ Unexpected: should have failed with 400 status")
                return False
                
        except json.JSONDecodeError:
            print(f"Response Text: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("SecureShare Registration Fix Verification")
    print("=" * 60)
    print("This script tests if the 'This field is required' error is fixed")
    print("=" * 60)
    
    results = []
    
    # Test 1: Valid registration with password_confirm
    results.append(test_registration_with_password_confirm())
    
    # Test 2: Registration without password_confirm (should fail)
    results.append(test_registration_without_password_confirm())
    
    # Test 3: Registration with password mismatch (should fail)
    results.append(test_password_mismatch())
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    if all(results):
        print("✅ ALL TESTS PASSED!")
        print("✅ The 'This field is required' error should now be fixed")
        print("✅ Users can now register successfully when all fields are filled")
    else:
        print("❌ Some tests failed")
        print("❌ The registration issue may not be fully resolved")
        
    print("\nNext steps:")
    print("1. Start the Django backend server: python manage.py runserver")
    print("2. Start the React frontend: npm run dev")
    print("3. Try registering a new user through the web interface")
    print("=" * 60)