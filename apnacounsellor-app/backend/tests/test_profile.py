"""Profile management tests"""
import pytest

class TestProfile:
    """Profile update and retrieval"""
    
    def test_update_profile_student(self, api_client, base_url, student_token):
        """Test PUT /profile updates student profile"""
        headers = {"Authorization": f"Bearer {student_token}"}
        payload = {
            "phone": "+91-9876543210",
            "bio": "Aspiring engineer preparing for JEE",
            "academic_class": "12th",
            "exam": "JEE Advanced",
            "interests": ["Computer Science", "Mathematics"],
            "budget": "5-10 lakhs",
            "preferred_location": "Mumbai"
        }
        
        response = api_client.put(f"{base_url}/api/profile", json=payload, headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "user" in data
        user = data["user"]
        assert user["phone"] == "+91-9876543210"
        assert user["academic_class"] == "12th"
        assert user["exam"] == "JEE Advanced"
        assert "Computer Science" in user["interests"]
        assert user["profile_complete"] == True
        
        print(f"✓ Profile updated successfully")
        
        # Verify persistence by calling /auth/me
        me_response = api_client.get(f"{base_url}/api/auth/me", headers=headers)
        assert me_response.status_code == 200
        me_user = me_response.json()["user"]
        assert me_user["phone"] == "+91-9876543210"
        assert me_user["exam"] == "JEE Advanced"
        print(f"✓ Profile changes persisted in database")
    
    def test_update_profile_without_auth(self, api_client, base_url):
        """Test PUT /profile without token returns 401"""
        payload = {"bio": "Test bio"}
        response = api_client.put(f"{base_url}/api/profile", json=payload)
        assert response.status_code == 401
        print(f"✓ Profile update correctly requires auth")
    
    def test_get_profile_by_id(self, api_client, base_url):
        """Test GET /profile/{user_id} returns public profile"""
        # Get a mentor ID
        mentors_response = api_client.get(f"{base_url}/api/mentors")
        mentors = mentors_response.json()
        
        if len(mentors) == 0:
            pytest.skip("No mentors available for profile test")
        
        user_id = mentors[0]["id"]
        
        response = api_client.get(f"{base_url}/api/profile/{user_id}")
        assert response.status_code == 200
        
        profile = response.json()
        assert profile["id"] == user_id
        assert "name" in profile
        assert "email" in profile
        assert "password_hash" not in profile
        
        print(f"✓ Public profile retrieved: {profile['name']}")
