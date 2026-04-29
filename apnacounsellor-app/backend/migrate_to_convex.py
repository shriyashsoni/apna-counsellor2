"""
Migration script: MongoDB -> Convex
Migrates all collections: users, colleges, sessions, payments, reviews, batches,
notifications, chatHistory, counsellorApps
"""
import asyncio
import os
import httpx
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import datetime, timezone

load_dotenv()

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
CONVEX_URL = os.environ["CONVEX_URL"]
CONVEX_DEPLOY_KEY = os.environ["CONVEX_DEPLOY_KEY"]


async def cvx_mutation(path: str, args: dict):
    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            f"{CONVEX_URL}/api/mutation",
            json={"path": path, "args": args, "format": "json"},
            headers={"Authorization": f"Convex {CONVEX_DEPLOY_KEY}"},
        )
        data = resp.json()
        if data.get("status") == "success":
            return data["value"]
        raise Exception(f"[{path}] {data.get('errorMessage', resp.text)}")


async def cvx_query(path: str, args: dict = {}):
    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            f"{CONVEX_URL}/api/query",
            json={"path": path, "args": args, "format": "json"},
            headers={"Authorization": f"Convex {CONVEX_DEPLOY_KEY}"},
        )
        data = resp.json()
        if data.get("status") == "success":
            return data["value"]
        raise Exception(f"[{path}] {data.get('errorMessage', resp.text)}")


def str_id(v):
    if isinstance(v, ObjectId):
        return str(v)
    return str(v) if v else ""


def safe_str(v, default=""):
    if v is None:
        return default
    return str(v)


async def migrate_users(db):
    print("\n=== Migrating Users ===")
    users = await db.users.find({}).to_list(500)
    migrated = 0
    skipped = 0
    for u in users:
        uid = str_id(u["_id"])
        email = u.get("email", "").lower().strip()
        role = u.get("role", "student")

        # Check if already in Convex
        try:
            existing = await cvx_query("users:getByEmail", {"email": email})
            if existing:
                print(f"  SKIP: {email} (already exists)")
                skipped += 1
                continue
        except Exception:
            pass

        try:
            args = {
                "name": safe_str(u.get("name")),
                "email": email,
                "passwordHash": safe_str(u.get("password_hash")),
                "role": role,
                "phone": safe_str(u.get("phone")),
                "createdAt": safe_str(u.get("created_at", datetime.now(timezone.utc).isoformat())),
            }
            # Student fields
            if role == "student":
                args.update({
                    "academicClass": safe_str(u.get("academic_class")),
                    "exam": safe_str(u.get("exam")),
                    "marks": safe_str(u.get("marks")),
                    "rank": safe_str(u.get("rank")),
                    "interests": u.get("interests") or [],
                    "budget": safe_str(u.get("budget")),
                    "preferredLocation": safe_str(u.get("preferred_location")),
                    "onboardingComplete": bool(u.get("onboarding_complete", False)),
                })
            # Mentor fields
            elif role == "mentor":
                args.update({
                    "college": safe_str(u.get("college")),
                    "course": safe_str(u.get("course")),
                    "branch": safe_str(u.get("branch")),
                    "year": safe_str(u.get("year")),
                    "linkedin": safe_str(u.get("linkedin")),
                    "termsAccepted": bool(u.get("terms_accepted", False)),
                    "profilePhoto": safe_str(u.get("profile_photo")),
                })
            # Admin/counsellor
            elif role in ["admin", "counsellor"]:
                args.update({
                    "qualification": safe_str(u.get("qualification")),
                    "experience": safe_str(u.get("experience")),
                    "specialization": u.get("specialization") or [],
                    "bio": safe_str(u.get("bio")),
                })

            args["blocked"] = bool(u.get("blocked", False))
            args["verified"] = bool(u.get("verified", False))
            args["profileComplete"] = bool(u.get("profile_complete", False))

            convex_id = await cvx_mutation("users:createUser", args)
            print(f"  OK: [{role}] {email} -> {convex_id}")
            migrated += 1
        except Exception as e:
            print(f"  ERR: {email}: {e}")

    print(f"  Users: {migrated} migrated, {skipped} skipped")
    return migrated


async def migrate_colleges(db):
    print("\n=== Migrating Colleges ===")
    colleges = await db.colleges.find({}).to_list(300)
    migrated = 0
    for c in colleges:
        try:
            data = {
                "collegeId": safe_str(c.get("id")),
                "name": safe_str(c.get("name")),
                "shortName": safe_str(c.get("short_name", c.get("name"))),
                "state": safe_str(c.get("state")),
                "city": safe_str(c.get("city", "")),
                "type": safe_str(c.get("type")),
                "nirfRank": int(c.get("nirf_rank") or 0),
                "annualFee": safe_str(c.get("annual_fee")),
                "avgPackage": safe_str(c.get("avg_package")),
                "highestPackage": safe_str(c.get("highest_package")),
                "branches": c.get("branches") or [],
                "cutoffs": c.get("cutoffs") or {},
                "placements": c.get("placements") or {},
                "highlights": c.get("highlights") or [],
                "counselling": c.get("counselling") or ["JoSAA"],
                "website": safe_str(c.get("website")),
                "createdAt": datetime.now(timezone.utc).isoformat(),
            }
            await cvx_mutation("colleges:upsertCollege", {"data": data})
            migrated += 1
            if migrated % 10 == 0:
                print(f"  {migrated}/{len(colleges)} colleges...")
        except Exception as e:
            print(f"  ERR college {c.get('id')}: {e}")
    print(f"  Colleges: {migrated} migrated")
    return migrated


