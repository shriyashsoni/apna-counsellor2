"""Health check and basic connectivity tests"""
import pytest

class TestHealth:
    """Health check endpoint"""
    
    def test_health_check(self, api_client, base_url):
        """Test health endpoint returns 200"""
        response = api_client.get(f"{base_url}/api/health")
        assert response.status_code == 200
        
        data = response.json()
        assert "status" in data
        assert data["status"] == "ok"
        assert "timestamp" in data
        print(f"✓ Health check passed: {data}")
