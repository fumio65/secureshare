#!/usr/bin/env python3
"""
Setup script for SecureShare backend
"""
import os
import sys
import subprocess
import sqlite3
from pathlib import Path

def run_command(command, cwd=None):
    """Run a command and return success status"""
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            cwd=cwd, 
            capture_output=True, 
            text=True,
            timeout=60
        )
        if result.returncode == 0:
            print(f"✅ {command}")
            if result.stdout.strip():
                print(f"   Output: {result.stdout.strip()}")
            return True
        else:
            print(f"❌ {command}")
            if result.stderr.strip():
                print(f"   Error: {result.stderr.strip()}")
            return False
    except subprocess.TimeoutExpired:
        print(f"❌ {command} (timed out)")
        return False
    except Exception as e:
        print(f"❌ {command} (error: {e})")
        return False

def check_python():
    """Check if Python is available"""
    print("Checking Python installation...")
    
    # Try different Python commands
    python_commands = ['python', 'python3', 'py']
    
    for cmd in python_commands:
        if run_command(f"{cmd} --version"):
            return cmd
    
    print("❌ Python not found. Please install Python 3.8 or higher.")
    return None

def setup_backend():
    """Set up the backend"""
    backend_dir = Path(__file__).parent / "backend"
    
    if not backend_dir.exists():
        print("❌ Backend directory not found")
        return False
    
    print(f"Setting up backend in {backend_dir}")
    
    # Check Python
    python_cmd = check_python()
    if not python_cmd:
        return False
    
    # Check if virtual environment exists
    venv_dir = backend_dir / "venv"
    if not venv_dir.exists():
        print("Creating virtual environment...")
        if not run_command(f"{python_cmd} -m venv venv", cwd=backend_dir):
            print("❌ Failed to create virtual environment")
            return False
    
    # Determine activation script
    if os.name == 'nt':  # Windows
        activate_script = venv_dir / "Scripts" / "activate.bat"
        pip_cmd = str(venv_dir / "Scripts" / "pip.exe")
        python_venv_cmd = str(venv_dir / "Scripts" / "python.exe")
    else:  # Unix/Linux/Mac
        activate_script = venv_dir / "bin" / "activate"
        pip_cmd = str(venv_dir / "bin" / "pip")
        python_venv_cmd = str(venv_dir / "bin" / "python")
    
    # Install requirements
    requirements_file = backend_dir / "requirements.txt"
    if requirements_file.exists():
        print("Installing requirements...")
        if not run_command(f'"{pip_cmd}" install -r requirements.txt', cwd=backend_dir):
            print("❌ Failed to install requirements")
            return False
    
    # Run migrations
    print("Running database migrations...")
    if not run_command(f'"{python_venv_cmd}" manage.py migrate', cwd=backend_dir):
        print("❌ Failed to run migrations")
        return False
    
    # Create superuser (optional)
    print("Backend setup complete!")
    print(f"\nTo start the server:")
    print(f"1. cd {backend_dir}")
    if os.name == 'nt':
        print(f"2. venv\\Scripts\\activate")
    else:
        print(f"2. source venv/bin/activate")
    print(f"3. python manage.py runserver")
    
    return True

def check_database():
    """Check if database exists and has tables"""
    backend_dir = Path(__file__).parent / "backend"
    db_file = backend_dir / "db.sqlite3"
    
    if not db_file.exists():
        print("❌ Database file not found")
        return False
    
    try:
        conn = sqlite3.connect(str(db_file))
        cursor = conn.cursor()
        
        # Check if users table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users';")
        result = cursor.fetchone()
        
        if result:
            print("✅ Database and users table exist")
            
            # Count users
            cursor.execute("SELECT COUNT(*) FROM users;")
            user_count = cursor.fetchone()[0]
            print(f"   Users in database: {user_count}")
        else:
            print("❌ Users table not found - migrations may not have run")
            return False
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False

if __name__ == "__main__":
    print("SecureShare Backend Setup")
    print("=" * 30)
    
    if setup_backend():
        print("\n" + "=" * 30)
        print("Checking database...")
        check_database()
        
        print("\n" + "=" * 30)
        print("Setup complete! You can now test the registration endpoint.")
        print("Run 'python test_registration.py' to test the API.")
    else:
        print("\n❌ Setup failed")
        sys.exit(1)