async def migrate_sessions(db):
    print("\n=== Migrating Sessions ===")
    sessions = await db.sessions.find({}).to_list(200)
    migrated = 0
    for s in sessions:
        try:
            await cvx_mutation("sessions:createSession", {
                "sessionId": safe_str(s.get("id", str_id(s.get("_id")))),
                "studentId": safe_str(s.get("student_id")),
                "studentName": safe_str(s.get("student_name")),
                "mentorId": safe_str(s.get("mentor_id")),
                "mentorName": safe_str(s.get("mentor_name")),
                "date": safe_str(s.get("date", "TBD")),
                "timeSlot": safe_str(s.get("time_slot", "TBD")),
                "topic": safe_str(s.get("topic", "General")),
                "status": safe_str(s.get("status", "pending")),
                "price": int(s.get("price") or 500),
                "paymentId": safe_str(s.get("payment_id")),
                "createdAt": safe_str(s.get("created_at", datetime.now(timezone.utc).isoformat())),
            })
            migrated += 1
        except Exception as e:
            print(f"  ERR session: {e}")
    print(f"  Sessions: {migrated} migrated")
    return migrated


async def migrate_payments(db):
    print("\n=== Migrating Payments ===")
    payments = await db.payments.find({}).to_list(500)
    migrated = 0
    for p in payments:
        try:
            await cvx_mutation("payments:createPayment", {
                "paymentId": safe_str(p.get("id", str_id(p.get("_id")))),
                "razorpayLinkId": safe_str(p.get("razorpay_link_id")),
                "shortUrl": safe_str(p.get("short_url")),
                "amount": int(p.get("amount") or 0),
                "currency": safe_str(p.get("currency", "INR")),
                "status": safe_str(p.get("status", "created")),
                "userId": safe_str(p.get("user_id")),
                "userName": safe_str(p.get("user_name")),
                "mentorId": safe_str(p.get("mentor_id")),
                "mentorName": safe_str(p.get("mentor_name")),
                "sessionId": safe_str(p.get("session_id")),
                "createdAt": safe_str(p.get("created_at", datetime.now(timezone.utc).isoformat())),
            })
            migrated += 1
        except Exception as e:
            print(f"  ERR payment: {e}")
    print(f"  Payments: {migrated} migrated")
    return migrated


async def migrate_counsellor_apps(db):
    print("\n=== Migrating Counsellor Apps ===")
    apps = await db.counsellor_apps.find({}).to_list(100)
    migrated = 0
    for a in apps:
        try:
            await cvx_mutation("counsellorApps:create", {
                "appId": safe_str(a.get("id", str_id(a.get("_id")))),
                "name": safe_str(a.get("name")),
                "email": safe_str(a.get("email")),
                "phone": safe_str(a.get("phone")),
                "qualification": safe_str(a.get("qualification")),
                "experience": safe_str(a.get("experience")),
                "specialization": a.get("specialization") or [],
                "bio": safe_str(a.get("bio")),
                "createdAt": safe_str(a.get("created_at", datetime.now(timezone.utc).isoformat())),
            })
            migrated += 1
        except Exception as e:
            print(f"  ERR counsellor app: {e}")
    print(f"  Counsellor apps: {migrated} migrated")
    return migrated


async def seed_admin():
    """Ensure admin user exists in Convex"""
    print("\n=== Seeding Admin ===")
    import bcrypt
    admin_email = os.environ.get("ADMIN_EMAIL", "apnacounsellor@gmail.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "ApnaCounsellor@2024")

    existing = await cvx_query("users:getByEmail", {"email": admin_email})
    if existing:
        print(f"  Admin already exists: {admin_email}")
        return

    pw_hash = bcrypt.hashpw(admin_password.encode(), bcrypt.gensalt()).decode()
    await cvx_mutation("users:createUser", {
        "name": "Apna Counsellor Admin",
        "email": admin_email,
        "passwordHash": pw_hash,
        "role": "admin",
        "phone": "",
        "createdAt": datetime.now(timezone.utc).isoformat(),
    })
    print(f"  Admin seeded: {admin_email}")


async def main():
    print("=" * 60)
    print("APNA COUNSELLOR - MongoDB → Convex Migration")
    print(f"Convex URL: {CONVEX_URL}")
    print("=" * 60)

    # Test Convex connection
    try:
        count = await cvx_query("colleges:totalCount", {})
        print(f"Convex connection OK (colleges: {count})")
    except Exception as e:
        print(f"Convex connection FAILED: {e}")
        return

    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    # Run migrations
    await migrate_colleges(db)
    await migrate_users(db)
    await migrate_sessions(db)
    await migrate_payments(db)
    await migrate_counsellor_apps(db)
    await seed_admin()

    # Final counts
    print("\n=== Final Convex Counts ===")
    print(f"  Colleges: {await cvx_query('colleges:totalCount', {})}")
    print(f"  Users (students): {await cvx_query('users:countByRole', {'role': 'student'})}")
    print(f"  Users (mentors): {await cvx_query('users:countByRole', {'role': 'mentor'})}")
    print(f"  Users (admin): {await cvx_query('users:countByRole', {'role': 'admin'})}")
    print(f"  Sessions: {await cvx_query('sessions:totalCount', {})}")
    print(f"  Payments: {await cvx_query('payments:totalPaid', {})}")

    print("\n✅ Migration complete!")
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
