from fastapi import FastAPI, HTTPException, Depends, Header, Request
from pydantic import BaseModel
from typing import List, Optional
import os
import uuid
import razorpay
from supabase import create_client, Client
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Apna Counsellor Booking API")

# Supabase Setup
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") # Use Service Role Key in production for backend
# For now using publishable key as provided in .env.local, but ideally backend uses service_role
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_KEY)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Razorpay Setup
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# Models
class AvailabilityCheck(BaseModel):
    mentor_id: str
    date: str

class PriceCalculation(BaseModel):
    duration_minutes: int

class RazorpayOrderCreate(BaseModel):
    student_id: str
    mentor_id: str
    date: str
    time: str
    duration: int

class PaymentVerification(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str
    booking_details: dict

@app.get("/")
def read_root():
    return {"message": "Apna Counsellor Booking API is live"}

@app.post("/api/bookings/calculate-price")
async def calculate_price(data: PriceCalculation):
    duration = data.duration_minutes
    
    # 5 minutes = ₹50, 10 = ₹100, etc. (₹10 per minute)
    # Custom is also ₹10 per minute
    service_price = duration * 10
    platform_fee = service_price * 0.10
    total_price = service_price + platform_fee
    
    return {
        "service_price": service_price,
        "platform_fee": platform_fee,
        "total_price": total_price
    }

@app.post("/api/bookings/check-availability")
async def check_availability(data: AvailabilityCheck):
    # Fetch availability for the specific mentor and date
    # In a real app, you'd check day of week and existing bookings
    date_obj = datetime.strptime(data.date, "%Y-%m-%d")
    day_of_week = date_obj.strftime("%a").lower()
    
    response = supabase.table("mentor_availability") \
        .select("*") \
        .eq("mentor_id", data.mentor_id) \
        .eq("day_of_week", day_of_week) \
        .eq("is_available", True) \
        .execute()
    
    # Get existing bookings for that date to filter out slots
    bookings_response = supabase.table("bookings") \
        .select("scheduled_time") \
        .eq("mentor_id", data.mentor_id) \
        .eq("scheduled_date", data.date) \
        .neq("status", "cancelled") \
        .execute()
    
    booked_slots = [b['scheduled_time'] for b in bookings_response.data]
    
    available_slots = []
    for slot in response.data:
        if slot['start_time'] not in booked_slots:
            available_slots.append(slot['start_time'])
            
    return {"available_slots": available_slots}

@app.post("/api/payments/create-razorpay-order")
async def create_razorpay_order(data: RazorpayOrderCreate):
    # Calculate price again for security
    service_price = data.duration * 10
    platform_fee = service_price * 0.10
    total_price = int((service_price + platform_fee) * 100) # Amount in paise
    
    order_data = {
        "amount": total_price,
        "currency": "INR",
        "receipt": f"receipt_{uuid.uuid4().hex[:10]}",
        "notes": {
            "student_id": data.student_id,
            "mentor_id": data.mentor_id,
            "date": data.date,
            "time": data.time,
            "duration": data.duration
        }
    }
    
    try:
        order = razorpay_client.order.create(data=order_data)
        return order
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/payments/verify-payment")
async def verify_payment(data: PaymentVerification):
    try:
        # Verify signature
        params_dict = {
            'razorpay_order_id': data.razorpay_order_id,
            'razorpay_payment_id': data.razorpay_payment_id,
            'razorpay_signature': data.razorpay_signature
        }
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        # If signature is valid, create the booking
        details = data.booking_details
        service_price = details['duration'] * 10
        platform_fee = service_price * 0.10
        total_price = service_price + platform_fee
        
        booking_data = {
            "student_id": details['student_id'],
            "mentor_id": details['mentor_id'],
            "duration_minutes": details['duration'],
            "service_price": service_price,
            "platform_fee": platform_fee,
            "total_price": total_price,
            "scheduled_date": details['date'],
            "scheduled_time": details['time'],
            "status": "confirmed",
            "payment_id": data.razorpay_payment_id,
            "meeting_link": f"https://meet.jit.si/apnacounsellor-{uuid.uuid4().hex[:8]}"
        }
        
        result = supabase.table("bookings").insert(booking_data).execute()
        
        if len(result.data) > 0:
            booking_id = result.data[0]['id']
            # Also log payment
            payment_log = {
                "booking_id": booking_id,
                "razorpay_order_id": data.razorpay_order_id,
                "razorpay_payment_id": data.razorpay_payment_id,
                "razorpay_signature": data.razorpay_signature,
                "amount_paid": total_price,
                "payment_status": "success"
            }
            supabase.table("booking_payments").insert(payment_log).execute()
            
            return {"success": True, "booking_id": booking_id, "meeting_link": booking_data['meeting_link']}
        
        return {"success": False, "error": "Failed to create booking"}
        
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
