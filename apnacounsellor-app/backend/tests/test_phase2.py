"""
Phase 2 Backend Tests: Courses, Batches, Reviews, Recordings
Tests all Phase 2 endpoints for AI counseling platform
"""
import pytest
import requests
import os

# Use the public backend URL from the review request
BASE_URL = "https://mentor-hub-135.preview.emergentagent.com"

class TestCourses:
    """Course CRUD and enrollment tests"""

    def test_list_courses_returns_5_seeded(self, api_client, mentor_token):
        """GET /api/courses returns 5 seeded courses"""
        response = api_client.get(f"{BASE_URL}/api/courses")
        assert response.status_code == 200
        courses = response.json()
        assert isinstance(courses, list)
        assert len(courses) == 5, f"Expected 5 courses, got {len(courses)}"
        # Verify course structure
        course = courses[0]
        assert "id" in course
        assert "title" in course
        assert "category" in course
        assert "price" in course
        assert "enrolled_count" in course

    def test_filter_courses_by_category_jee(self, api_client):
        """GET /api/courses?category=JEE filters courses"""
        response = api_client.get(f"{BASE_URL}/api/courses?category=JEE")
        assert response.status_code == 200
        courses = response.json()
        assert isinstance(courses, list)
        # All returned courses should be JEE category
        for course in courses:
            assert course["category"] == "JEE"

    def test_get_course_detail(self, api_client):
        """GET /api/courses/{id} returns course detail"""
        # First get a course ID
        list_response = api_client.get(f"{BASE_URL}/api/courses")
        courses = list_response.json()
        course_id = courses[0]["id"]
        
        # Get course detail
        response = api_client.get(f"{BASE_URL}/api/courses/{course_id}")
        assert response.status_code == 200
        course = response.json()
        assert course["id"] == course_id
        assert "modules" in course
        assert "creator_name" in course

    def test_get_course_not_found(self, api_client):
        """GET /api/courses/{invalid_id} returns 404"""
        response = api_client.get(f"{BASE_URL}/api/courses/invalid_course_id_12345")
        assert response.status_code == 404

    def test_create_course_as_mentor(self, api_client, mentor_token):
        """POST /api/courses (mentor creates course with JWT)"""
        course_data = {
            "title": "TEST_Phase2_Course",
            "description": "Test course for Phase 2 testing",
            "category": "Programming",
            "price": 999,
            "duration": "3 weeks",
            "level": "Intermediate",
            "modules": [
                {"title": "Module 1", "lessons": 5},
                {"title": "Module 2", "lessons": 7}
            ]
        }
        response = api_client.post(
            f"{BASE_URL}/api/courses",
            json=course_data,
            headers={"Authorization": f"Bearer {mentor_token}"}
        )
        assert response.status_code == 200
        course = response.json()
        assert course["title"] == "TEST_Phase2_Course"
        assert course["price"] == 999
        assert len(course["modules"]) == 2
        
        # Verify persistence with GET
        get_response = api_client.get(f"{BASE_URL}/api/courses/{course['id']}")
        assert get_response.status_code == 200
        assert get_response.json()["title"] == "TEST_Phase2_Course"

    def test_create_course_requires_auth(self, api_client):
        """POST /api/courses requires authentication"""
        course_data = {"title": "Test", "description": "Test"}
        response = api_client.post(f"{BASE_URL}/api/courses", json=course_data)
        assert response.status_code == 401

    def test_enroll_in_course(self, api_client, student_token):
        """POST /api/courses/{id}/enroll (student enrolls)"""
        # Get a course
        list_response = api_client.get(f"{BASE_URL}/api/courses")
        course_id = list_response.json()[0]["id"]
        
        # Enroll
        response = api_client.post(
            f"{BASE_URL}/api/courses/{course_id}/enroll",
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 200
        enrollment = response.json()
        assert enrollment["course_id"] == course_id
        assert "enrolled_at" in enrollment
        
        # Verify enrollment persisted
        enrolled_response = api_client.get(
            f"{BASE_URL}/api/courses/my/enrolled",
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert enrolled_response.status_code == 200
        enrollments = enrolled_response.json()
        assert any(e["course_id"] == course_id for e in enrollments)

    def test_get_my_enrolled_courses(self, api_client, student_token):
        """GET /api/courses/my/enrolled returns enrollments"""
        response = api_client.get(
            f"{BASE_URL}/api/courses/my/enrolled",
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 200
        enrollments = response.json()
        assert isinstance(enrollments, list)


class TestReviews:
    """Review system tests"""

    def test_create_review_for_mentor(self, api_client, student_token):
        """POST /api/reviews (student reviews mentor)"""
        # Get a mentor ID
        mentors_response = api_client.get(f"{BASE_URL}/api/mentors")
        mentor_id = mentors_response.json()[0]["id"]
        
        review_data = {
            "mentor_id": mentor_id,
            "rating": 5,
            "comment": "TEST_Excellent mentor! Very helpful and knowledgeable."
        }
        response = api_client.post(
            f"{BASE_URL}/api/reviews",
            json=review_data,
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 200
        review = response.json()
        assert review["mentor_id"] == mentor_id
        assert review["rating"] == 5
        assert "TEST_Excellent" in review["comment"]
        
        # Verify review persisted
        get_response = api_client.get(f"{BASE_URL}/api/reviews/{mentor_id}")
        assert get_response.status_code == 200
        reviews = get_response.json()
        assert any("TEST_Excellent" in r["comment"] for r in reviews)

    def test_get_reviews_for_mentor(self, api_client):
        """GET /api/reviews/{mentor_id} returns reviews"""
        # Get a mentor ID
        mentors_response = api_client.get(f"{BASE_URL}/api/mentors")
        mentor_id = mentors_response.json()[0]["id"]
        
        response = api_client.get(f"{BASE_URL}/api/reviews/{mentor_id}")
        assert response.status_code == 200
        reviews = response.json()
        assert isinstance(reviews, list)

    def test_review_requires_auth(self, api_client):
        """POST /api/reviews requires authentication"""
        review_data = {"mentor_id": "test", "rating": 5, "comment": "Test"}
        response = api_client.post(f"{BASE_URL}/api/reviews", json=review_data)
        assert response.status_code == 401


class TestBatches:
    """Batch mentorship tests"""

    def test_list_batches_returns_3_seeded(self, api_client):
        """GET /api/batches returns 3 seeded batches"""
        response = api_client.get(f"{BASE_URL}/api/batches")
        assert response.status_code == 200
        batches = response.json()
        assert isinstance(batches, list)
        assert len(batches) == 3, f"Expected 3 batches, got {len(batches)}"
        # Verify batch structure
        batch = batches[0]
        assert "id" in batch
        assert "title" in batch
        assert "mentor_name" in batch
        assert "max_students" in batch
        assert "current_students" in batch

    def test_get_batch_detail(self, api_client):
        """GET /api/batches/{id} returns batch detail"""
        # Get a batch ID
        list_response = api_client.get(f"{BASE_URL}/api/batches")
        batch_id = list_response.json()[0]["id"]
        
        response = api_client.get(f"{BASE_URL}/api/batches/{batch_id}")
        assert response.status_code == 200
        batch = response.json()
        assert batch["id"] == batch_id
        assert "schedule" in batch
        assert "topics" in batch

    def test_join_batch(self, api_client, student_token):
        """POST /api/batches/{id}/join (student joins batch)"""
        # Get a batch
        list_response = api_client.get(f"{BASE_URL}/api/batches")
        batch_id = list_response.json()[0]["id"]
        
        response = api_client.post(
            f"{BASE_URL}/api/batches/{batch_id}/join",
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 200
        result = response.json()
        assert "message" in result
        
        # Verify join persisted
        batch_response = api_client.get(f"{BASE_URL}/api/batches/{batch_id}")
        batch = batch_response.json()
        # current_students should have increased (but we can't verify exact count due to other tests)
        assert batch["current_students"] >= 1

    def test_join_batch_requires_auth(self, api_client):
        """POST /api/batches/{id}/join requires authentication"""
        response = api_client.post(f"{BASE_URL}/api/batches/test_id/join")
        assert response.status_code == 401


class TestRecordings:
    """Session recording tests"""

    def test_add_recording_to_session(self, api_client, mentor_token):
        """POST /api/sessions/{id}/recording (add recording)"""
        # First create a session
        mentors = api_client.get(f"{BASE_URL}/api/mentors").json()
        mentor_id = mentors[0]["id"]
        
        # Register a student and book a session
        student_data = {
            "name": "TEST_Recording_Student",
            "email": f"test_recording_{os.urandom(4).hex()}@example.com",
            "password": "test123",
            "role": "student"
        }
        student_response = api_client.post(f"{BASE_URL}/api/auth/register", json=student_data)
        student_token = student_response.json()["access_token"]
        
        booking_data = {
            "mentor_id": mentor_id,
            "date": "2026-05-15",
            "time_slot": "10:00 AM",
            "topic": "Test Session"
        }
        session_response = api_client.post(
            f"{BASE_URL}/api/sessions/book",
            json=booking_data,
            headers={"Authorization": f"Bearer {student_token}"}
        )
        session_id = session_response.json()["id"]
        
        # Add recording
        recording_data = {
            "session_id": session_id,
            "recording_url": "https://example.com/recording.mp4",
            "duration": "45 minutes"
        }
        response = api_client.post(
            f"{BASE_URL}/api/sessions/{session_id}/recording",
            json=recording_data,
            headers={"Authorization": f"Bearer {mentor_token}"}
        )
        assert response.status_code == 200
        recording = response.json()
        assert recording["session_id"] == session_id
        assert recording["recording_url"] == "https://example.com/recording.mp4"

    def test_get_recordings(self, api_client, student_token):
        """GET /api/recordings returns user recordings"""
        response = api_client.get(
            f"{BASE_URL}/api/recordings",
            headers={"Authorization": f"Bearer {student_token}"}
        )
        assert response.status_code == 200
        recordings = response.json()
        assert isinstance(recordings, list)

    def test_recordings_require_auth(self, api_client):
        """GET /api/recordings requires authentication"""
        response = api_client.get(f"{BASE_URL}/api/recordings")
        assert response.status_code == 401


@pytest.fixture
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture
def mentor_token(api_client):
    """Get mentor JWT token"""
    login_data = {"email": "arjun@iitb.ac.in", "password": "mentor123"}
    response = api_client.post(f"{BASE_URL}/api/auth/login", json=login_data)
    if response.status_code != 200:
        pytest.skip("Mentor login failed")
    return response.json()["access_token"]


@pytest.fixture
def student_token(api_client):
    """Create and return student JWT token"""
    student_data = {
        "name": "TEST_Phase2_Student",
        "email": f"test_phase2_{os.urandom(4).hex()}@example.com",
        "password": "test123",
        "role": "student"
    }
    response = api_client.post(f"{BASE_URL}/api/auth/register", json=student_data)
    if response.status_code != 200:
        pytest.skip("Student registration failed")
    return response.json()["access_token"]
