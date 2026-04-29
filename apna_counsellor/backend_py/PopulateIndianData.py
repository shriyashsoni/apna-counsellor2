import pandas as pd
import os
import json
import re

def populate_indian_colleges(csv_path, base_dir="counselings_data"):
    print(f"Loading Indian Engineering College Data from: {csv_path}")
    try:
        # Load the large 4.3MB CSV
        df = pd.read_csv(csv_path, encoding='latin1')
        print(f"Total colleges found: {len(df)}")
        print(f"Columns: {df.columns.tolist()}")

        # Map 'State' column to our folder names
        # Standardizing state names to folder names
        state_folder_map = {
            "Maharashtra": "Maharashtra",
            "Karnataka": "Karnataka",
            "West Bengal": "West_Bengal",
            "Tamil Nadu": "Tamil_Nadu",
            "Telangana": "Telangana",
            "Andhra Pradesh": "Andhra_Pradesh",
            "Delhi": "Delhi",
            "Gujarat": "Gujarat",
            "Uttar Pradesh": "Uttar_Pradesh",
            "Kerala": "Kerala",
            "Rajasthan": "Rajasthan",
            "Madhya Pradesh": "Madhya_Pradesh",
            "Bihar": "Bihar",
            "Punjab": "Punjab",
            "Haryana": "Haryana",
            "Odisha": "Odisha",
            "Assam": "Assam",
            "Jharkhand": "Jharkhand",
            "Chhattisgarh": "Chhattisgarh",
            "Himachal Pradesh": "Himachal",
            "Goa": "Goa",
            "Uttarakhand": "Uttarakhand"
        }

        # Identify the state column
        state_col = None
        for col in ['State', 'state', 'STATE', 'Location']:
            if col in df.columns:
                state_col = col
                break
        
        if not state_col:
            print("Could not find state column.")
            return

        for state, folder in state_folder_map.items():
            colleges = df[df[state_col].str.contains(state, na=False, case=False)]
            if not colleges.empty:
                folder_path = os.path.join(base_dir, folder)
                if not os.path.exists(folder_path):
                    os.makedirs(folder_path)
                
                college_list = []
                for _, row in colleges.iterrows():
                    college_list.append({
                        "name": row.get('College Name', row.get('Name', row.get('college', 'Unknown'))),
                        "city": row.get('City', row.get('Location', 'N/A')),
                        "type": row.get('Type', 'Engineering'),
                        "rating": str(row.get('Rating', 'N/A'))
                    })
                
                with open(os.path.join(folder_path, "colleges.json"), "w", encoding='utf-8') as f:
                    json.dump(college_list, f, indent=4)
                
                print(f"Populated {len(college_list)} colleges for {folder}")

        # Also add all Top-Tier colleges to JoSAA/CSAB
        josaa_colleges = df[df['College Name'].str.contains('IIT|NIT|IIIT|Indian Institute of Technology|National Institute of Technology', na=False, case=False)]
        if not josaa_colleges.empty:
            for folder in ["JoSAA", "CSAB"]:
                f_path = os.path.join(base_dir, folder)
                if not os.path.exists(f_path): os.makedirs(f_path)
                
                j_list = []
                for _, row in josaa_colleges.iterrows():
                    j_list.append({
                        "name": row.get('College Name', 'Unknown'),
                        "type": row.get('College Type', 'Central'),
                        "location": row.get('State', 'India')
                    })
                with open(os.path.join(f_path, "colleges.json"), "w", encoding='utf-8') as f:
                    json.dump(j_list, f, indent=4)
            print(f"Populated {len(j_list)} premium institutes for JoSAA/CSAB")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    csv_path = r"datasets\engineering_colleges_india.csv"
    populate_indian_colleges(csv_path)
