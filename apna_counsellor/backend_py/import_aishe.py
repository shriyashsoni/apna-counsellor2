import json
import os
from convex import ConvexClient
from tqdm import tqdm
import time

# Convex Setup
# Priority: Environment variable, then fallback
CONVEX_URL = os.getenv("CONVEX_URL", "https://brazen-caterpillar-18.convex.cloud")
client = ConvexClient(CONVEX_URL)

def import_aishe(json_path):
    print(f"Loading AISHE data from {json_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"Loaded {len(data)} institutions.")
    
    # 1. Ensure Global Directory exists and get ID
    print("Ensuring Global Directory counseling exists...")
    try:
        counseling_id = client.mutation("seed_aishe:seedGeneralDirectory")
        print(f"Counseling ID: {counseling_id}")
    except Exception as e:
        print(f"Error getting counseling ID: {e}")
        return

    # 2. Batch add colleges
    batch_size = 100
    total = len(data)
    
    print(f"Starting bulk import of {total} colleges in batches of {batch_size}...")
    
    # To handle crashes/resumes, we could check existing count, 
    # but for simplicity we'll just skip records with errors.
    
    for i in tqdm(range(0, total, batch_size)):
        batch = data[i:i+batch_size]
        colleges_to_add = []
        for item in batch:
            # Robust key handling
            name = item.get("name", "Unknown College")
            state = item.get("state", "Unknown State")
            district = item.get("district", "")
            aishe_code = item.get("aishe_code", "N/A")
            
            location = f"{district}, {state}" if district else state
            
            colleges_to_add.append({
                "counselingId": counseling_id,
                "name": name,
                "location": location,
                "type": "Unknown",
                "aisheCode": aishe_code
            })
        
        try:
            client.mutation("seed_aishe:bulkAddColleges", {"colleges": colleges_to_add})
        except Exception as e:
            print(f"Error at batch {i}: {e}")
            time.sleep(2) # Backoff
            # Try once more
            try:
                client.mutation("seed_aishe:bulkAddColleges", {"colleges": colleges_to_add})
            except:
                print(f"Failed batch {i} permanently. Skipping...")
            
    print("Import completed!")

if __name__ == "__main__":
    import_aishe("datasets/aishe_institutions.json")
