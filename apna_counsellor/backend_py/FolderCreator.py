import os
import re

def create_counseling_folders(links_file, base_dir="counselings_data"):
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)
        print(f"Created base directory: {base_dir}")

    with open(links_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
        # Matches names in bold (with or without **) and URLs
        matches = re.findall(r'\|\s*\*?\*?([^*|]+)\*?\*?\s*\|\s*(https?://[^\s|]+)', content)
        
        print(f"Found {len(matches)} counselings.")

        for name, url in matches:
            # Clean folder name (remove special chars, spaces to underscores)
            folder_name = re.sub(r'[^\w\s-]', '', name).strip().replace(' ', '_')
            path = os.path.join(base_dir, folder_name)
            
            if not os.path.exists(path):
                os.makedirs(path)
                
                # Create a metadata file
                with open(os.path.join(path, "info.json"), "w", encoding='utf-8') as info_file:
                    import json
                    json.dump({
                        "name": name.strip(),
                        "url": url.strip(),
                        "status": "Ready for Extraction"
                    }, info_file, indent=4)
                
                # Create a placeholder for extracted data
                with open(os.path.join(path, "extracted_data.txt"), "w", encoding='utf-8') as data_file:
                    data_file.write(f"Data for {name.strip()} will be stored here.\nURL: {url.strip()}")
                
                print(f"Initialized folder for: {name.strip()}")

if __name__ == "__main__":
    links_path = r"C:\Users\Shriyash Soni\.gemini\antigravity\brain\b5daf357-3f8f-46c2-8cb7-1afb17afd69a\global_counseling_links.md"
    create_counseling_folders(links_path)
