import pandas as pd
import os
import json

def populate_global_colleges(csv_path, base_dir="counselings_data"):
    print(f"Loading Global Ranking Data from: {csv_path}")
    try:
        df = pd.read_csv(csv_path, encoding='latin1')
        # Assuming columns like 'institution_name' and 'location' or 'country'
        # Let's check columns first
        print(f"Columns: {df.columns.tolist()}")
        
        # Map countries to our folder names
        country_map = {
            "United Kingdom": "UCAS",
            "United States": "Common_App",
            "Germany": "Uni-assist",
            "Sweden": "Univ_Admissions",
            "Finland": "Studyinfo_fi",
            "France": "Parcoursup",
            "Italy": "Universitaly",
            "Canada": "OUAC",
            "Australia": "UAC",
            "China": "CUCAS",
            "Japan": "Study_in_Japan",
            "South Korea": "Study_in_Korea",
            "Turkey": "Study_in_Turkey"
        }

        # Iterating through the dataframe and grouping colleges by country
        # We'll use the 'location' or 'country' column if it exists
        country_col = None
        for col in ['location', 'country', 'Country', 'Location']:
            if col in df.columns:
                country_col = col
                break
        
        if not country_col:
            print("Could not find country column.")
            return

        for country, folder in country_map.items():
            colleges = df[df[country_col].str.contains(country, na=False, case=False)]
            if not colleges.empty:
                folder_path = os.path.join(base_dir, folder)
                if not os.path.exists(folder_path):
                    os.makedirs(folder_path)
                
                college_list = []
                for _, row in colleges.iterrows():
                    college_list.append({
                        "name": row.get('institution_name', row.get('university', row.get('Name', 'Unknown'))),
                        "rank": str(row.get('rank', row.get('Rank', 'N/A'))),
                        "location": country,
                        "type": "International"
                    })
                
                with open(os.path.join(folder_path, "colleges.json"), "w", encoding='utf-8') as f:
                    json.dump(college_list, f, indent=4)
                
                print(f"Populated {len(college_list)} colleges for {folder}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Using the QS World Rankings 2025 dataset downloaded earlier
    csv_path = r"datasets\qs-world-university-rankings-2025\QS World University Rankings 2025 (Top global universities).csv"
    populate_global_colleges(csv_path)
