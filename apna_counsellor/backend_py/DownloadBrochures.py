import os
import requests
import json

# List of brochures found by the subagent
brochures = [
    {"name": "JoSAA", "url": "https://cdnbbsr.s3waas.gov.in/s313111c20aee51aeb480ecbd988cd8cc9/uploads/2025/05/2025062021.pdf"},
    {"name": "MCC (Medical)", "url": "https://cdnbbsr.s3waas.gov.in/s37bc1ec1d9c3426357e69acd5bf320061/uploads/2026/02/202602081576322299.pdf"},
    {"name": "West Bengal", "url": "https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf440aeb1/uploads/2024/12/2024122386.pdf"},
    {"name": "Maharashtra", "url": "https://cetcell.mahacet.org/wp-content/uploads/2023/12/Information-Brochure-MHT-CET-2025-PDF.pdf"},
    {"name": "Karnataka", "url": "https://cetonline.karnataka.gov.in/keawebentry456/ugcet2026/information_bulletin_1_ugcet_2026_17012026english.pdf"},
    {"name": "UCAS", "url": "https://resources.finalsite.net/images/v1726656768/kingsmaccouk/geeseocibg7dtnjvemaj/UCASHandbook2025entry.pdf"},
    {"name": "Common App", "url": "https://www.commonapp.org/files/Whats-New-25-26.pdf"},
    {"name": "Uni-assist", "url": "https://www.uni-assist.de/fileadmin/Downloads/Tools/Checklisten/EN/UA-Checkliste-VPD-Verfahren-EN.pdf"},
    {"name": "COMEDK", "url": "https://www.comedk.org/uploads/Information-brochure-2025-version-1_0.pdf"},
    {"name": "VITEEE", "url": "https://vit.ac.in/files/VITEEE/VITEEE_Prospectus.pdf"}
]

def download_brochures(brochures_list, base_dir="counselings_data"):
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)

    for b in brochures_list:
        # Map name to folder name (same logic as FolderCreator)
        import re
        folder_name = re.sub(r'[^\w\s-]', '', b["name"]).strip().replace(' ', '_')
        path = os.path.join(base_dir, folder_name)
        
        if not os.path.exists(path):
            os.makedirs(path)
            print(f"Created missing folder: {path}")

        print(f"Downloading brochure for {b['name']}...")
        try:
            response = requests.get(b["url"], stream=True, timeout=30, verify=False) # verify=False for gov sites with cert issues
            if response.status_code == 200:
                file_name = "Information_Brochure_2025_26.pdf"
                with open(os.path.join(path, file_name), 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                print(f"Saved: {path}/{file_name}")
            else:
                print(f"Failed to download {b['name']}: HTTP {response.status_code}")
        except Exception as e:
            print(f"Error downloading {b['name']}: {e}")

if __name__ == "__main__":
    download_brochures(brochures)
