from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends
from starlette.middleware.cors import CORSMiddleware
import os, logging, bcrypt, jwt, uuid, httpx, asyncio
from urllib.parse import urljoin, urlparse
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel
from typing import List, Optional
from supabase_client import supabase, supabase_query, supabase_upsert, clean_user
import razorpay
import hmac, hashlib
from urllib.parse import urljoin, urlparse

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "apnacounsellor@gmail.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "ApnaCounsellor@2024")
RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "")

rzp_client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    rzp_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()
api = APIRouter(prefix="/api")
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ── Helpers ─────────────────────────────────────────────
def hash_password(p): return bcrypt.hashpw(p.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
def verify_password(p, h): return bcrypt.checkpw(p.encode("utf-8"), h.encode("utf-8"))

def create_access_token(uid, email, role):
    return jwt.encode({"sub": uid, "email": email, "role": role,
                       "exp": datetime.now(timezone.utc) + timedelta(days=7),
                       "type": "access"}, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(uid):
    return jwt.encode({"sub": uid, "exp": datetime.now(timezone.utc) + timedelta(days=30),
                       "type": "refresh"}, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request):
    token = request.headers.get("Authorization", "")
    if token.startswith("Bearer "): token = token[7:]
    if not token: raise HTTPException(401, "Not authenticated")
    try:
        # Verify with Supabase Auth or decrypt JWT
        # For simplicity, we'll verify against the profiles table
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access": raise HTTPException(401, "Invalid token")
        
        result = supabase.table("profiles").select("*").eq("email", payload["email"]).execute()
        user = result.data[0] if result.data else None
        
        if not user: raise HTTPException(401, "User not found")
        if user.get("blocked"): raise HTTPException(403, "Your account has been blocked. Contact support.")
        return user
    except jwt.ExpiredSignatureError: raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError: raise HTTPException(401, "Invalid token")

@app.on_event("startup")
async def startup():
    logger.info("Apna Counselor started (Supabase backend)")
    # Ensure admin exists
    try:
        result = supabase.table("profiles").select("*").eq("email", ADMIN_EMAIL).execute()
        existing = result.data[0] if result.data else None
        if not existing:
            # Note: In Supabase, users should be created via auth.signUp
            # This is a fallback/seeding logic for profiles
            logger.info(f"Admin profile check: {ADMIN_EMAIL} not found. Please register via Auth.")
    except Exception as e:
        logger.warning(f"Admin seed check: {e}")

# ── Models ──────────────────────────────────────────────
class RegisterInput(BaseModel):
    name: str; email: str; password: str; role: str = "student"
    phone: Optional[str] = None

class MentorRegisterInput(BaseModel):
    name: str; email: str; phone: str; password: str
    college: str; course: str; branch: str; year: str
    linkedin: Optional[str] = None; terms_accepted: bool = True
    college_id_url: Optional[str] = None; profile_photo_url: Optional[str] = None

class LoginInput(BaseModel):
    email: str; password: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None; phone: Optional[str] = None; bio: Optional[str] = None
    academicClass: Optional[str] = None; exam: Optional[str] = None; marks: Optional[str] = None
    rank: Optional[str] = None; interests: Optional[List[str]] = None; budget: Optional[str] = None
    preferredLocation: Optional[str] = None; college: Optional[str] = None; branch: Optional[str] = None
    year: Optional[str] = None; skills: Optional[List[str]] = None; pricing: Optional[int] = None
    availability: Optional[List[str]] = None; profilePhoto: Optional[str] = None; avatar: Optional[str] = None
    headline: Optional[str] = None; about: Optional[str] = None; gender: Optional[str] = None
    languages: Optional[List[str]] = None; sessionTypes: Optional[List[str]] = None
    pricing30: Optional[int] = None; pricing60: Optional[int] = None
    instantBooking: Optional[bool] = None; introVideo: Optional[str] = None
    socialLinks: Optional[dict] = None; linkedin: Optional[str] = None
    academic_class: Optional[str] = None; preferred_location: Optional[str] = None

class MentorOnboardingStep1(BaseModel):
    name: str; gender: str; city: str; state: str
    college: str; degree: str; branch: str; year: str; graduationYear: str

class MentorOnboardingStep2(BaseModel):
    entranceExam: str; rankPercentile: str; cgpa: Optional[str] = None
    achievements: Optional[List[str]] = None; internships: Optional[List[str]] = None

class MentorOnboardingStep3(BaseModel):
    helpCategories: List[str]; languages: List[str]; sessionTypes: List[str]

class MentorOnboardingStep4(BaseModel):
    pricing30: int; pricing60: int; weeklySlots: List[str]
    timezone: str = "Asia/Kolkata"; instantBooking: bool = False

class MentorOnboardingStep5(BaseModel):
    headline: str; about: str; whyBook: str
    socialLinks: Optional[dict] = None; profilePhoto: Optional[str] = None
    introVideo: Optional[str] = None

class BookingInput(BaseModel):
    mentor_id: str; date: str; time_slot: str; topic: Optional[str] = None

class ChatInput(BaseModel):
    message: str; session_id: Optional[str] = None

class ReviewInput(BaseModel):
    mentor_id: str; rating: int; comment: str; session_id: Optional[str] = None

class BatchInput(BaseModel):
    title: str; description: str; max_students: int = 20; price: int = 2000
    start_date: str; end_date: str; schedule: Optional[str] = None; topics: Optional[List[str]] = None

class PredictInput(BaseModel):
    exam: str; rank: Optional[int] = None; percentile: Optional[float] = None
    category: str = "General"; preferred_branches: Optional[List[str]] = None
    preferred_states: Optional[List[str]] = None

class CompareInput(BaseModel):
    college_ids: List[str]

class CounsellorApplyInput(BaseModel):
    name: str; email: str; phone: str; qualification: str; experience: str
    specialization: List[str]; bio: str

class SessionPostInput(BaseModel):
    title: str; description: str; date: str; time_slot: str
    duration: int = 30; price: int; topic: str; max_students: int = 1

class AdminUserAction(BaseModel):
    action: str
    reason: Optional[str] = None

class PaymentOrderInput(BaseModel):
    mentor_id: str; session_id: Optional[str] = None; amount: Optional[int] = None

# ── Auth Routes ─────────────────────────────────────────
@api.post("/auth/register")
async def register(body: RegisterInput):
    email = body.email.lower().strip()
    existing = await convex_query("users:getByEmail", {"email": email})
    if existing: raise HTTPException(400, "Email already registered")
    doc = {
        "name": body.name, "email": email,
        "passwordHash": hash_password(body.password),
        "role": body.role, "phone": body.phone or "",
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    uid = await convex_mutation("users:createUser", doc)
    user = await convex_query("users:getByEmail", {"email": email})
    user = clean_user(user); user["id"] = user["_id"]
    return {"user": user, "access_token": create_access_token(uid, email, body.role),
            "refresh_token": create_refresh_token(uid)}

@api.post("/auth/register/mentor")
async def register_mentor(body: MentorRegisterInput):
    email = body.email.lower().strip()
    existing = await convex_query("users:getByEmail", {"email": email})
    if existing: raise HTTPException(400, "Email already registered")
    doc = {
        "name": body.name, "email": email, "phone": body.phone,
        "passwordHash": hash_password(body.password), "role": "mentor",
        "college": body.college, "course": body.course, "branch": body.branch,
        "year": body.year, "linkedin": body.linkedin or "",
        "collegeIdUrl": body.college_id_url or "",
        "profilePhoto": body.profile_photo_url or "",
        "termsAccepted": body.terms_accepted,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    uid = await convex_mutation("users:createUser", doc)
    user = await convex_query("users:getByEmail", {"email": email})
    user = clean_user(user); user["id"] = user["_id"]
    return {"user": user, "access_token": create_access_token(uid, email, "mentor"),
            "refresh_token": create_refresh_token(uid)}

@api.post("/auth/login")
async def login(body: LoginInput):
    email = body.email.lower().strip()
    user = await convex_query("users:getByEmail", {"email": email})
    if not user: raise HTTPException(401, "Invalid email or password")
    if not verify_password(body.password, user.get("passwordHash", "")):
        raise HTTPException(401, "Invalid email or password")
    if user.get("blocked"): raise HTTPException(403, "Your account has been blocked. Contact support.")
    uid = user["_id"]
    user = clean_user(user); user["id"] = uid
    return {"user": user, "access_token": create_access_token(uid, email, user["role"]),
            "refresh_token": create_refresh_token(uid)}

@api.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    return {"user": clean_user(user)}

# ── Mentor Onboarding Routes ────────────────────────────
@api.post("/mentor/onboarding/step1")
async def mentor_onboarding_step1(body: MentorOnboardingStep1, user: dict = Depends(get_current_user)):
    if user.get("role") != "mentor": raise HTTPException(403, "Mentors only")
    await convex_mutation("users:updateUser", {"id": user["_id"], "data": {
        "name": body.name, "gender": body.gender, "city": body.city, "state": body.state,
        "college": body.college, "degree": body.degree, "branch": body.branch,
        "year": body.year, "graduationYear": body.graduationYear, "onboardingStep": 2
    }})
    return {"message": "Step 1 completed", "step": 2}

@api.post("/mentor/onboarding/step2")
async def mentor_onboarding_step2(body: MentorOnboardingStep2, user: dict = Depends(get_current_user)):
    if user.get("role") != "mentor": raise HTTPException(403, "Mentors only")
    await convex_mutation("users:updateUser", {"id": user["_id"], "data": {
        "entranceExam": body.entranceExam, "rankPercentile": body.rankPercentile,
        "cgpa": body.cgpa or "", "achievements": body.achievements or [],
        "internships": body.internships or [], "onboardingStep": 3
    }})
    return {"message": "Step 2 completed", "step": 3}

@api.post("/mentor/onboarding/step3")
async def mentor_onboarding_step3(body: MentorOnboardingStep3, user: dict = Depends(get_current_user)):
    if user.get("role") != "mentor": raise HTTPException(403, "Mentors only")
    await convex_mutation("users:updateUser", {"id": user["_id"], "data": {
        "helpCategories": body.helpCategories, "skills": body.helpCategories,
        "languages": body.languages, "sessionTypes": body.sessionTypes, "onboardingStep": 4
    }})
    return {"message": "Step 3 completed", "step": 4}

@api.post("/mentor/onboarding/step4")
async def mentor_onboarding_step4(body: MentorOnboardingStep4, user: dict = Depends(get_current_user)):
    if user.get("role") != "mentor": raise HTTPException(403, "Mentors only")
    await convex_mutation("users:updateUser", {"id": user["_id"], "data": {
        "pricing30": body.pricing30, "pricing60": body.pricing60, "pricing": body.pricing30,
        "weeklySlots": body.weeklySlots, "availability": body.weeklySlots,
        "timezone": body.timezone, "instantBooking": body.instantBooking, "onboardingStep": 5
    }})
    return {"message": "Step 4 completed", "step": 5}

@api.post("/mentor/onboarding/step5")
async def mentor_onboarding_step5(body: MentorOnboardingStep5, user: dict = Depends(get_current_user)):
    if user.get("role") != "mentor": raise HTTPException(403, "Mentors only")
    await convex_mutation("users:updateUser", {"id": user["_id"], "data": {
        "headline": body.headline, "about": body.about, "whyBook": body.whyBook,
        "bio": body.about, "socialLinks": body.socialLinks or {},
        "profilePhoto": body.profilePhoto or "", "avatar": body.profilePhoto or "",
        "introVideo": body.introVideo or "", "onboardingStep": 6
    }})
    return {"message": "Step 5 completed", "step": 6}

@api.post("/mentor/onboarding/submit")
async def mentor_onboarding_submit(user: dict = Depends(get_current_user)):
    if user.get("role") != "mentor": raise HTTPException(403, "Mentors only")
    await convex_mutation("users:updateUser", {"id": user["_id"], "data": {
        "onboardingComplete": True, "onboardingStep": 6, "profileComplete": True,
        "submittedAt": datetime.now(timezone.utc).isoformat(), "approvalStatus": "pending"
    }})
    await convex_mutation("notifications:createNotification", {
        "notifId": str(uuid.uuid4()), "userId": user["_id"],
        "type": "onboarding_submitted", "title": "Profile Submitted",
        "message": "Your profile is under verification. You'll be notified once approved.",
        "createdAt": datetime.now(timezone.utc).isoformat()
    })
    return {"message": "Profile submitted for verification", "status": "pending"}

@api.get("/mentor/onboarding/status")
async def mentor_onboarding_status(user: dict = Depends(get_current_user)):
    if user.get("role") != "mentor": raise HTTPException(403, "Mentors only")
    return {
        "step": user.get("onboardingStep", 1),
        "complete": user.get("onboardingComplete", False),
        "approved": user.get("approved", False),
        "approval_status": user.get("approvalStatus", "not_submitted")
    }

# ── Mentor Session Management ───────────────────────────
MAX_SESSION_PRICE = 1000

@api.post("/mentor/sessions/post")
async def mentor_post_session(body: SessionPostInput, user: dict = Depends(get_current_user)):
    if user.get("role") != "mentor": raise HTTPException(403, "Mentors only")
    if body.price > MAX_SESSION_PRICE:
        raise HTTPException(400, f"Max session price is ₹{MAX_SESSION_PRICE}")
    if body.price < 50:
        raise HTTPException(400, "Min session price is ₹50")
    doc = {
        "sessionId": str(uuid.uuid4()), "mentorId": user["_id"],
        "mentorName": user.get("name", ""), "title": body.title,
        "description": body.description, "date": body.date, "timeSlot": body.time_slot,
        "duration": body.duration, "price": body.price, "topic": body.topic,
        "maxStudents": body.max_students, "enrolledStudents": [],
        "status": "open", "createdAt": datetime.now(timezone.utc).isoformat()
    }
    await convex_mutation("postedSessions:create", {"data": doc})
    return doc

@api.get("/mentor/sessions/posted")
async def get_mentor_posted_sessions(user: dict = Depends(get_current_user)):
    if user.get("role") != "mentor": raise HTTPException(403, "Mentors only")
    return await convex_query("postedSessions:listByMentor", {"mentorId": user["_id"]})

@api.get("/sessions/posted/{mentor_id}")
async def get_public_mentor_sessions(mentor_id: str):
    """Get posted sessions for a mentor (public access for students to book)"""
    try:
        sessions = await convex_query("postedSessions:listByMentor", {"mentorId": mentor_id})
        return sessions or []
    except Exception:
        return []

@api.delete("/mentor/sessions/{session_id}")
async def delete_mentor_session(session_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "mentor": raise HTTPException(403, "Mentors only")
    try:
        await convex_mutation("postedSessions:deleteSession", {"sessionId": session_id, "mentorId": user["_id"]})
    except Exception:
        raise HTTPException(404, "Session not found")
    return {"message": "Session deleted"}

# ── Notifications ───────────────────────────────────────
@api.get("/notifications")
async def get_notifications(user: dict = Depends(get_current_user)):
    return await convex_query("notifications:listByUser", {"userId": user["_id"]})

@api.get("/notifications/unread-count")
async def unread_notifications_count(user: dict = Depends(get_current_user)):
    count = await convex_query("notifications:unreadCount", {"userId": user["_id"]})
    return {"count": count}

@api.put("/notifications/{notif_id}/read")
async def mark_notification_read(notif_id: str, user: dict = Depends(get_current_user)):
    await convex_mutation("notifications:markRead", {"notifId": notif_id})
    return {"message": "Marked as read"}

# ── Profile ─────────────────────────────────────────────
@api.put("/profile")
async def update_profile(body: ProfileUpdate, user: dict = Depends(get_current_user)):
    data = {k: v for k, v in body.dict().items() if v is not None}
    if data:
        data["profileComplete"] = True
        await convex_mutation("users:updateUser", {"id": user["_id"], "data": data})
    updated = await convex_query("users:getByEmail", {"email": user["email"]})
    return {"user": clean_user(updated)}

@api.get("/profile/{user_id}")
async def get_profile(user_id: str):
    user = await convex_query("users:getById", {"id": user_id})
    if not user: raise HTTPException(404, "Not found")
    return clean_user(user)

# ── Mentors ─────────────────────────────────────────────
@api.get("/mentors")
async def list_mentors(search: Optional[str] = None, skill: Optional[str] = None):
    mentors = await convex_query("users:listMentors", {
        "search": search or None, "skill": skill or None
    })
    return [clean_user(m) for m in (mentors or [])]

@api.get("/mentors/{mid}")
async def get_mentor(mid: str):
    mentor = await convex_query("users:getById", {"id": mid})
    if not mentor or mentor.get("role") != "mentor": raise HTTPException(404, "Not found")
    return clean_user(mentor)

# ── Sessions ────────────────────────────────────────────
@api.post("/sessions/book")
async def book_session(body: BookingInput, user: dict = Depends(get_current_user)):
    mentor = await convex_query("users:getById", {"id": body.mentor_id})
    if not mentor: raise HTTPException(404, "Mentor not found")
    doc = {
        "sessionId": str(uuid.uuid4()), "studentId": user["_id"],
        "studentName": user.get("name", ""), "mentorId": body.mentor_id,
        "mentorName": mentor.get("name", ""), "date": body.date,
        "timeSlot": body.time_slot, "topic": body.topic or "General Counseling",
        "status": "pending", "price": mentor.get("pricing", 500),
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    await convex_mutation("sessions:createSession", doc)
    return doc

@api.get("/sessions")
async def get_sessions(user: dict = Depends(get_current_user)):
    return await convex_query("sessions:listByUser", {"userId": user["_id"], "role": user["role"]})

@api.put("/sessions/{sid}/status")
async def update_session_status(sid: str, status: str, user: dict = Depends(get_current_user)):
    if status not in ["accepted", "rejected", "completed", "cancelled"]:
        raise HTTPException(400, "Invalid status")
    try:
        await convex_mutation("sessions:updateStatus", {"sessionId": sid, "status": status})
    except Exception:
        raise HTTPException(404, "Not found")
    return {"message": "Updated", "status": status}

# ── Reviews ─────────────────────────────────────────────
@api.post("/reviews")
async def create_review(body: ReviewInput, user: dict = Depends(get_current_user)):
    if body.rating < 1 or body.rating > 5: raise HTTPException(400, "Rating 1-5")
    doc = {
        "reviewId": str(uuid.uuid4()), "mentorId": body.mentor_id,
        "sessionId": body.session_id, "reviewerId": user["_id"],
        "reviewerName": user.get("name", "Anonymous"),
        "rating": body.rating, "comment": body.comment,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    try:
        await convex_mutation("reviews:createReview", doc)
    except Exception as e:
        raise HTTPException(400, str(e))
    # Update mentor rating
    reviews = await convex_query("reviews:listByMentor", {"mentorId": body.mentor_id})
    if reviews:
        avg = round(sum(r["rating"] for r in reviews) / len(reviews), 1)
        try:
            await convex_mutation("users:updateUser", {"id": body.mentor_id,
                "data": {"rating": avg, "reviewsCount": len(reviews)}})
        except Exception: pass
    return doc

@api.get("/reviews/{mentor_id}")
async def get_reviews(mentor_id: str):
    return await convex_query("reviews:listByMentor", {"mentorId": mentor_id})

# ── Batches ─────────────────────────────────────────────
@api.post("/batches")
async def create_batch(body: BatchInput, user: dict = Depends(get_current_user)):
    if user.get("role") not in ["mentor", "counsellor", "admin"]: raise HTTPException(403, "Only mentors")
    if body.price > MAX_SESSION_PRICE:
        raise HTTPException(400, f"Max batch price is ₹{MAX_SESSION_PRICE}")
    if body.price < 50:
        raise HTTPException(400, "Min batch price is ₹50")
    doc = {
        "batchId": str(uuid.uuid4()), "title": body.title, "description": body.description,
        "mentorId": user["_id"], "mentorName": user.get("name", ""),
        "mentorCollege": user.get("college", ""), "maxStudents": body.max_students,
        "currentStudents": 0, "price": body.price, "startDate": body.start_date,
        "endDate": body.end_date, "schedule": body.schedule or "Weekdays 6-7 PM",
        "topics": body.topics or [], "students": [], "status": "upcoming",
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    await convex_mutation("batches:create", {"data": doc})
    return doc

@api.get("/batches")
async def list_batches(status: Optional[str] = None, mentor_id: Optional[str] = None):
    return await convex_query("batches:list", {"status": status, "mentorId": mentor_id})

@api.get("/batches/{bid}")
async def get_batch(bid: str):
    b = await convex_query("batches:getById", {"batchId": bid})
    if not b: raise HTTPException(404, "Not found")
    return b

@api.post("/batches/{bid}/join")
async def join_batch(bid: str, user: dict = Depends(get_current_user)):
    try:
        await convex_mutation("batches:joinBatch", {"batchId": bid, "userId": user["_id"]})
    except Exception as e:
        raise HTTPException(400, str(e))
    return {"message": "Joined"}

# ── AI Chat ─────────────────────────────────────────────
@api.post("/ai/chat")
async def ai_chat(body: ChatInput, user: dict = Depends(get_current_user)):
    sid = body.session_id or str(uuid.uuid4())
    ts = datetime.now(timezone.utc).isoformat()
    
    # Store user message in Supabase
    supabase.table("chat_history").insert({
        "session_id": sid, "user_id": user["id"], "role": "user",
        "content": body.message, "timestamp": ts
    }).execute()

    # 1. Fetch Grounding Context from Supabase (Same as Website)
    context_data = ""
    try:
        # Search for colleges matching keywords in the message
        keywords = body.message.split()[:5] # Take first few words for a simple search
        search_query = " | ".join(keywords)
        
        # Simple text search or ilike for context
        res = supabase.table("colleges").select("*").ilike("name", f"%{keywords[0]}%").limit(5).execute()
        matches = res.data or []
        
        if matches:
            context_data = "Here are some verified records from our 1.7L college database for your reference:\n"
            for m in matches:
                context_data += f"- {m['name']} ({m['state']}): Avg Pkg {m.get('avg_package', 'N/A')}, NIRF {m.get('nirf_rank', 'N/A')}\n"
    except Exception as e:
        logger.warning(f"Context injection failed: {e}")

    sys_msg = f"You are Apna Counsellor AI. Use the following DATABASE RECORDS to answer accurately if relevant: {context_data}. Help ONLY with engineering college admissions (JoSAA, MHT-CET, COMEDK). Be concise and specific. Student Profile: {ctx}."


    # Get history from Supabase
    history_res = supabase.table("chat_history").select("*").eq("session_id", sid).order("timestamp", desc=False).execute()
    history = history_res.data or []

    messages = [{"role": "system", "content": sys_msg}]
    for msg in history:
        messages.append({"role": msg["role"], "content": msg["content"]})

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {os.environ.get('GROQ_API_KEY')}"},
                json={
                    "model": "llama3-8b-8192",
                    "messages": messages,
                    "temperature": 0.5
                },
                timeout=30
            )
            data = resp.json()
            response = data["choices"][0]["message"]["content"]
    except Exception as e:
        logger.error(f"AI error: {e}")
        response = "I'm here to help! Could you rephrase your question?"

    # Store assistant response in Supabase
    supabase.table("chat_history").insert({
        "session_id": sid, "user_id": user["id"], "role": "assistant",
        "content": response, "timestamp": datetime.now(timezone.utc).isoformat()
    }).execute()

    return {"response": response, "session_id": sid}

def serialize_college(c: dict) -> dict:
    """Convert Convex camelCase college doc → snake_case for frontend"""
    if not c:
        return c
    return {
        "id": c.get("collegeId") or c.get("_id", ""),
        "_id": c.get("_id", ""),
        "name": c.get("name", ""),
        "short_name": c.get("shortName", c.get("name", "")),
        "state": c.get("state", ""),
        "city": c.get("city", ""),
        "type": c.get("type", ""),
        "nirf_rank": c.get("nirfRank") or 0,
        "established": c.get("established"),
        "annual_fee": c.get("annualFee", ""),
        "hostel_fee": c.get("hostelFee", ""),
        "avg_package": c.get("avgPackage", ""),
        "median_package": c.get("medianPackage", ""),
        "highest_package": c.get("highestPackage", ""),
        "total_students": c.get("totalStudents"),
        "faculty_count": c.get("facultyCount"),
        "campus_area": c.get("campusArea", ""),
        "website": c.get("website", ""),
        "branches": c.get("branches", []),
        "cutoffs": c.get("cutoffs", {}),
        "placements": c.get("placements", {}),
        "highlights": c.get("highlights", []),
        "counselling": c.get("counselling", []),
        "image_url": c.get("imageUrl", ""),
        "description": c.get("description", ""),
        "created_at": c.get("createdAt", ""),
    }

# ── Colleges ────────────────────────────────────────────
@api.get("/colleges")
async def list_colleges(state: Optional[str] = None, college_type: Optional[str] = None, search: Optional[str] = None):
    colleges = await convex_query("colleges:list", {"state": state, "type": college_type, "search": search})
    return [serialize_college(c) for c in (colleges or [])]

@api.get("/colleges/states")
async def get_states():
    return await convex_query("colleges:getStates", {})

@api.get("/colleges/{college_id}")
async def get_college(college_id: str):
    c = await convex_query("colleges:getById", {"collegeId": college_id})
    if not c: raise HTTPException(404, "College not found")
    return serialize_college(c)

@api.post("/colleges/predict")
async def predict_colleges(body: PredictInput, user: dict = Depends(get_current_user)):
    try:
        # 1. Map Percentile to Rank if needed
        input_rank = body.rank
        if not input_rank and body.percentile:
            # Simple mapping: (100 - percentile) * 12000 (total JEE aspirants approximation)
            input_rank = int((100 - body.percentile) * 12000)
            if input_rank < 1: input_rank = 1

        # 2. Query Supabase 'colleges' table (Universal Coverage)
        # We query the full college list and then apply our estimation agent
        query = supabase.table("colleges").select("*")
        
        # Apply broad filters
        if body.preferred_states:
            query = query.in_("state", body.preferred_states)
        
        # Limit to a reasonable number for processing
        res = query.limit(200).execute()
        colleges = res.data or []

        # 3. Estimation Agent Logic (Ported from Website)
        def estimate_cutoff(college, category):
            # Base logic for premium institutes
            name = college.get("name", "").upper()
            base_rank = 15000 # Default for average college
            
            if "IIT" in name: base_rank = 5000
            elif "NIT" in name: base_rank = 12000
            elif "IIIT" in name: base_rank = 18000
            elif "PRIVATE" in college.get("type", "").upper(): base_rank = 60000
            
            # NIRF adjustment
            nirf = college.get("nirf_rank")
            if nirf and str(nirf).isdigit():
                base_rank = base_rank + (int(nirf) * 100)

            # Category Multipliers
            multipliers = {
                "General": 1.0,
                "OBC": 2.5,
                "SC": 6.0,
                "ST": 10.0,
                "EWS": 1.5
            }
            return int(base_rank * multipliers.get(category, 1.0))

        # 4. Process Results
        predicted = []
        for c in colleges:
            cutoff = estimate_cutoff(c, body.category)
            
            # Simple probability logic
            prob = 0
            if input_rank <= cutoff * 0.8: prob = 95
            elif input_rank <= cutoff: prob = 85
            elif input_rank <= cutoff * 1.2: prob = 60
            elif input_rank <= cutoff * 1.5: prob = 30
            else: prob = 10

            if prob >= 30: # Only show realistic options
                predicted.append({
                    "id": c.get("college_id") or c.get("id"),
                    "college_id": c.get("college_id"),
                    "name": c.get("name"),
                    "short_name": c.get("short_name") or c.get("name"),
                    "branch": "Computer Science / IT (Predicted)", # Placeholder for broad search
                    "probability": prob,
                    "state": c.get("state"),
                    "type": c.get("type"),
                    "avg_package": c.get("avg_package") or "₹6.5 LPA",
                    "annual_fee": c.get("annual_fee") or "₹1.8L",
                    "cutoff_rank": cutoff,
                    "reason": f"Matches your rank of {input_rank} based on {body.category} category trends."
                })

        # Sort by probability and package
        predicted.sort(key=lambda x: (x["probability"], x["avg_package"]), reverse=True)
        return predicted[:20]

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(500, f"Prediction failed: {str(e)}")


@api.post("/colleges/compare")
async def compare_colleges(body: CompareInput):
    colleges = []
    for cid in body.college_ids[:4]:
        c = await convex_query("colleges:getById", {"collegeId": cid})
        if c: colleges.append(serialize_college(c))
    return colleges

@api.get("/colleges/cutoff/{college_id}")
async def get_cutoffs(college_id: str, category: Optional[str] = "General"):
    c = await convex_query("colleges:getById", {"collegeId": college_id})
    if not c: raise HTTPException(404, "Not found")
    sc = serialize_college(c)
    return {"college": sc["name"], "cutoffs": sc["cutoffs"], "category": category}

# ── Counsellor Application ──────────────────────────────
@api.post("/counsellor/apply")
async def counsellor_apply(body: CounsellorApplyInput):
    doc = {
        "appId": str(uuid.uuid4()), "name": body.name,
        "email": body.email.lower(), "phone": body.phone,
        "qualification": body.qualification, "experience": body.experience,
        "specialization": body.specialization, "bio": body.bio,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    try:
        await convex_mutation("counsellorApps:create", doc)
    except Exception as e:
        raise HTTPException(400, str(e))
    return doc

@api.get("/counsellor/applications")
async def list_applications(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin": raise HTTPException(403, "Admin only")
    return await convex_query("counsellorApps:list", {})

# ── Razorpay Payment Routes ─────────────────────────────
@api.post("/payments/create-link")
async def create_payment_link(body: PaymentOrderInput, user: dict = Depends(get_current_user)):
    mentor = await convex_query("users:getById", {"id": body.mentor_id})
    if not mentor: raise HTTPException(404, "Mentor not found")
    amount_inr = body.amount or mentor.get("pricing", 500)
    amount_paise = amount_inr * 100
    payment_id = str(uuid.uuid4())

    session_doc = {
        "sessionId": str(uuid.uuid4()), "studentId": user["_id"],
        "studentName": user.get("name", ""), "mentorId": body.mentor_id,
        "mentorName": mentor.get("name", ""), "date": "TBD", "timeSlot": "TBD",
        "topic": "Mentorship Session", "status": "payment_pending",
        "price": amount_inr, "paymentId": payment_id,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    await convex_mutation("sessions:createSession", session_doc)

    if not rzp_client: raise HTTPException(500, "Payment gateway not configured")

    try:
        link = rzp_client.payment_link.create({
            "amount": amount_paise, "currency": "INR",
            "description": f"Session with {mentor.get('name', 'Mentor')} - Apna Counselor",
            "customer": {"name": user.get("name", "Student"), "email": user.get("email", "")},
            "notify": {"sms": False, "email": True},
            "callback_url": "https://apnacounselor.com/payment-success",
            "callback_method": "get",
            "notes": {"payment_id": payment_id, "student_id": user["_id"],
                      "mentor_id": body.mentor_id, "session_id": session_doc["sessionId"]},
        })
        payment_doc = {
            "paymentId": payment_id, "razorpayLinkId": link.get("id", ""),
            "shortUrl": link.get("short_url", ""), "amount": amount_inr, "currency": "INR",
            "status": "created", "userId": user["_id"], "userName": user.get("name", ""),
            "mentorId": body.mentor_id, "mentorName": mentor.get("name", ""),
            "sessionId": session_doc["sessionId"], "createdAt": datetime.now(timezone.utc).isoformat()
        }
        await convex_mutation("payments:createPayment", payment_doc)
        return {"payment_url": link.get("short_url", ""), "payment_id": payment_id,
                "amount": amount_inr, "session": session_doc, "payment": payment_doc}
    except Exception as e:
        logger.error(f"Razorpay link error: {e}")
        raise HTTPException(500, f"Payment error: {str(e)}")

@api.post("/payments/check-status/{payment_id}")
async def check_payment_status(payment_id: str, user: dict = Depends(get_current_user)):
    payment = await convex_query("payments:getByPaymentId", {"paymentId": payment_id})
    if not payment: raise HTTPException(404, "Payment not found")
    if rzp_client and payment.get("razorpayLinkId"):
        try:
            link = rzp_client.payment_link.fetch(payment["razorpayLinkId"])
            new_status = link.get("status", "created")
            if new_status == "paid" and payment["status"] != "paid":
                await convex_mutation("payments:updateStatus", {"paymentId": payment_id, "status": "paid"})
                await convex_mutation("sessions:updateStatus", {"sessionId": payment.get("sessionId", ""), "status": "confirmed"})
                try:
                    mentor = await convex_query("users:getById", {"id": payment["mentorId"]})
                    if mentor:
                        await convex_mutation("users:updateUser", {"id": payment["mentorId"], "data": {
                            "earnings": (mentor.get("earnings") or 0) + payment["amount"],
                            "sessionsCount": (mentor.get("sessionsCount") or 0) + 1
                        }})
                except Exception: pass
            return {"status": new_status, "payment": payment}
        except Exception as e:
            logger.error(f"Check status error: {e}")
    return {"status": payment.get("status", "unknown"), "payment": payment}

@api.get("/payments/history")
async def payment_history(user: dict = Depends(get_current_user)):
    return await convex_query("payments:listByUser", {
        "userId": user["_id"], "role": user["role"],
        "mentorId": user["_id"] if user["role"] == "mentor" else None
    })

# ── WhatsApp Routes ─────────────────────────────────────
@api.get("/whatsapp/mentor/{mentor_id}")
async def whatsapp_mentor_link(mentor_id: str, user: dict = Depends(get_current_user)):
    mentor = await convex_query("users:getById", {"id": mentor_id})
    if not mentor: raise HTTPException(404, "Mentor not found")
    phone = mentor.get("phone", "")
    student_name = user.get("name", "Student")
    msg = f"Hi {mentor.get('name', 'Mentor')}, I'm {student_name} from Apna Counselor. I'd like to discuss a mentorship session with you."
    return {"whatsapp_url": f"https://wa.me/{phone}?text={msg}" if phone else f"https://wa.me/?text={msg}", "message": msg}

@api.get("/whatsapp/share")
async def whatsapp_share():
    msg = "Check out Apna Counselor - India's AI-powered engineering counseling platform! Get college predictions, connect with IIT/NIT mentors, and more."
    return {"whatsapp_url": f"https://wa.me/?text={msg}", "message": msg}

# ── Admin User Management ───────────────────────────────
@api.get("/admin/users")
async def admin_list_users(role: Optional[str] = None, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin": raise HTTPException(403, "Admin only")
    users = await convex_query("users:listByRole", {"role": role})
    return [clean_user(u) for u in (users or [])]

@api.put("/admin/users/{user_id}/action")
async def admin_user_action(user_id: str, body: AdminUserAction, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin": raise HTTPException(403, "Admin only")
    if body.action == "block":
        await convex_mutation("users:blockUser", {"id": user_id, "blocked": True, "reason": body.reason})
        return {"message": "User blocked"}
    elif body.action == "unblock":
        await convex_mutation("users:blockUser", {"id": user_id, "blocked": False})
        return {"message": "User unblocked"}
    elif body.action == "delete":
        await convex_mutation("users:deleteUser", {"id": user_id})
        return {"message": "User deleted"}
    elif body.action == "approve":
        await convex_mutation("users:approvementor", {"id": user_id})
        await convex_mutation("notifications:createNotification", {
            "notifId": str(uuid.uuid4()), "userId": user_id, "type": "profile_approved",
            "title": "Profile Approved!", "message": "Your mentor profile has been approved. You can now receive bookings.",
            "createdAt": datetime.now(timezone.utc).isoformat()
        })
        return {"message": "Mentor approved"}
    elif body.action == "reject":
        await convex_mutation("users:updateUser", {"id": user_id, "data": {"approved": False, "approvalStatus": "rejected"}})
        await convex_mutation("notifications:createNotification", {
            "notifId": str(uuid.uuid4()), "userId": user_id, "type": "profile_rejected",
            "title": "Profile Not Approved",
            "message": f"Your profile was not approved. Reason: {body.reason or 'Not specified'}",
            "createdAt": datetime.now(timezone.utc).isoformat()
        })
        return {"message": "Mentor rejected"}
    raise HTTPException(400, "Invalid action")

@api.delete("/admin/users/{user_id}")
async def admin_delete_user(user_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin": raise HTTPException(403, "Admin only")
    await convex_mutation("users:deleteUser", {"id": user_id})
    return {"message": "User deleted"}

@api.put("/admin/users/set-role")
async def admin_set_role(email: str, role: str):
    """Set user role by email - used for initial admin setup"""
    target = await convex_query("users:getByEmail", {"email": email})
    if not target:
        raise HTTPException(404, f"User with email {email} not found")
    await convex_mutation("users:updateUser", {"id": target["_id"], "data": {"role": role}})
    logger.info(f"Set role={role} for user {email}")
    return {"message": f"User {email} role set to {role}", "user_id": target["_id"]}

@api.get("/admin/pending-mentors")
async def get_pending_mentors(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin": raise HTTPException(403, "Admin only")
    all_mentors = await convex_query("users:listByRole", {"role": "mentor"})
    pending = [clean_user(m) for m in (all_mentors or []) if m.get("approvalStatus") == "pending"]
    return pending

@api.get("/admin/stats")
async def admin_stats(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin": raise HTTPException(403, "Admin only")
    return {
        "total_students": await convex_query("users:countByRole", {"role": "student"}),
        "total_mentors": await convex_query("users:countByRole", {"role": "mentor"}),
        "total_counsellors": await convex_query("users:countByRole", {"role": "counsellor"}),
        "total_sessions": await convex_query("sessions:totalCount", {}),
        "total_colleges": await convex_query("colleges:totalCount", {}),
        "pending_applications": await convex_query("counsellorApps:pendingCount", {}),
        "total_payments": await convex_query("payments:totalPaid", {}),
    }

@api.get("/admin/dashboard")
async def admin_dashboard(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin": raise HTTPException(403, "Admin only")
    students = await convex_query("users:countByRole", {"role": "student"})
    mentors = await convex_query("users:countByRole", {"role": "mentor"})
    counsellors = await convex_query("users:countByRole", {"role": "counsellor"})
    sessions_count = await convex_query("sessions:totalCount", {})
    colleges_count = await convex_query("colleges:totalCount", {})
    pending_apps = await convex_query("counsellorApps:pendingCount", {})
    paid_count = await convex_query("payments:totalPaid", {})
    all_users = await convex_query("users:listByRole", {})
    recent_users = [clean_user(u) for u in (all_users or [])[-10:]]
    return {
        "stats": {
            "total_students": students, "total_mentors": mentors,
            "total_counsellors": counsellors, "total_sessions": sessions_count,
            "total_colleges": colleges_count, "pending_applications": pending_apps,
            "total_payments": paid_count,
        },
        "recent_users": recent_users,
    }

# ── Mentor Dashboard ────────────────────────────────────
@api.get("/mentor/dashboard")
async def mentor_dashboard(user: dict = Depends(get_current_user)):
    if user.get("role") not in ["mentor", "counsellor"]: raise HTTPException(403, "Mentors only")
    sessions = await convex_query("sessions:listByUser", {"userId": user["_id"], "role": "mentor"}) or []
    pending = [s for s in sessions if s.get("status") == "pending"]
    upcoming = [s for s in sessions if s.get("status") in ["accepted", "confirmed"]]
    completed = [s for s in sessions if s.get("status") == "completed"]
    payments = await convex_query("payments:listByUser", {"userId": user["_id"], "role": "mentor", "mentorId": user["_id"]}) or []
    paid_payments = [p for p in payments if p.get("status") == "paid"]
    total_earnings = sum(p.get("amount", 0) for p in paid_payments)
    reviews = await convex_query("reviews:listByMentor", {"mentorId": user["_id"]}) or []
    batches = await convex_query("batches:list", {"mentorId": user["_id"]}) or []
    return {
        "stats": {
            "total_sessions": len(sessions), "pending_requests": len(pending),
            "upcoming_sessions": len(upcoming), "completed_sessions": len(completed),
            "total_earnings": total_earnings, "rating": user.get("rating", 0),
            "reviews_count": len(reviews), "active_batches": len([b for b in batches if b.get("status") == "ongoing"]),
        },
        "pending_requests": pending[:5], "upcoming_sessions": upcoming[:5],
        "recent_reviews": reviews[:5], "batches": batches[:5],
    }

@api.get("/mentor/earnings")
async def mentor_earnings(user: dict = Depends(get_current_user)):
    if user.get("role") not in ["mentor", "counsellor"]: raise HTTPException(403, "Mentors only")
    payments = await convex_query("payments:listByUser", {"userId": user["_id"], "role": "mentor", "mentorId": user["_id"]}) or []
    paid = [p for p in payments if p.get("status") == "paid"]
    total = sum(p.get("amount", 0) for p in paid)
    monthly = {}
    for p in paid:
        month = (p.get("createdAt") or "")[:7]
        monthly[month] = monthly.get(month, 0) + p.get("amount", 0)
    return {"total_earnings": total, "available_balance": total, "monthly_breakdown": monthly, "transactions": paid}

@api.post("/mentor/withdraw")
async def request_withdrawal(amount: int, user: dict = Depends(get_current_user)):
    if user.get("role") not in ["mentor", "counsellor"]: raise HTTPException(403, "Mentors only")
    if amount < 500: raise HTTPException(400, "Minimum withdrawal is ₹500")
    doc = {
        "withdrawalId": str(uuid.uuid4()), "mentorId": user["_id"],
        "mentorName": user.get("name", ""), "amount": amount,
        "createdAt": datetime.now(timezone.utc).isoformat()
    }
    await convex_mutation("withdrawals:create", doc)
    return {"message": "Withdrawal requested", "withdrawal": doc}

@api.get("/mentor/withdrawals")
async def get_withdrawals(user: dict = Depends(get_current_user)):
    if user.get("role") not in ["mentor", "counsellor"]: raise HTTPException(403, "Mentors only")
    return await convex_query("withdrawals:listByMentor", {"mentorId": user["_id"]})

# ── Counsellor Admin ─────────────────────────────────────
@api.put("/counsellor/applications/{app_id}/approve")
async def approve_counsellor(app_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin": raise HTTPException(403, "Admin only")
    app = await convex_query("counsellorApps:list", {})
    target = next((a for a in (app or []) if a.get("appId") == app_id), None)
    if not target: raise HTTPException(404, "Not found")
    await convex_mutation("counsellorApps:updateStatus", {"appId": app_id, "status": "approved"})
    return {"message": "Counsellor approved", "status": "approved"}

@api.put("/counsellor/applications/{app_id}/reject")
async def reject_counsellor(app_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin": raise HTTPException(403, "Admin only")
    await convex_mutation("counsellorApps:updateStatus", {"appId": app_id, "status": "rejected"})
    return {"message": "Application rejected", "status": "rejected"}

# ── Admin Withdrawals ───────────────────────────────────
@api.get("/admin/withdrawals")
async def admin_list_withdrawals(status: Optional[str] = None, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin": raise HTTPException(403, "Admin only")
    return await convex_query("withdrawals:listAll", {"status": status})

@api.put("/admin/withdrawals/{withdrawal_id}/approve")
async def approve_withdrawal(withdrawal_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin": raise HTTPException(403, "Admin only")
    await convex_mutation("withdrawals:updateStatus", {
        "withdrawalId": withdrawal_id, "status": "approved",
        "approvedAt": datetime.now(timezone.utc).isoformat()
    })
    return {"message": "Withdrawal approved"}

@api.put("/admin/withdrawals/{withdrawal_id}/reject")
async def reject_withdrawal(withdrawal_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin": raise HTTPException(403, "Admin only")
    await convex_mutation("withdrawals:updateStatus", {
        "withdrawalId": withdrawal_id, "status": "rejected",
        "rejectedAt": datetime.now(timezone.utc).isoformat()
    })
    return {"message": "Withdrawal rejected"}

# ── Admin Colleges ───────────────────────────────────────
class CollegeInput(BaseModel):
    name: str; short_name: str; state: str; city: str; type: str
    nirf_rank: Optional[int] = 0; annual_fee: Optional[str] = ""
    avg_package: Optional[str] = ""; highest_package: Optional[str] = ""
    branches: Optional[List[str]] = []; counselling: Optional[List[str]] = []
    cutoffs: Optional[dict] = {}

from bs4 import BeautifulSoup
import json as json_lib
import re as re_lib

COLLEGE_KEYWORDS = [
    '.ac.in', '.edu', 'iit', 'nit', 'iiit', 'bits', 'vit', 'srm', 'manipal',
    'university', 'college', 'institute', 'coep', 'vjti', 'iisc', 'iim',
    'engineering', 'technology', 'polytechnic', 'deemed'
]

def _extract_logo(soup, base_url: str) -> str:
    """Extract best quality logo/favicon from parsed HTML."""
    try:
        og = soup.find("meta", property="og:image")
        if og and og.get("content") and not str(og["content"]).startswith("data:"):
            return urljoin(base_url, og["content"])
        for rel in ["apple-touch-icon-precomposed", "apple-touch-icon"]:
            icon = soup.find("link", rel=rel)
            if icon and icon.get("href") and not str(icon["href"]).startswith("data:"):
                return urljoin(base_url, icon["href"])
        for icon in soup.find_all("link"):
            rel_val = icon.get("rel", [])
            rel_str = " ".join(rel_val) if isinstance(rel_val, list) else str(rel_val)
            if "icon" in rel_str.lower():
                href = icon.get("href", "")
                if href and not str(href).startswith("data:"):
                    return urljoin(base_url, href)
    except Exception:
        pass
    parsed = urlparse(base_url)
    return f"{parsed.scheme}://{parsed.netloc}/favicon.ico"

def _safe_int(val) -> int | None:
    """Safely convert to int, handles ranges like '101-150' → 101, returns None if invalid."""
    if val is None:
        return None
    if isinstance(val, (int, float)):
        n = int(val)
        return n if n > 0 else None
    match = re_lib.search(r'\d+', str(val))
    if match:
        n = int(match.group())
        return n if n > 0 else None
    return None

def _extract_rich_text(soup) -> str:
    """Extract plain text + table data as structured text for Claude."""
    # Extract tables first (great source of fees, packages, cutoffs)
    table_chunks = []
    for table in soup.find_all("table")[:5]:
        rows = []
        for row in table.find_all("tr")[:10]:
            cells = [c.get_text(strip=True) for c in row.find_all(["td", "th"])]
            cells = [c for c in cells if c]
            if cells:
                rows.append(" | ".join(cells))
        if rows:
            table_chunks.append("TABLE: " + " || ".join(rows[:8]))

    # Remove non-content tags
    for tag in soup(["script", "style", "nav", "footer", "header", "aside", "noscript", "iframe"]):
        tag.decompose()

    plain = " ".join(soup.get_text(separator=" ", strip=True).split())
    combined = plain + ("\n\n" + "\n".join(table_chunks) if table_chunks else "")
    return combined

def _find_subpages(soup, base_url: str) -> list:
    """Find up to 3 relevant subpage URLs (placements, admissions, about, fees)."""
    KW = ["placement", "admission", "fee", "about", "ranking", "academics",
          "statistics", "cutoff", "course", "program", "facility"]
    base_domain = urlparse(base_url).netloc
    seen = {base_url}
    results = []
    for a in soup.find_all("a", href=True):
        href = str(a.get("href", ""))
        link_text = a.get_text(strip=True).lower()
        if not any(kw in link_text or kw in href.lower() for kw in KW):
            continue
        full = urljoin(base_url, href)
        parsed = urlparse(full)
        if parsed.netloc != base_domain or full in seen:
            continue
        if not full.startswith("http"):
            continue
        seen.add(full)
        results.append(full)
        if len(results) >= 3:
            break
    # Fallback: try common paths if navigation links not found
    if len(results) < 2:
        parsed_base = urlparse(base_url)
        root = f"{parsed_base.scheme}://{parsed_base.netloc}"
        for path in ["/placements", "/academics", "/fee-structure", "/about", "/courses", "/admissions"]:
            candidate = root + path
            if candidate not in seen:
                seen.add(candidate)
                results.append(candidate)
            if len(results) >= 3:
                break
    return results[:3]

async def _fetch_and_scrape(url: str) -> tuple:
    """Fetch main page + key subpages, extract rich content, use Claude AI to structure it."""
    url_lower = url.lower()
    if not any(kw in url_lower for kw in COLLEGE_KEYWORDS):
        raise ValueError("Only college/university/institute URLs are accepted")

    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0"}

    async def _get(client, u, timeout=15):
        try:
            r = await client.get(u, headers=headers, timeout=timeout)
            if r.status_code == 200 and "text/html" in r.headers.get("content-type", ""):
                return r.text
        except Exception:
            pass
        return None

    try:
        # verify=False handles expired/self-signed SSL certificates (common on Indian college sites)
        async with httpx.AsyncClient(follow_redirects=True, verify=False) as client:
            main_html = await _get(client, url, timeout=20)
            if not main_html:
                raise ValueError(f"Could not fetch the college website. The site may be down or blocked.")

            main_soup = BeautifulSoup(main_html, "lxml")
            logo_url = _extract_logo(main_soup, url)

            # Find and fetch subpages concurrently for richer data
            subpage_urls = _find_subpages(main_soup, url)
            sub_tasks = [_get(client, u) for u in subpage_urls]
            sub_htmls = await asyncio.gather(*sub_tasks)

    except (httpx.TimeoutException, httpx.ConnectTimeout):
        raise ValueError("Website took too long to respond. Try the college's main homepage.")
    except httpx.RequestError as e:
        raise ValueError(f"Could not reach the website: {str(e)}")

    # Extract rich content from main page
    main_text = _extract_rich_text(main_soup)[:9000]

    # Add subpage content
    sub_parts = []
    for html in sub_htmls:
        if html:
            sub_soup = BeautifulSoup(html, "lxml")
            sub_parts.append(_extract_rich_text(sub_soup)[:2500])

    all_text = main_text
    if sub_parts:
        all_text += "\n\n=== ADDITIONAL PAGES ===\n" + "\n\n---\n".join(sub_parts)
    all_text = all_text[:14000]

    if len(all_text) < 100:
        raise ValueError("Could not extract text from this page")

    logger.info(f"Scraping {url}: {len(all_text)} chars, {len(sub_parts)} subpages")

    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"college_scrape_{uuid.uuid4()}",
            system_message="You are a precise data extraction AI for Indian educational institutions. Always return valid JSON only."
        )
        chat.with_model("anthropic", "claude-sonnet-4-5-20250929")
        ai_response = await chat.send_message(UserMessage(text=COLLEGE_EXTRACT_PROMPT + all_text))
    except Exception as e:
        logger.error(f"AI scrape error: {e}")
        raise ValueError("AI extraction failed. Please try again.")

    json_match = re_lib.search(r'\{.*\}', ai_response, re_lib.DOTALL)
    if not json_match:
        raise ValueError("AI could not extract structured data")
    try:
        college_data = json_lib.loads(json_match.group())
    except Exception:
        raise ValueError("AI returned invalid data format")

    if college_data.get("error") == "NOT_A_COLLEGE":
        raise ValueError("This URL does not appear to be a college website")
    if not college_data.get("name"):
        raise ValueError("Could not identify college name from this page")

    college_id = re_lib.sub(r'[^a-z0-9-]', '-', (college_data.get("short_name") or college_data.get("name", "college")).lower())
    college_id = re_lib.sub(r'-+', '-', college_id).strip('-')[:40]

    # Build Convex doc — omit optional number fields if null to avoid schema errors
    convex_data = {
        "collegeId": college_id,
        "name": college_data.get("name", ""),
        "shortName": college_data.get("short_name") or college_data.get("name", ""),
        "state": college_data.get("state") or "",
        "city": college_data.get("city") or "",
        "type": college_data.get("type") or "Engineering",
        "annualFee": college_data.get("annual_fee") or "",
        "avgPackage": college_data.get("avg_package") or "",
        "highestPackage": college_data.get("highest_package") or "",
        "campusArea": college_data.get("campus_area") or "",
        "website": college_data.get("website") or url,
        "branches": college_data.get("branches") or [],
        "cutoffs": college_data.get("cutoffs") or {},
        "highlights": college_data.get("highlights") or [],
        "counselling": college_data.get("counselling") or ["JoSAA"],
        "description": college_data.get("description") or "",
        "imageUrl": logo_url,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    # Only add optional number fields if they have valid values (avoids Convex null rejection)
    nirf = _safe_int(college_data.get("nirf_rank"))
    if nirf:
        convex_data["nirfRank"] = nirf
    est = _safe_int(college_data.get("established"))
    if est:
        convex_data["established"] = est

    return convex_data, college_data, college_id

COLLEGE_EXTRACT_PROMPT = """You are an expert at extracting structured data about Indian engineering colleges.

Analyze ALL the text below from a college website (may include multiple pages and tables).

CRITICAL RULES:
1. If this is NOT a college/university/institution website, return ONLY: {"error": "NOT_A_COLLEGE"}
2. Extract ONLY facts present in the text. Do NOT invent or assume data.
3. For missing fields use null. For numbers, also accept ranges as strings (e.g. "101-150" for NIRF).
4. Look carefully in TABLES (marked "TABLE:") for fees, packages, branches, and cutoffs.
5. Return ONLY valid JSON — no explanation text, no markdown, no extra fields.

Return this exact JSON structure:
{
  "name": "Full official college name",
  "short_name": "Common abbreviation e.g. COEP, IIT Bombay, VJTI",
  "state": "Indian state name",
  "city": "City name",
  "type": "One of: IIT/NIT/IIIT/BITS/IISc/Deemed/State University/Private/Government",
  "nirf_rank": "integer or range string like '101-150' or null",
  "established": "4-digit year integer or null",
  "annual_fee": "e.g. ₹2.2 Lakhs/year or null",
  "avg_package": "e.g. 18 LPA or null",
  "highest_package": "e.g. 1.5 Cr or null",
  "campus_area": "e.g. 550 acres or null",
  "website": "official website URL",
  "branches": ["CSE", "ECE", "ME", "CE", "EE", "Chemical", "Civil"],
  "cutoffs": {},
  "highlights": ["key highlight 1", "key highlight 2", "key highlight 3"],
  "counselling": ["JoSAA"],
  "description": "2-3 sentence factual description of the college"
}

WEBPAGE TEXT (including TABLE data):
"""

class CollegeScrapeInput(BaseModel):
    url: str
    save: bool = False

class BulkScrapeInput(BaseModel):
    urls: List[str]
    save: bool = False

@api.delete("/admin/colleges/{college_id}")
async def delete_college(college_id: str, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin": raise HTTPException(403, "Admin only")
    result = await convex_mutation("colleges:deleteCollege", {"collegeId": college_id})
    if not result:
        raise HTTPException(404, "College not found")
    logger.info(f"Admin deleted college: {college_id}")
    return {"success": True, "deleted": college_id}


@api.post("/admin/colleges/ai-scrape")
async def ai_scrape_college(body: CollegeScrapeInput, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin": raise HTTPException(403, "Admin only")
    url = body.url.strip()
    if not url.startswith(("http://", "https://")):
        raise HTTPException(400, "URL must start with http:// or https://")
    try:
        convex_data, college_data, college_id = await _fetch_and_scrape(url)
    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        logger.error(f"Scrape error: {e}")
        raise HTTPException(500, "Scraping failed. Please try again.")
    if body.save:
        await convex_mutation("colleges:upsertCollege", {"data": convex_data})
        logger.info(f"College saved: {convex_data['name']}")
    return {
        "success": True,
        "college": serialize_college(convex_data),
        "saved": body.save,
        "college_id": college_id,
        "raw_ai": college_data,
    }

@api.post("/admin/colleges/ai-scrape-bulk")
async def ai_scrape_bulk(body: BulkScrapeInput, user: dict = Depends(get_current_user)):
    if user.get("role") != "admin": raise HTTPException(403, "Admin only")
    urls = [u.strip() for u in body.urls if u.strip()]
    if len(urls) > 20:
        raise HTTPException(400, "Maximum 20 URLs allowed per bulk request")
    results = []
    for url in urls:
        if not url.startswith(("http://", "https://")):
            results.append({"url": url, "success": False, "error": "URL must start with http:// or https://"})
            continue
        try:
            convex_data, college_data, college_id = await _fetch_and_scrape(url)
            if body.save:
                await convex_mutation("colleges:upsertCollege", {"data": convex_data})
                logger.info(f"[Bulk] Saved: {convex_data['name']}")
            results.append({
                "url": url, "success": True,
                "college": serialize_college(convex_data),
                "college_id": college_id, "saved": body.save,
            })
        except ValueError as e:
            results.append({"url": url, "success": False, "error": str(e)})
        except Exception as e:
            logger.error(f"Bulk scrape error {url}: {e}")
            results.append({"url": url, "success": False, "error": "Scraping failed"})
    successful = [r for r in results if r["success"]]
    return {
        "results": results, "total": len(results),
        "successful": len(successful), "failed": len(results) - len(successful),
        "saved": body.save,
    }

# ── Payment Integration ────────────────────────────────
import razorpay
rzp = razorpay.Client(auth=(os.environ.get("RAZORPAY_KEY_ID"), os.environ.get("RAZORPAY_KEY_SECRET")))

class PaymentLinkInput(BaseModel):
    amount: int
    purpose: str
    customer_name: Optional[str] = "Student"
    customer_email: Optional[str] = "student@apnacounsellor.com"
    customer_contact: Optional[str] = "9999999999"

@api.post("/payments/create-link")
async def create_payment_link(body: PaymentLinkInput, user: dict = Depends(get_current_user)):
    try:
        # Amount is in paise, so multiply by 100
        payment_link = rzp.payment_link.create({
            "amount": body.amount * 100,
            "currency": "INR",
            "accept_partial": False,
            "description": body.purpose,
            "customer": {
                "name": user.get("name", body.customer_name),
                "email": user.get("email", body.customer_email),
                "contact": user.get("phone", body.customer_contact)
            },
            "notify": {"sms": True, "email": True},
            "reminder_enable": True,
            "notes": {"user_id": user.get("id"), "purpose": body.purpose},
            "callback_url": "https://apnacounsellor.com/payment-success",
            "callback_method": "get"
        })
        return {"success": True, "payment_url": payment_link["short_url"], "id": payment_link["id"]}
    except Exception as e:
        logger.error(f"Payment Link Error: {e}")
        raise HTTPException(500, f"Failed to create payment link: {str(e)}")

# ── Health ──────────────────────────────────────────────
@api.get("/health")
async def health():
    return {"status": "ok", "app": "Apna Counselor", "database": "Convex",
            "timestamp": datetime.now(timezone.utc).isoformat()}

app.include_router(api)

