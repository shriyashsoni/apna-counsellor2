import pytest
import requests
import os

@pytest.fixture
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session

@pytest.fixture
def base_url():
    """Base URL from environment"""
    url = os.environ.get('EXPO_PUBLIC_BACKEND_URL')
    if not url:
        pytest.fail("EXPO_PUBLIC_BACKEND_URL not set in environment")
    return url.rstrip('/')

@pytest.fixture
def admin_token(api_client, base_url):
    """Get admin token for authenticated tests"""
    response = api_client.post(f"{base_url}/api/auth/login", json={
        "email": "admin@example.com",
        "password": "admin123"
    })
    if response.status_code != 200:
        pytest.skip("Admin login failed - skipping authenticated tests")
    return response.json()["access_token"]

@pytest.fixture
def student_token(api_client, base_url):
    """Create and login a test student"""
    import uuid
    email = f"test_student_{uuid.uuid4().hex[:8]}@test.com"
    
    # Register
    response = api_client.post(f"{base_url}/api/auth/register", json={
        "name": "Test Student",
        "email": email,
        "password": "testpass123",
        "role": "student"
    })
    if response.status_code != 200:
        pytest.skip("Student registration failed")
    return response.json()["access_token"]
