import os
import json
import subprocess

def sync():
    base_path = "apna_counsellor/counselings_data"
    counseling_list = []
    
    for folder in os.listdir(base_path):
        folder_path = os.path.join(base_path, folder)
        if os.path.isdir(folder_path):
            name = folder.replace("_", " ")
            category = "Engineering"
            region = "India"
            
            # Simple heuristics for classification
            if any(x in folder for x in ["Medical", "NEET", "MCC", "AACCC"]):
                category = "Medical"
            
            if any(x in folder for x in ["Swiss", "UCAS", "Univ_NZ", "California", "UAC", "VFS"]):
                region = "International"
            
            counseling_list.append({
                "id": folder,
                "name": name,
                "category": category,
                "region": region,
                "exam": name
            })

    # Chunk into 50 for Convex limits
    chunk_size = 50
    for i in range(0, len(counseling_list), chunk_size):
        chunk = counseling_list[i:i+chunk_size]
        json_payload = json.dumps({"counselingList": chunk})
        
        print(f"Syncing batch {i//chunk_size + 1}...")
        try:
            # Use shell=True for windows
            subprocess.run(f"npx convex run sync:syncCounselings '{json_payload}'", shell=True, check=True)
        except Exception as e:
            print(f"Error syncing batch: {e}")

if __name__ == "__main__":
    sync()
