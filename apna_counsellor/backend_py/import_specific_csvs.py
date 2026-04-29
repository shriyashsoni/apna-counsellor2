import pandas as pd
import os
from convex import ConvexClient
from tqdm import tqdm
import time

# Convex Setup
CONVEX_URL = os.getenv("CONVEX_URL", "https://brazen-caterpillar-18.convex.cloud")
client = ConvexClient(CONVEX_URL)

def import_csv(file_path, counseling_name, category, region):
    print(f"Importing {file_path} for {counseling_name}...")
    
    # 1. Ensure Counseling exists
    counseling_id = client.mutation("counselings:addCounseling", {
        "name": counseling_name,
        "category": category,
        "region": region,
        "description": f"Detailed college list for {counseling_name}."
    })
    
    df = pd.read_csv(file_path, encoding='latin1', on_bad_lines='skip')
    total = len(df)
    batch_size = 100
    
    print(f"Pushing {total} colleges in batches of {batch_size}...")
    
    for i in tqdm(range(0, total, batch_size)):
        batch = df.iloc[i:i+batch_size]
        colleges_to_add = []
        for _, row in batch.iterrows():
            name = str(row.get('name', row.get('College Name', 'Unknown')))
            location = str(row.get('location', row.get('Location', 'Unknown')))
            colleges_to_add.append({
                "counselingId": counseling_id,
                "name": name,
                "location": location,
                "type": "Unknown"
            })
        
        try:
            client.mutation("seed_aishe:bulkAddColleges", {"colleges": colleges_to_add})
        except Exception as e:
            print(f"Error at batch {i}: {e}")
            time.sleep(1)

if __name__ == "__main__":
    # Import India Engineering
    if os.path.exists("datasets/engineering_colleges_india.csv"):
        import_csv("datasets/engineering_colleges_india.csv", "India Engineering (Bulk)", "Engineering", "India")
    
    # Import Maharashtra Colleges
    if os.path.exists("datasets/maharashtra_colleges.csv"):
        import_csv("datasets/maharashtra_colleges.csv", "Maharashtra Directory (Bulk)", "General", "Maharashtra")
