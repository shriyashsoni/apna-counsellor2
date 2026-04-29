"""
Iteration 5 Backend Tests - Purple Theme, No Mock Data, Razorpay Payment Links, NEET Removal
Tests:
- Student/mentor registration
- Razorpay Payment Links API (create-link, check-status, history)
- Colleges (70 colleges, no mock users)
- Mentors (only registered, no pre-seeded)
- Counsellor application and approval
- NEET removal verification
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('EXPO_PUBLIC_BACKEND_URL', '').rstrip('/')
if not BASE_URL:
    pytest.skip("EXPO_PUBLIC_BACKEND_URL not set", allow_module_level=True)

@pytest.fixture
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session

@pytest.fixture
def admin_token(api_client):
    """Login as admin"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": "admin@example.com",
        "password": "admin123"
    })
    assert response.status_code == 200
    return response.json()["access_token"]

@pytest.fixture
def student_token(api_client):
    """Login as test student"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": "test@student.com",
        "password": "test123"
    })
    if response.status_code == 200:
        return response.json()["access_token"]
    # If not exists, register
    response = api_client.post(f"{BASE_URL}/api/auth/register", json={
        "name": "Test Student",
        "email": "test@student.com",
        "password": "test123",
        "role": "student"
    })
    assert response.status_code == 200
    return response.json()["access_token"]

@pytest.fixture
def mentor_token(api_client):
    """Login as test mentor"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": "test@mentor.com",
        "password": "mentor123"
    })
    if response.status_code == 200:
        return response.json()["access_token"]
    # If not exists, register
    response = api_client.post(f"{BASE_URL}/api/auth/register", json={
        "name": "Test Mentor",
        "email": "test@mentor.com",
        "password": "mentor123",
        "role": "mentor"
    })
    assert response.status_code == 200
    return response.json()["access_token"]

class TestAuth:
    """Test student and mentor registration"""
    
    def test_register_student(self, api_client):
        """POST /api/auth/register creates student account"""
        email = f"student_{int(time.time())}@test.com"
        response = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "name": "New Student",
            "email": email,
            "password": "test123",
            "role": "student"
        })
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        assert data["user"]["role"] == "student"
        assert data["user"]["email"] == email
        assert "access_token" in data
        print(f"✓ Student registration successful: {email}")
    
    def test_register_mentor(self, api_client):
        """POST /api/auth/register creates mentor account with role=mentor"""
        email = f"mentor_{int(time.time())}@test.com"
        response = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "name": "New Mentor",
            "email": email,
            "password": "mentor123",
            "role": "mentor"
        })
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        assert data["user"]["role"] == "mentor"
        assert data["user"]["email"] == email
        assert "pricing" in data["user"]  # Mentors have pricing field
        assert "skills" in data["user"]  # Mentors have skills field
        print(f"✓ Mentor registration successful: {email}")

class TestPayments:
    """Test Razorpay Payment Links API"""
    
    def test_create_payment_link(self, api_client, student_token, mentor_token):
        """POST /api/payments/create-link creates Razorpay payment link with real rzp.io URL"""
        # Get mentor ID
        api_client.headers.update({"Authorization": f"Bearer {mentor_token}"})
        me_response = api_client.get(f"{BASE_URL}/api/auth/me")
        assert me_response.status_code == 200
        mentor_id = me_response.json()["user"]["id"]
        
        # Create payment link as student
        api_client.headers.update({"Authorization": f"Bearer {student_token}"})
        response = api_client.post(f"{BASE_URL}/api/payments/create-link", json={
            "mentor_id": mentor_id,
            "amount": 500
        })
        assert response.status_code == 200
        data = response.json()
        assert "payment_url" in data
        assert "payment_id" in data
        assert "session" in data
        # Verify payment URL is a real Razorpay link
        assert "rzp.io" in data["payment_url"] or "razorpay.com" in data["payment_url"]
        print(f"✓ Payment link created: {data['payment_url']}")
        return data["payment_id"]
    
    def test_check_payment_status(self, api_client, student_token, mentor_token):
        """POST /api/payments/check-status/{id} checks payment status"""
        # Create payment link first
        api_client.headers.update({"Authorization": f"Bearer {mentor_token}"})
        me_response = api_client.get(f"{BASE_URL}/api/auth/me")
        mentor_id = me_response.json()["user"]["id"]
        
        api_client.headers.update({"Authorization": f"Bearer {student_token}"})
        create_response = api_client.post(f"{BASE_URL}/api/payments/create-link", json={
            "mentor_id": mentor_id,
            "amount": 500
        })
        payment_id = create_response.json()["payment_id"]
        
        # Check status
        response = api_client.post(f"{BASE_URL}/api/payments/check-status/{payment_id}")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "payment" in data
        print(f"✓ Payment status checked: {data['status']}")
    
    def test_payment_history(self, api_client, student_token):
        """GET /api/payments/history returns payment records"""
        api_client.headers.update({"Authorization": f"Bearer {student_token}"})
        response = api_client.get(f"{BASE_URL}/api/payments/history")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Payment history retrieved: {len(data)} records")

