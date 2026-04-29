"""Mentor listing and detail endpoints"""
import pytest

class TestMentors:
    """Mentor discovery endpoints"""
    
    def test_list_mentors(self, api_client, base_url):
        """Test GET /mentors returns seeded mentors"""
        response = api_client.get(f"{base_url}/api/mentors")
        assert response.status_code == 200
        
        mentors = response.json()
        assert isinstance(mentors, list)
        assert len(mentors) >= 5  # At least 5 seeded mentors
        
        # Check first mentor structure
        mentor = mentors[0]
        assert "id" in mentor
        assert "name" in mentor
        assert "email" in mentor
        assert "college" in mentor
        assert "branch" in mentor
        assert "skills" in mentor
        assert "rating" in mentor
        assert "pricing" in mentor
        assert mentor["role"] == "mentor"
        assert "password_hash" not in mentor  # Should be excluded
        
        print(f"✓ List mentors returned {len(mentors)} mentors")
    
    def test_list_mentors_with_search(self, api_client, base_url):
        """Test mentor search by name/college"""
        response = api_client.get(f"{base_url}/api/mentors?search=IIT")
        assert response.status_code == 200
        
        mentors = response.json()
        assert isinstance(mentors, list)
        # Should return mentors from IIT colleges
        if len(mentors) > 0:
            assert any("IIT" in m.get("college", "") for m in mentors)
        print(f"✓ Mentor search returned {len(mentors)} results for 'IIT'")
    
    def test_list_mentors_with_skill_filter(self, api_client, base_url):
        """Test mentor filtering by skill"""
        response = api_client.get(f"{base_url}/api/mentors?skill=JEE Advanced")
        assert response.status_code == 200
        
        mentors = response.json()
        assert isinstance(mentors, list)
        # Should return mentors with JEE Advanced skill
        if len(mentors) > 0:
            assert any("JEE Advanced" in m.get("skills", []) for m in mentors)
        print(f"✓ Skill filter returned {len(mentors)} mentors with 'JEE Advanced'")
    
    def test_get_mentor_detail(self, api_client, base_url):
        """Test GET /mentors/{id} returns mentor details"""
        # First get list of mentors
        list_response = api_client.get(f"{base_url}/api/mentors")
        mentors = list_response.json()
        
        if len(mentors) == 0:
            pytest.skip("No mentors available for detail test")
        
        mentor_id = mentors[0]["id"]
        
        # Get mentor detail
        response = api_client.get(f"{base_url}/api/mentors/{mentor_id}")
        assert response.status_code == 200
        
        mentor = response.json()
        assert mentor["id"] == mentor_id
        assert "name" in mentor
        assert "college" in mentor
        assert "bio" in mentor
        assert "availability" in mentor
        assert "password_hash" not in mentor
        
        print(f"✓ Mentor detail retrieved: {mentor['name']} from {mentor['college']}")
    
    def test_get_mentor_invalid_id(self, api_client, base_url):
        """Test GET /mentors/{id} with invalid ID returns 404"""
        response = api_client.get(f"{base_url}/api/mentors/invalid_id_12345")
        assert response.status_code == 404
        print(f"✓ Invalid mentor ID correctly returns 404")
