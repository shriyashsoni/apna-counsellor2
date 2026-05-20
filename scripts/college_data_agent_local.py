import os
import sys
import time
import json
import requests
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv(dotenv_path='.env.local')

SUPABASE_URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
OLLAMA_URL = "http://localhost:11434/api/chat"

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Missing Supabase environment variables in .env.local!")
    sys.exit(1)

# Helper to fetch colleges from Supabase REST API (No extra library installation required)
def fetch_colleges(limit=10, state_filter=None):
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    # Filter colleges where details are null
    url = f"{SUPABASE_URL}/rest/v1/colleges"
    params = {
        "select": "id,name,city,state,established,website,avg_package",
        "or": "(established.is.null,website.eq.#,website.is.null,avg_package.is.null)",
        "limit": limit
    }
    
    if state_filter:
        params["state"] = f"eq.{state_filter}"
        
    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Failed to fetch colleges from Supabase: Status {response.status_code}")
            print(response.text)
            return []
    except Exception as e:
        print(f"❌ Error connecting to Supabase: {e}")
        return []

# Helper to update a college row in Supabase
def update_college(college_id, payload):
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    url = f"{SUPABASE_URL}/rest/v1/colleges?id=eq.{college_id}"
    
    try:
        response = requests.patch(url, headers=headers, json=payload)
        return response.status_code in [200, 204]
    except Exception as e:
        print(f"   ❌ Error updating Supabase: {e}")
        return False

# Query local Ollama model (100% Free, Private & Unlimited)
def query_ollama(model_name, college_name, college_city, college_state):
    prompt = f"""You are a high-fidelity Indian college data retrieval agent.
Find the real-world, verified facts for: "{college_name}" located in "{college_city or ''}, {college_state or ''}".
Provide:
1. Established Year (exact year as an integer, e.g. 1996)
2. Official website URL (homepage of the college, e.g. https://www.vjti.ac.in)
3. Average package in placements (in LPA, e.g. '8.5 LPA')
4. Average annual tuition fee for B.Tech/equivalent (e.g. '₹1,30,000')
5. A professional 3-sentence institutional description.
6. List 3-4 top academic engineering/technical branches.

Return EXACTLY a JSON object matching this schema (do not wrap in markdown, output raw JSON):
{{
  "established": integer or null,
  "website": string or null,
  "avg_package": string or null,
  "annual_fee": string or null,
  "description": string,
  "branches": string[]
}}"""

    payload = {
        "model": model_name,
        "messages": [{"role": "user", "content": prompt}],
        "format": "json",
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        if response.status_code == 200:
            content = response.json().get("message", {}).get("content", "")
            return json.loads(content)
        else:
            print(f"   ⚠️ Ollama returned status code: {response.status_code}")
            return None
    except requests.exceptions.ConnectionError:
        print("   ❌ Error: Connection to local Ollama failed! Is Ollama running?")
        print("   👉 Run 'ollama serve' in a terminal and try again.")
        sys.exit(1)
    except Exception as e:
        print(f"   ⚠️ Failed to parse Ollama output: {e}")
        return None

def start_agent():
    print("\n=======================================================")
    print("🌟 WELCOME TO THE 100% FREE LOCAL PYTHON DATA AGENT 🌟")
    print("=======================================================")
    print("🔒 Runs entirely on your computer's hardware using Ollama.")
    print("🚀 0 Credit usage | Unlimited runs | Zero rate-limits!\n")

    limit = 10
    if len(sys.argv) > 1:
        try:
            limit = int(sys.argv[1])
        except ValueError:
            pass

    state_filter = sys.argv[2] if len(sys.argv) > 2 else None
    
    # Check Ollama status and get running models
    try:
        models_response = requests.get("http://localhost:11434/api/tags")
        available_models = [m["name"] for m in models_response.json().get("models", [])]
    except Exception:
        print("❌ Error: Cannot connect to local Ollama!")
        print("👉 Please download Ollama from https://ollama.com, install it, and run it.")
        print("👉 Then download a model, e.g. run in PowerShell: ollama pull llama3.2")
        sys.exit(1)

    if not available_models:
        print("❌ Error: No models found in Ollama!")
        print("👉 Please download a model first. Example: ollama pull llama3.2")
        sys.exit(1)

    # Use the first available model, preferably llama3.2 or qwen
    selected_model = available_models[0]
    for model in ["llama3.2:latest", "llama3.2", "qwen2.5:7b", "qwen2.5", "llama3.1"]:
        if model in available_models:
            selected_model = model
            break

    print(f"⚙️ Config: Target = {limit} colleges | State Filter = {state_filter or 'None'}")
    print(f"🤖 Selected Local Model: {selected_model}")
    print(f"📦 Available Local Models: {', '.join(available_models)}")

    print("\n📡 Fetching target colleges from Supabase...")
    colleges = fetch_colleges(limit, state_filter)

    if not colleges:
        print("🎉 Outstanding! No colleges found that require data enrichment.")
        return

    print(f"📋 Found {len(colleges)} colleges requiring data enrichment.")

    success_count = 0

    for i, col in enumerate(colleges):
        print(f"\n-------------------------------------------------------")
        print(f"🔍 [{i+1}/{len(colleges)}] Enriching: \"{col['name']}\"")
        print(f"📍 Location: {col.get('city') or 'Unknown City'}, {col.get('state') or 'Unknown State'}")
        
        start_time = time.time()
        real_data = query_ollama(selected_model, col['name'], col.get('city'), col.get('state'))
        
        if real_data:
            duration = time.time() - start_time
            print(f"⚡ Local AI Inference took {duration:.2f}s")
            print("💡 Real Details Retrieved:")
            print(f" - Website: {real_data.get('website') or 'N/A'}")
            print(f" - Established: {real_data.get('established') or 'N/A'}")
            print(f" - Avg Package: {real_data.get('avg_package') or 'N/A'}")
            print(f" - Annual Fee: {real_data.get('annual_fee') or 'N/A'}")
            print(f" - Top Branches: {', '.join(real_data.get('branches', [])[:3]) or 'None'}")
            print(f" - Profile Excerpt: \"{real_data.get('description', '')[:60]}...\"")

            print("💾 Upgrading database row...")
            
            update_payload = {
                "website": real_data.get("website") or col.get("website") or "#",
                "established": real_data.get("established") or col.get("established"),
                "avg_package": real_data.get("avg_package") or col.get("avg_package"),
                "annual_fee": real_data.get("annual_fee"),
                "description": real_data.get("description"),
                "branches": real_data.get("branches")
            }

            if update_college(col['id'], update_payload):
                print("✅ Supabase row updated successfully!")
                success_count += 1
            else:
                print("❌ Failed to update Supabase row.")
        else:
            print("❌ Failed to get data from local model.")

        # Minimal delay just to throttle CPU/GPU load slightly
        time.sleep(0.5)

    print(f"\n=======================================================")
    print(f"🎉 LOCAL AGENT TASK COMPLETED!")
    print(f"📈 Successfully enriched & upgraded: {success_count}/{len(colleges)} colleges.")
    print(f"=======================================================\n")

if __name__ == "__main__":
    start_agent()
