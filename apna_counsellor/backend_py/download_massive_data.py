import kagglehub
import os
import shutil

slug = "akshitkumarmarkan/world-university-rankings"
print(f"Downloading massive dataset: {slug}...")

try:
    path = kagglehub.dataset_download(slug)
    print(f"Downloaded to: {path}")
    
    # Copy to datasets folder
    dest = os.path.abspath("../datasets/massive_world_universities")
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(path, dest)
    print(f"Copied to: {dest}")
    
    # List files to verify
    print("Files:", os.listdir(dest))

except Exception as e:
    print(f"Error: {e}")
