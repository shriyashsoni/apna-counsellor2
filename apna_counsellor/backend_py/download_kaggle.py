import kagglehub

# Download latest version
print("Starting download from Kaggle...")
try:
    path = kagglehub.dataset_download("shrirangmhalgi/engineering-colleges-in-india")
    print("Path to dataset files:", path)
except Exception as e:
    print("Error downloading dataset:", e)
