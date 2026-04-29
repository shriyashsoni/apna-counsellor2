"""Session booking and retrieval tests"""
import pytest

class TestSessions:
    """Session booking endpoints"""
    
    def test_book_session_success(self, api_client, base_url, student_token):
        """Test POST /sessions/book creates a session"""
        # Get a mentor first
        mentors_response = api_client.get(f"{base_url}/api/mentors")
        mentors = mentors_response.json()
        
        if len(mentors) == 0:
            pytest.skip("No mentors available for booking test")
        
        mentor_id = mentors[0]["id"]
        
        # Book session
        headers = {"Authorization": f"Bearer {student_token}"}
        payload = {
            "mentor_id": mentor_id,
            "date": "2026-05-01",
            "time_slot": "10:00 AM - 11:00 AM",
            "topic": "JEE Preparation Strategy"
        }
        
        response = api_client.post(f"{base_url}/api/sessions/book", json=payload, headers=headers)
        assert response.status_code == 200
        
        session = response.json()
        assert "id" in session
        assert session["mentor_id"] == mentor_id
        assert session["date"] == "2026-05-01"
        assert session["time_slot"] == "10:00 AM - 11:00 AM"
        assert session["status"] == "pending"
        assert "student_id" in session
        assert "price" in session
        
        print(f"✓ Session booked successfully: {session['id']}")
        
        # Verify session persisted by fetching sessions
        get_response = api_client.get(f"{base_url}/api/sessions", headers=headers)
        assert get_response.status_code == 200
        sessions = get_response.json()
        assert any(s["id"] == session["id"] for s in sessions)
        print(f"✓ Session verified in GET /sessions")
    
    def test_book_session_invalid_mentor(self, api_client, base_url, student_token):
        """Test booking with invalid mentor ID returns 404"""
        headers = {"Authorization": f"Bearer {student_token}"}
        payload = {
            "mentor_id": "invalid_mentor_id",
            "date": "2026-05-01",
            "time_slot": "10:00 AM - 11:00 AM"
        }
        
        response = api_client.post(f"{base_url}/api/sessions/book", json=payload, headers=headers)
        assert response.status_code == 404
        print(f"✓ Invalid mentor ID correctly rejected")
    
    def test_get_sessions_student(self, api_client, base_url, student_token):
        """Test GET /sessions returns student's sessions"""
        headers = {"Authorization": f"Bearer {student_token}"}
        response = api_client.get(f"{base_url}/api/sessions", headers=headers)
        
        assert response.status_code == 200
        sessions = response.json()
        assert isinstance(sessions, list)
        print(f"✓ Student sessions retrieved: {len(sessions)} sessions")
    
    def test_get_sessions_without_auth(self, api_client, base_url):
        """Test GET /sessions without token returns 401"""
        response = api_client.get(f"{base_url}/api/sessions")
        assert response.status_code == 401
        print(f"✓ Sessions endpoint correctly requires auth")