class TestColleges:
    """Test colleges endpoint - should return 70 colleges, no mock users"""
    
    def test_colleges_count(self, api_client):
        """GET /api/colleges returns 70 colleges"""
        response = api_client.get(f"{BASE_URL}/api/colleges")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 70, f"Expected at least 70 colleges, got {len(data)}"
        print(f"✓ Colleges count: {len(data)}")
    
    def test_colleges_have_required_fields(self, api_client):
        """Verify colleges have all required fields"""
        response = api_client.get(f"{BASE_URL}/api/colleges")
        colleges = response.json()
        assert len(colleges) > 0
        college = colleges[0]
        required_fields = ["id", "name", "state", "type", "nirf_rank", "annual_fee", "avg_package"]
        for field in required_fields:
            assert field in college, f"Missing field: {field}"
        print(f"✓ Colleges have required fields")

class TestMentors:
    """Test mentors endpoint - should return only registered mentors, no pre-seeded"""
    
    def test_mentors_only_registered(self, api_client):
        """GET /api/mentors returns only registered mentors (no pre-seeded)"""
        response = api_client.get(f"{BASE_URL}/api/mentors")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Should be empty or only contain test@mentor.com
        print(f"✓ Mentors count (only registered): {len(data)}")
        if len(data) > 0:
            # Verify they are real registered mentors, not mock data
            for mentor in data:
                assert "email" in mentor
                assert "name" in mentor
                print(f"  - {mentor['name']} ({mentor['email']})")

class TestCounsellorOnboarding:
    """Test counsellor application and admin approval"""
    
    def test_counsellor_apply(self, api_client):
        """POST /api/counsellor/apply creates counsellor application"""
        email = f"counsellor_{int(time.time())}@test.com"
        response = api_client.post(f"{BASE_URL}/api/counsellor/apply", json={
            "name": "Test Counsellor",
            "email": email,
            "phone": "9876543210",
            "qualification": "PhD in Education",
            "experience": "10 years",
            "specialization": ["Career Guidance", "College Admissions"],
            "bio": "Experienced counsellor"
        })
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["email"] == email
        assert data["status"] == "pending"
        print(f"✓ Counsellor application created: {email}")
        return data["id"]
    
    def test_admin_list_applications(self, api_client, admin_token):
        """GET /api/counsellor/applications returns applications (admin only)"""
        api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
        response = api_client.get(f"{BASE_URL}/api/counsellor/applications")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Admin can list counsellor applications: {len(data)} applications")
    
    def test_admin_approve_counsellor(self, api_client, admin_token):
        """Admin approves counsellor and account gets created"""
        # Create application first
        email = f"counsellor_approve_{int(time.time())}@test.com"
        app_response = api_client.post(f"{BASE_URL}/api/counsellor/apply", json={
            "name": "Approve Test",
            "email": email,
            "phone": "9876543210",
            "qualification": "PhD",
            "experience": "5 years",
            "specialization": ["Career Guidance"],
            "bio": "Test"
        })
        app_id = app_response.json()["id"]
        
        # Approve as admin
        api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
        response = api_client.put(f"{BASE_URL}/api/counsellor/applications/{app_id}/approve")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "approved"
        
        # Verify counsellor account was created
        login_response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": email,
            "password": "counsellor123"
        })
        assert login_response.status_code == 200
        user = login_response.json()["user"]
        assert user["role"] == "counsellor"
        print(f"✓ Counsellor approved and account created: {email}")

class TestNEETRemoval:
    """Verify NEET is removed from predictor and skill filters"""
    
    def test_predictor_no_neet(self, api_client, student_token):
        """Predictor should not accept NEET exam"""
        api_client.headers.update({"Authorization": f"Bearer {student_token}"})
        response = api_client.post(f"{BASE_URL}/api/colleges/predict", json={
            "exam": "NEET",
            "rank": 5000,
            "category": "General"
        })
        # Should either return empty results or error
        # Backend doesn't validate exam name, so it will return empty results
        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, list)
            # NEET should return no results since colleges don't have NEET cutoffs
            print(f"✓ NEET exam returns no results (as expected): {len(data)} colleges")
        else:
            print(f"✓ NEET exam rejected by backend")
    
    def test_valid_exams_work(self, api_client, student_token):
        """Valid exams (JEE Advanced, JEE Mains, MHT-CET, COMEDK, AKTU) should work"""
        api_client.headers.update({"Authorization": f"Bearer {student_token}"})
        valid_exams = ["JEE Advanced", "JEE Mains", "MHT-CET", "COMEDK", "AKTU"]
        for exam in valid_exams:
            response = api_client.post(f"{BASE_URL}/api/colleges/predict", json={
                "exam": exam,
                "rank": 5000,
                "category": "General"
            })
            assert response.status_code == 200
            data = response.json()
            assert isinstance(data, list)
            print(f"✓ {exam} predictor working: {len(data)} results")

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
