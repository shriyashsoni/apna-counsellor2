import pandas as pd
import os
import json

def create_massive_db():
    print("Creating the 50,000+ University Database...")
    
    # 1. Load the 48k Massive Dataset
    massive_path = r"datasets\massive_world_universities\World University Rankings.csv"
    df_massive = pd.read_csv(massive_path, encoding='latin1')
    print(f"Loaded massive dataset: {len(df_massive)} records.")

    # 2. Load Indian Colleges (5.4k)
    indian_path = r"datasets\engineering_colleges_india.csv"
    df_indian = pd.read_csv(indian_path, encoding='latin1')
    print(f"Loaded Indian dataset: {len(df_indian)} records.")

    # 3. Load QS Rankings
    qs_path = r"datasets\qs-world-university-rankings-2025\QS World University Rankings 2025 (Top global universities).csv"
    df_qs = pd.read_csv(qs_path, encoding='latin1')
    print(f"Loaded QS dataset: {len(df_qs)} records.")

    # Standardize columns to merge
    # We want: Name, Location, Rank, Type
    
    # Process Massive
    df_massive_clean = pd.DataFrame({
        "name": df_massive.get('university_name', df_massive.get('Name', df_massive.iloc[:, 0])),
        "location": df_massive.get('country', 'Global'),
        "rank": df_massive.get('world_rank', 'N/A'),
        "source": "Global Registry"
    })

    # Process Indian
    df_indian_clean = pd.DataFrame({
        "name": df_indian['College Name'],
        "location": df_indian['State'] + ", India",
        "rank": df_indian['Rating'],
        "source": "India Engineering Registry"
    })

    # Process QS
    df_qs_clean = pd.DataFrame({
        "name": df_qs['Institution_Name'],
        "location": df_qs['Location'],
        "rank": df_qs['RANK_2025'],
        "source": "QS World 2025"
    })

    # Combine everything
    master_df = pd.concat([df_massive_clean, df_indian_clean, df_qs_clean], ignore_index=True)
    
    # Remove duplicates
    master_df.drop_duplicates(subset=['name'], keep='first', inplace=True)
    
    print(f"Total Unique Records in Master Database: {len(master_df)}")

    # Save to CSV
    master_csv_path = r"datasets\world_universities_master_50k.csv"
    master_df.to_csv(master_csv_path, index=False)
    print(f"Saved master database to: {master_csv_path}")

    # Also save a JSON version for the backend
    master_json_path = r"datasets\world_universities_master_50k.json"
    # To save memory, we'll only save name and location for the main list
    master_df[['name', 'location']].to_json(master_json_path, orient='records', indent=4)
    print(f"Saved JSON index for backend: {master_json_path}")

if __name__ == "__main__":
    create_massive_db()
