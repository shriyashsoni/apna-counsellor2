import kagglehub
import os
import shutil

# List of identified dataset slugs
dataset_slugs = [
    "samyakrajbayar/jee-mains-dataset-includes-2026-jan-attempt",
    "rafi003/jee-mains-dataset",
    "divyanshukunwar/josaa-engineering-schools-seat-allocation-jee",
    "ishita1singh/josaa-college-predictor",
    "rahulkumarnitw/josaa-opening-and-closing-rank-dataset-2024",
    "aakaash89/neet-2024-ug-results-citycenter-wise",
    "mrutyunjaybiswal/iitjee-neet-aims-students-questions-data",
    "harigoshika/neet-exam-performance-dashboard",
    "kundanbedmutha/college-admission-dataset-india",
    "mexwell/elite-college-admissions",
    "jfschultz/us-college-university-admissions-2020-2021",
    "melissamonfared/qs-world-university-rankings-2025",
    "ddosad/timesworlduniversityrankings2024",
    "anshdwvdi/top-100-universities-in-the-world-qs-ranking",
    "willianoliveiragibin/qs-top-100-universities",
    "aliabbas71/global-university-subject-rankings"
]

dest_base = os.path.abspath("../datasets")
if not os.path.exists(dest_base):
    os.makedirs(dest_base)

print(f"Starting bulk download of {len(dataset_slugs)} datasets to {dest_base}...")

for slug in dataset_slugs:
    print(f"\nDownloading: {slug}...")
    try:
        # Download
        path = kagglehub.dataset_download(slug)
        print(f"Downloaded to: {path}")
        
        # Identify files and move/copy to our project
        # Folder name based on slug
        folder_name = slug.split('/')[-1]
        target_dir = os.path.join(dest_base, folder_name)
        
        if os.path.exists(target_dir):
            shutil.rmtree(target_dir)
        
        shutil.copytree(path, target_dir)
        print(f"Successfully copied to: {target_dir}")
        
    except Exception as e:
        print(f"Failed to download {slug}: {e}")

print("\nBulk download completed.")
