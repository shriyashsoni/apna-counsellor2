"""
Backend tests for Apna Counselor - Colleges feature
Tests: health, colleges CRUD, predictor, compare, cutoffs, auth, mentors, batches
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('EXPO_PUBLIC_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    pytest.skip("EXPO_PUBLIC_BACKEND_URL not set", allow_module_level=True)

@pytest.fixture
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session

@pytest.fixture
def student_token(api_client):
    """Login as student and return token"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": "rohan@student.com",
        "password": "student123"
    })
    if response.status_code != 200:
        pytest.skip("Student login failed - cannot test authenticated endpoints")
    return response.json()["access_token"]

class TestHealth:
    """Health check endpoint"""
    
    def test_health_returns_apna_counselor(self, api_client):
        """GET /api/health should return 'Apna Counselor'"""
        response = api_client.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["app"] == "Apna Counselor"
        assert "status" in data
        print(f"✓ Health check passed: {data['app']}")

class TestColleges:
    """Colleges endpoints"""
    
    def test_list_colleges_returns_12(self, api_client):
        """GET /api/colleges should return 12 real colleges"""
        response = api_client.get(f"{BASE_URL}/api/colleges")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 12, f"Expected 12 colleges, got {len(data)}"
        
        # Verify structure
        college = data[0]
        assert "id" in college
        assert "name" in college
        assert "short_name" in college
        assert "type" in college
        assert "nirf_rank" in college
        assert "cutoffs" in college
        print(f"✓ List colleges: {len(data)} colleges returned")
    
    def test_filter_colleges_by_type_iit(self, api_client):
        """GET /api/colleges?college_type=IIT should filter to IITs only"""
        response = api_client.get(f"{BASE_URL}/api/colleges?college_type=IIT")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 5, f"Expected 5 IITs, got {len(data)}"
        
        # Verify all are IITs
        for college in data:
            assert college["type"] == "IIT", f"Expected IIT, got {college['type']}"
        print(f"✓ Filter by IIT: {len(data)} IITs returned")
    
    def test_get_college_detail_iit_bombay(self, api_client):
        """GET /api/colleges/iit-bombay should return full college detail with cutoffs"""
        response = api_client.get(f"{BASE_URL}/api/colleges/iit-bombay")
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert data["id"] == "iit-bombay"
        assert data["name"] == "Indian Institute of Technology Bombay"
        assert data["short_name"] == "IIT Bombay"
        assert data["type"] == "IIT"
        assert data["nirf_rank"] == 3
        assert "cutoffs" in data
        assert "branches" in data
        assert "placements" in data
        
        # Verify cutoffs structure
        cutoffs = data["cutoffs"]
        assert "Computer Science" in cutoffs
        assert "General" in cutoffs["Computer Science"]
        print(f"✓ College detail: {data['short_name']} with {len(cutoffs)} branches")
    
    def test_get_college_detail_invalid_id(self, api_client):
        """GET /api/colleges/invalid-id should return 404"""
        response = api_client.get(f"{BASE_URL}/api/colleges/invalid-college-id")
        assert response.status_code == 404
        print("✓ Invalid college ID returns 404")
    
    def test_predict_colleges_with_rank_5000(self, api_client, student_token):
        """POST /api/colleges/predict with rank=5000 exam='JEE Advanced' should return matching colleges"""
        response = api_client.post(
            f"{BASE_URL}/api/colleges/predict",
            json={"exam": "JEE Advanced", "rank": 5000, "category": "General"},
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0, "Expected at least 1 college prediction"
        
        # Verify structure
        result = data[0]
        assert "college_id" in result
        assert "name" in result
        assert "branch" in result
        assert "cutoff_rank" in result
        assert "probability" in result
        assert "your_rank" in result
        assert result["your_rank"] == 5000
        print(f"✓ College predictor: {len(data)} colleges predicted for rank 5000")
    
    def test_compare_colleges_iit_bombay_delhi(self, api_client):
        """POST /api/colleges/compare with college_ids=['iit-bombay','iit-delhi'] should return both"""
        response = api_client.post(
            f"{BASE_URL}/api/colleges/compare",
            json={"college_ids": ["iit-bombay", "iit-delhi"]}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 2, f"Expected 2 colleges, got {len(data)}"
        
        # Verify both colleges returned
        ids = [c["id"] for c in data]
        assert "iit-bombay" in ids
        assert "iit-delhi" in ids
        print(f"✓ Compare colleges: {len(data)} colleges compared")
    
    def test_get_cutoffs_iit_bombay(self, api_client):
        """GET /api/colleges/cutoff/iit-bombay should return cutoff data"""
        response = api_client.get(f"{BASE_URL}/api/colleges/cutoff/iit-bombay")
        assert response.status_code == 200
        data = response.json()
        
        assert "college" in data
        assert "cutoffs" in data
        assert "category" in data
        assert data["college"] == "Indian Institute of Technology Bombay"
        assert isinstance(data["cutoffs"], dict)
        print(f"✓ Cutoffs endpoint: {len(data['cutoffs'])} branches returned")

class TestAuth:
    """Authentication endpoints"""
    
    def test_login_student_rohan(self, api_client):
        """POST /api/auth/login with rohan@student.com / student123 should work"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "rohan@student.com",
            "password": "student123"
        })
        assert response.status_code == 200
        data = response.json()
        
        assert "user" in data
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["user"]["email"] == "rohan@student.com"
        assert data["user"]["role"] == "student"
        print(f"✓ Student login: {data['user']['name']}")
    
    def test_login_student_ananya(self, api_client):
        """POST /api/auth/login with ananya@student.com / student123 should work"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "ananya@student.com",
            "password": "student123"
        })
        assert response.status_code == 200
        data = response.json()
        
        assert data["user"]["email"] == "ananya@student.com"
        assert data["user"]["role"] == "student"
        print(f"✓ Student login: {data['user']['name']}")

class TestMentors:
    """Mentors endpoints"""
    
    def test_list_mentors_returns_5(self, api_client):
        """GET /api/mentors should return 5 mentors"""
        response = api_client.get(f"{BASE_URL}/api/mentors")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 5, f"Expected 5 mentors, got {len(data)}"
        
        # Verify structure
        mentor = data[0]
        assert "id" in mentor
        assert "name" in mentor
        assert "college" in mentor
        assert "role" in mentor
        assert mentor["role"] == "mentor"
        print(f"✓ List mentors: {len(data)} mentors returned")

class TestBatches:
    """Batches endpoints"""
    
    def test_list_batches_returns_2(self, api_client):
        """GET /api/batches should return 2 batches"""
        response = api_client.get(f"{BASE_URL}/api/batches")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 2, f"Expected 2 batches, got {len(data)}"
        
        # Verify structure
        batch = data[0]
        assert "id" in batch
        assert "title" in batch
        assert "mentor_name" in batch
        assert "max_students" in batch
        print(f"✓ List batches: {len(data)} batches returned")
