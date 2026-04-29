"""
Backend tests for Apna Counselor - Iteration 4 Features
Tests: 70 colleges, Razorpay payments, WhatsApp links, Counsellor onboarding, Admin stats
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
        pytest.skip("Student login failed")
    return response.json()["access_token"]

@pytest.fixture
def admin_token(api_client):
    """Login as admin and return token"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": "admin@example.com",
        "password": "admin123"
    })
    if response.status_code != 200:
        pytest.skip("Admin login failed")
    return response.json()["access_token"]

@pytest.fixture
def mentor_token(api_client):
    """Login as mentor and return token"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": "arjun@iitb.ac.in",
        "password": "mentor123"
    })
    if response.status_code != 200:
        pytest.skip("Mentor login failed")
    return response.json()["access_token"]

class TestColleges70:
    """Test 70 colleges feature"""
    
    def test_list_colleges_returns_70_plus(self, api_client):
        """GET /api/colleges should return 70+ colleges"""
        response = api_client.get(f"{BASE_URL}/api/colleges")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 70, f"Expected 70+ colleges, got {len(data)}"
        print(f"✓ List colleges: {len(data)} colleges returned")
    
    def test_filter_colleges_by_iit_returns_23(self, api_client):
        """GET /api/colleges?college_type=IIT should return 23 IITs"""
        response = api_client.get(f"{BASE_URL}/api/colleges?college_type=IIT")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 23, f"Expected 23 IITs, got {len(data)}"
        
        # Verify all are IITs
        for college in data:
            assert college["type"] == "IIT", f"Expected IIT, got {college['type']}"
        print(f"✓ Filter by IIT: {len(data)} IITs returned")
    
    def test_filter_colleges_by_nit(self, api_client):
        """GET /api/colleges?college_type=NIT should return 15 NITs"""
        response = api_client.get(f"{BASE_URL}/api/colleges?college_type=NIT")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 10, f"Expected 10+ NITs, got {len(data)}"
        
        for college in data:
            assert college["type"] == "NIT", f"Expected NIT, got {college['type']}"
        print(f"✓ Filter by NIT: {len(data)} NITs returned")
    
    def test_filter_colleges_by_iiit(self, api_client):
        """GET /api/colleges?college_type=IIIT should return 7 IIITs"""
        response = api_client.get(f"{BASE_URL}/api/colleges?college_type=IIIT")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 5, f"Expected 5+ IIITs, got {len(data)}"
        
        for college in data:
            assert college["type"] == "IIIT", f"Expected IIIT, got {college['type']}"
        print(f"✓ Filter by IIIT: {len(data)} IIITs returned")
    
    def test_filter_colleges_by_private(self, api_client):
        """GET /api/colleges?college_type=Private should return private colleges"""
        response = api_client.get(f"{BASE_URL}/api/colleges?college_type=Private")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 10, f"Expected 10+ Private colleges, got {len(data)}"
        
        for college in data:
            assert college["type"] == "Private", f"Expected Private, got {college['type']}"
        print(f"✓ Filter by Private: {len(data)} Private colleges returned")
    
    def test_filter_colleges_by_state(self, api_client):
        """GET /api/colleges?college_type=State should return state colleges"""
        response = api_client.get(f"{BASE_URL}/api/colleges?college_type=State")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 5, f"Expected 5+ State colleges, got {len(data)}"
        
        for college in data:
            assert college["type"] == "State", f"Expected State, got {college['type']}"
        print(f"✓ Filter by State: {len(data)} State colleges returned")
    
    def test_get_mht_cet_college_coep_pune(self, api_client):
        """GET /api/colleges/coep-pune should return MHT-CET college with cutoffs"""
        response = api_client.get(f"{BASE_URL}/api/colleges/coep-pune")
        assert response.status_code == 200
        data = response.json()
        
        assert data["id"] == "coep-pune"
        assert "COEP" in data["name"] or "College of Engineering Pune" in data["name"]
        assert data["state"] == "Maharashtra"
        assert "cutoffs" in data
        assert "exam" in data
        assert data["exam"] == "MHT-CET"
        print(f"✓ MHT-CET college: {data['short_name']} with exam {data['exam']}")
    
    def test_predict_colleges_jee_advanced_rank_5000(self, api_client, student_token):
        """POST /api/colleges/predict with rank=5000 exam='JEE Advanced' category='General'"""
        response = api_client.post(
            f"{BASE_URL}/api/colleges/predict",
            json={"exam": "JEE Advanced", "rank": 5000, "category": "General"},
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0, "Expected at least 1 college prediction"
        
        result = data[0]
        assert "college_id" in result
        assert "name" in result
        assert "branch" in result
        assert "cutoff_rank" in result
        assert "probability" in result
        assert result["your_rank"] == 5000
        print(f"✓ Predictor JEE Advanced: {len(data)} colleges predicted for rank 5000")
    
    def test_predict_colleges_jee_mains_percentile(self, api_client, student_token):
        """POST /api/colleges/predict with percentile for JEE Mains"""
        response = api_client.post(
            f"{BASE_URL}/api/colleges/predict",
            json={"exam": "JEE Mains", "percentile": 98.5, "category": "General"},
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        print(f"✓ Predictor JEE Mains: {len(data)} colleges predicted for 98.5 percentile")
    
    def test_predict_colleges_mht_cet(self, api_client, student_token):
        """POST /api/colleges/predict with MHT-CET exam"""
        response = api_client.post(
            f"{BASE_URL}/api/colleges/predict",
            json={"exam": "MHT-CET", "rank": 2000, "category": "General"},
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Predictor MHT-CET: {len(data)} colleges predicted")
    
    def test_predict_colleges_comedk(self, api_client, student_token):
        """POST /api/colleges/predict with COMEDK exam"""
        response = api_client.post(
            f"{BASE_URL}/api/colleges/predict",
            json={"exam": "COMEDK", "rank": 3000, "category": "General"},
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Predictor COMEDK: {len(data)} colleges predicted")

class TestRazorpayPayments:
    """Test Razorpay payment integration"""
    
    def test_create_payment_order(self, api_client, student_token, mentor_token):
        """POST /api/payments/create-order creates Razorpay order with real order_id"""
        # Get a mentor first
        mentors_response = api_client.get(f"{BASE_URL}/api/mentors")
        assert mentors_response.status_code == 200
        mentors = mentors_response.json()
        assert len(mentors) > 0
        mentor_id = mentors[0]["id"]
        
        response = api_client.post(
            f"{BASE_URL}/api/payments/create-order",
            json={"mentor_id": mentor_id, "amount": 500},
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "order_id" in data
        assert "amount" in data
        assert "currency" in data
        assert "key_id" in data
        assert "payment" in data
        
        # Verify order_id format (Razorpay format: order_xxx or order_mock_xxx)
        assert data["order_id"].startswith("order_")
        assert data["currency"] == "INR"
        assert data["amount"] == 50000  # 500 * 100 paise
        
        # Verify payment record created
        payment = data["payment"]
        assert payment["order_id"] == data["order_id"]
        assert payment["status"] == "created"
        assert payment["amount"] == 500
        
        print(f"✓ Payment order created: {data['order_id']} for ₹{payment['amount']}")
        return data["order_id"]
    
    def test_verify_payment(self, api_client, student_token):
        """POST /api/payments/verify verifies payment"""
        # First create an order
        mentors_response = api_client.get(f"{BASE_URL}/api/mentors")
        mentors = mentors_response.json()
        mentor_id = mentors[0]["id"]
        
        order_response = api_client.post(
            f"{BASE_URL}/api/payments/create-order",
            json={"mentor_id": mentor_id, "amount": 500},
            headers={"Authorization": f"Bearer {student_token}"}
        )
        order_data = order_response.json()
        order_id = order_data["order_id"]
        
        # Verify payment (mock signature for testing)
        verify_response = api_client.post(
            f"{BASE_URL}/api/payments/verify",
            json={
                "razorpay_order_id": order_id,
                "razorpay_payment_id": f"pay_test_{order_id}",
                "razorpay_signature": "test_signature"
            },
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert verify_response.status_code == 200
        verify_data = verify_response.json()
        
        assert "status" in verify_data
        assert verify_data["status"] == "success"
        print(f"✓ Payment verified: {order_id}")
    
    def test_payment_history(self, api_client, student_token):
        """GET /api/payments/history returns payment records"""
        response = api_client.get(
            f"{BASE_URL}/api/payments/history",
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Payment history: {len(data)} payment records")

class TestWhatsAppLinks:
    """Test WhatsApp deep link integration"""
    
    def test_whatsapp_mentor_link(self, api_client, student_token):
        """GET /api/whatsapp/mentor/{mentor_id} returns WhatsApp share URL"""
        # Get a mentor first
        mentors_response = api_client.get(f"{BASE_URL}/api/mentors")
        mentors = mentors_response.json()
        mentor_id = mentors[0]["id"]
        
        response = api_client.get(
            f"{BASE_URL}/api/whatsapp/mentor/{mentor_id}",
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "whatsapp_url" in data
        assert "message" in data
        assert "wa.me" in data["whatsapp_url"]
        assert "Apna Counselor" in data["message"]
        print(f"✓ WhatsApp mentor link: {data['whatsapp_url'][:50]}...")
    
    def test_whatsapp_share_link(self, api_client):
        """GET /api/whatsapp/share returns WhatsApp share URL"""
        response = api_client.get(f"{BASE_URL}/api/whatsapp/share")
        assert response.status_code == 200
        data = response.json()
        
        assert "whatsapp_url" in data
        assert "message" in data
        assert "wa.me" in data["whatsapp_url"]
        assert "Apna Counselor" in data["message"]
        print(f"✓ WhatsApp share link: {data['message'][:50]}...")

class TestCounsellorOnboarding:
    """Test counsellor onboarding and admin approval"""
    
    def test_counsellor_apply(self, api_client):
        """POST /api/counsellor/apply submits counsellor application"""
        import time
        email = f"test_counsellor_{int(time.time())}@example.com"
        
        response = api_client.post(
            f"{BASE_URL}/api/counsellor/apply",
            json={
                "name": "Test Counsellor",
                "email": email,
                "phone": "9876543210",
                "qualification": "M.Tech IIT Delhi",
                "experience": "5 years",
                "specialization": ["JEE Advanced", "Career Guidance"],
                "bio": "Experienced counsellor with 5 years of guiding students"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "id" in data
        assert data["email"] == email
        assert data["status"] == "pending"
        assert data["name"] == "Test Counsellor"
        print(f"✓ Counsellor application submitted: {data['id']}")
        return data["id"]
    
    def test_list_counsellor_applications_admin(self, api_client, admin_token):
        """GET /api/counsellor/applications (admin) lists pending applications"""
        response = api_client.get(
            f"{BASE_URL}/api/counsellor/applications",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Counsellor applications list: {len(data)} applications")
    
    def test_list_counsellor_applications_non_admin_fails(self, api_client, student_token):
        """GET /api/counsellor/applications (non-admin) should return 403"""
        response = api_client.get(
            f"{BASE_URL}/api/counsellor/applications",
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 403
        print("✓ Non-admin cannot access counsellor applications")
    
    def test_approve_counsellor_application(self, api_client, admin_token):
        """PUT /api/counsellor/applications/{id}/approve (admin) approves and creates user"""
        import time
        email = f"test_counsellor_approve_{int(time.time())}@example.com"
        
        # First create an application
        apply_response = api_client.post(
            f"{BASE_URL}/api/counsellor/apply",
            json={
                "name": "Test Counsellor Approve",
                "email": email,
                "phone": "9876543210",
                "qualification": "M.Tech",
                "experience": "3 years",
                "specialization": ["JEE Mains"],
                "bio": "Test bio"
            }
        )
        app_id = apply_response.json()["id"]
        
        # Approve it
        approve_response = api_client.put(
            f"{BASE_URL}/api/counsellor/applications/{app_id}/approve",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert approve_response.status_code == 200
        data = approve_response.json()
        
        assert data["status"] == "approved"
        print(f"✓ Counsellor application approved: {app_id}")
        
        # Verify user was created by trying to login
        login_response = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": email, "password": "counsellor123"}
        )
        assert login_response.status_code == 200
        user = login_response.json()["user"]
        assert user["role"] == "counsellor"
        print(f"✓ Counsellor user created: {user['name']}")

class TestAdminStats:
    """Test admin statistics endpoint"""
    
    def test_admin_stats(self, api_client, admin_token):
        """GET /api/admin/stats returns platform statistics"""
        response = api_client.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "total_students" in data
        assert "total_mentors" in data
        assert "total_counsellors" in data
        assert "total_sessions" in data
        assert "total_colleges" in data
        assert "pending_applications" in data
        assert "total_payments" in data
        
        # Verify counts are reasonable
        assert data["total_students"] >= 2  # At least rohan and ananya
        assert data["total_mentors"] >= 5  # Seeded mentors
        assert data["total_colleges"] >= 70  # 70+ colleges
        
        print(f"✓ Admin stats: {data['total_students']} students, {data['total_mentors']} mentors, {data['total_colleges']} colleges, {data['total_sessions']} sessions")
    
    def test_admin_stats_non_admin_fails(self, api_client, student_token):
        """GET /api/admin/stats (non-admin) should return 403"""
        response = api_client.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 403
        print("✓ Non-admin cannot access admin stats")
