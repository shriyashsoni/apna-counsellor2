"""AI features - chat and college recommendations"""
import pytest
import time

class TestAI:
    """AI-powered features"""
    
    def test_ai_chat(self, api_client, base_url, student_token):
        """Test POST /ai/chat returns AI response"""
        headers = {"Authorization": f"Bearer {student_token}"}
        payload = {
            "message": "What are the best strategies for JEE preparation?"
        }
        
        response = api_client.post(f"{base_url}/api/ai/chat", json=payload, headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "response" in data
        assert "session_id" in data
        assert len(data["response"]) > 0
        
        print(f"✓ AI chat response received: {data['response'][:100]}...")
        
        # Test follow-up message with session_id
        time.sleep(1)  # Brief pause for AI processing
        payload2 = {
            "message": "Tell me more about time management",
            "session_id": data["session_id"]
        }
        
        response2 = api_client.post(f"{base_url}/api/ai/chat", json=payload2, headers=headers)
        assert response2.status_code == 200
        data2 = response2.json()
        assert data2["session_id"] == data["session_id"]
        print(f"✓ AI chat follow-up successful")
    
    def test_ai_chat_without_auth(self, api_client, base_url):
        """Test AI chat without token returns 401"""
        payload = {"message": "Test message"}
        response = api_client.post(f"{base_url}/api/ai/chat", json=payload)
        assert response.status_code == 401
        print(f"✓ AI chat correctly requires auth")
    
    def test_college_recommend(self, api_client, base_url, student_token):
        """Test POST /ai/college-recommend returns college list"""
        headers = {"Authorization": f"Bearer {student_token}"}
        payload = {
            "exam": "JEE Advanced",
            "marks": "250/360",
            "rank": "5000",
            "interests": ["Computer Science", "AI/ML"],
            "budget": "5-10 lakhs",
            "preferred_location": "Mumbai"
        }
        
        response = api_client.post(f"{base_url}/api/ai/college-recommend", json=payload, headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "colleges" in data
        colleges = data["colleges"]
        assert isinstance(colleges, list)
        assert len(colleges) > 0
        
        # Check college structure
        college = colleges[0]
        assert "name" in college
        assert "location" in college
        assert "course" in college
        assert "admission_probability" in college
        assert "annual_fee" in college
        assert "why_fit" in college
        
        print(f"✓ College recommendations received: {len(colleges)} colleges")
        print(f"  First recommendation: {college['name']} - {college['admission_probability']}")
    
    def test_profile_analysis(self, api_client, base_url, student_token):
        """Test POST /ai/profile-analysis returns SWOT analysis"""
        headers = {"Authorization": f"Bearer {student_token}"}
        
        response = api_client.post(f"{base_url}/api/ai/profile-analysis", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "strengths" in data
        assert "weaknesses" in data
        assert "opportunities" in data
        assert "actions" in data
        assert "overall_score" in data
        
        assert isinstance(data["strengths"], list)
        assert isinstance(data["actions"], list)
        assert isinstance(data["overall_score"], (int, float))
        
        print(f"✓ Profile analysis received: Score {data['overall_score']}/100")
        print(f"  Strengths: {len(data['strengths'])}, Actions: {len(data['actions'])}")
    
    def test_chat_history(self, api_client, base_url, student_token):
        """Test GET /ai/chat/history/{session_id} returns chat history"""
        headers = {"Authorization": f"Bearer {student_token}"}
        
        # First create a chat session
        chat_response = api_client.post(f"{base_url}/api/ai/chat", json={
            "message": "Hello AI"
        }, headers=headers)
        
        session_id = chat_response.json()["session_id"]
        
        # Get history
        response = api_client.get(f"{base_url}/api/ai/chat/history/{session_id}", headers=headers)
        assert response.status_code == 200
        
        history = response.json()
        assert isinstance(history, list)
        assert len(history) >= 2  # User message + AI response
        
        # Check message structure
        msg = history[0]
        assert "role" in msg
        assert "content" in msg
        assert "timestamp" in msg
        
        print(f"✓ Chat history retrieved: {len(history)} messages")
