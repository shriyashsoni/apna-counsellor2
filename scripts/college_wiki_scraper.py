import os
import sys
import time
import requests
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv(dotenv_path='.env.local')

SUPABASE_URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Missing Supabase environment variables in .env.local!")
    sys.exit(1)

# Helper to fetch colleges from Supabase REST API
def fetch_colleges(limit=20, state_filter=None):
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    url = f"{SUPABASE_URL}/rest/v1/colleges"
    params = {
        "select": "id,name,city,state,established,website,avg_package,description",
        "description": "is.null",
        "limit": limit
    }
    
    if state_filter:
        params["state"] = f"eq.{state_filter}"
        
    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            return response.json()
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
        return False

# Search Wikipedia API for a college
def fetch_wikipedia_details(college_name):
    print("   📡 Querying Wikipedia API...")
    search_url = "https://en.wikipedia.org/w/api.php"
    
    # Step 1: Search for the best matching article title
    search_params = {
        "action": "query",
        "list": "search",
        "srsearch": college_name,
        "format": "json",
        "utf8": 1
    }
    
    try:
        r = requests.get(search_url, params=search_params, timeout=10)
        results = r.json().get("query", {}).get("search", [])
        if not results:
            return None
            
        best_title = results[0]["title"]
        print(f"   📖 Found matching article: \"{best_title}\"")
        
        # Step 2: Fetch the summary and info of the best matching page
        content_params = {
            "action": "query",
            "prop": "extracts|info",
            "exintro": True,
            "explaintext": True,
            "titles": best_title,
            "inprop": "url",
            "format": "json"
        }
        
        r_content = requests.get(search_url, params=content_params, timeout=10)
        pages = r_content.json().get("query", {}).get("pages", {})
        
        for page_id, page_data in pages.items():
            if page_id == "-1":
                continue
            
            summary = page_data.get("extract", "")
            wiki_url = page_data.get("fullurl", "")
            
            # Simple heuristic cleaning of Wikipedia introduction text
            if len(summary) > 50:
                sentences = summary.split(". ")
                clean_desc = ". ".join(sentences[:3]) + "."
                return {
                    "description": clean_desc,
                    "website": wiki_url
                }
        return None
    except Exception as e:
        print(f"   ⚠️ Wikipedia API failed: {e}")
        return None

def start_scraper():
    print("\n=======================================================")
    print("🌟    WELCOME TO THE 100% FREE WIKIPEDIA SCRAPER    🌟")
    print("=======================================================")
    print("🌐 Queries Wikipedia's Free API to enrich college profiles.")
    print("🚀 0 Credit usage | Unlimited runs | Zero rate-limits!\n")

    limit = 20
    if len(sys.argv) > 1:
        try:
            limit = int(sys.argv[1])
        except ValueError:
            pass

    state_filter = sys.argv[2] if len(sys.argv) > 2 else None

    print(f"⚙️ Config: Target = {limit} colleges | State Filter = {state_filter or 'None'}")
    print("📡 Fetching target colleges from Supabase...")
    colleges = fetch_colleges(limit, state_filter)

    if not colleges:
        print("🎉 Outstanding! No colleges found without descriptions.")
        return

    print(f"📋 Found {len(colleges)} colleges requiring descriptions.")

    success_count = 0

    for i, col in enumerate(colleges):
        print(f"\n-------------------------------------------------------")
        print(f"🔍 [{i+1}/{len(colleges)}] Scraping: \"{col['name']}\"")
        
        wiki_data = fetch_wikipedia_details(col['name'])
        
        if wiki_data:
            print("💡 Wikipedia Facts Retrieved:")
            print(f" - Profile Excerpt: \"{wiki_data['description'][:80]}...\"")
            print(f" - Reference Link: {wiki_data['website']}")

            print("💾 Upgrading database row...")
            
            update_payload = {
                "description": wiki_data["description"],
                "website": wiki_data["website"] if not col.get("website") or col.get("website") == "#" else col.get("website")
            }

            if update_college(col['id'], update_payload):
                print("✅ Supabase row updated successfully!")
                success_count += 1
            else:
                print("❌ Failed to update Supabase row.")
        else:
            print("❌ No matching Wikipedia article found.")

        # Brief rate limit sleep to respect Wiki servers
        time.sleep(1)

    print(f"\n=======================================================")
    print(f"🎉 WIKIPEDIA SCRAPER TASK COMPLETED!")
    print(f"📈 Successfully enriched & upgraded: {success_count}/{len(colleges)} colleges.")
    print(f"=======================================================\n")

if __name__ == "__main__":
    start_scraper()
