from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from convex import ConvexClient
import os

app = FastAPI(title="Apna Counsellor 2026 - Insane Backend")

# Convex Setup
CONVEX_URL = os.getenv("CONVEX_URL", "https://your-deployment.convex.cloud")
client = ConvexClient(CONVEX_URL)

class UserProfile(BaseModel):
    rank: int
    marks: Optional[int] = None
    category: str
    preferences: List[str]

class PredictionResponse(BaseModel):
    colleges: List[dict]
    probability: str
    advice: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the Apna Counsellor 2026 Global API"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_admission(profile: UserProfile):
    """
    Predicts admission chances using historical data and AI reasoning.
    """
    # Logic to query Convex and perform AI-based prediction
    # For now, returning a mock insane response
    return {
        "colleges": [
            {"name": "IIT Bombay", "course": "Computer Science", "chance": "Safe"},
            {"name": "MIT", "course": "Mechanical Engineering", "chance": "Borderline"}
        ],
        "probability": "85%",
        "advice": "Based on your rank and category, you have an excellent chance at top-tier institutes. Focus on choice locking for IIT Bombay."
    }

@app.get("/counseling/{counseling_id}")
async def get_counseling_details(counseling_id: str):
    """
    Fetches real-time counseling details extracted by our agent.
    """
    try:
        # data = await client.query("counselings:getById", {"id": counseling_id})
        return {"id": counseling_id, "name": "JoSAA", "status": "Active", "next_step": "Choice Filling starts on June 15th"}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Counseling not found")

@app.post("/agent/chat")
async def agent_chat(query: str, agent_id: str):
    """
    Interactive AI Agent Chat for specific counseling.
    """
    # Integrate with Puter AI or other LLM
    return {"response": f"I am your {agent_id} assistant. You can apply to the following colleges..."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
