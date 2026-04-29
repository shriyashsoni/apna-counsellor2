"""Authentication flow tests - register, login, me, refresh"""
import pytest
import uuid

class TestAuth:
    """Authentication endpoints"""
    
    def test_register_student_success(self, api_client, base_url):
        """Test student registration creates user and returns token"""
        email = f"test_student_{uuid.uuid4().hex[:8]}@test.com"
        payload = {
            "name": "Test Student",
            "email": email,
            "password": "testpass123",
            "role": "student"
        }
        
        response = api_client.post(f"{base_url}/api/auth/register", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert "user" in data
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["user"]["email"] == email
        assert data["user"]["role"] == "student"
        assert "id" in data["user"]
        print(f"✓ Student registration successful: {data['user']['email']}")
    
    def test_register_duplicate_email(self, api_client, base_url):
        """Test registering with existing email returns 400"""
        email = f"test_dup_{uuid.uuid4().hex[:8]}@test.com"
        payload = {
            "name": "Test User",
            "email": email,
            "password": "testpass123",
            "role": "student"
        }
        
        # First registration
        response1 = api_client.post(f"{base_url}/api/auth/register", json=payload)
        assert response1.status_code == 200
        
        # Duplicate registration
        response2 = api_client.post(f"{base_url}/api/auth/register", json=payload)
        assert response2.status_code == 400
        
        error = response2.json()
        assert "already registered" in error["detail"].lower()
        print(f"✓ Duplicate email rejected correctly")
    
    def test_login_admin_success(self, api_client, base_url):
        """Test admin login returns token and user data"""
        payload = {
            "email": "admin@example.com",
            "password": "admin123"
        }
        
        response = api_client.post(f"{base_url}/api/auth/login", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert "user" in data
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["user"]["email"] == "admin@example.com"
        assert data["user"]["role"] == "admin"
        print(f"✓ Admin login successful")
    
    def test_login_mentor_success(self, api_client, base_url):
        """Test mentor login with seeded credentials"""
        payload = {
            "email": "arjun@iitb.ac.in",
            "password": "mentor123"
        }
        
        response = api_client.post(f"{base_url}/api/auth/login", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["user"]["role"] == "mentor"
        assert data["user"]["email"] == "arjun@iitb.ac.in"
        print(f"✓ Mentor login successful: {data['user']['name']}")
    
    def test_login_invalid_credentials(self, api_client, base_url):
        """Test login with wrong password returns 401"""
        payload = {
            "email": "admin@example.com",
            "password": "wrongpassword"
        }
        
        response = api_client.post(f"{base_url}/api/auth/login", json=payload)
        assert response.status_code == 401
        
        error = response.json()
        assert "invalid" in error["detail"].lower()
        print(f"✓ Invalid credentials rejected")
    
    def test_auth_me_with_token(self, api_client, base_url, student_token):
        """Test /auth/me returns user data with valid token"""
        headers = {"Authorization": f"Bearer {student_token}"}
        response = api_client.get(f"{base_url}/api/auth/me", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        assert data["user"]["role"] == "student"
        assert "id" in data["user"]
        print(f"✓ Auth me endpoint working: {data['user']['email']}")
    
    def test_auth_me_without_token(self, api_client, base_url):
        """Test /auth/me without token returns 401"""
        response = api_client.get(f"{base_url}/api/auth/me")
        assert response.status_code == 401
        print(f"✓ Auth me correctly rejects missing token")
    
    def test_refresh_token(self, api_client, base_url, student_token):
        """Test refresh token endpoint"""
        headers = {"Authorization": f"Bearer {student_token}"}
        response = api_client.post(f"{base_url}/api/auth/refresh", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        print(f"✓ Token refresh successful")
