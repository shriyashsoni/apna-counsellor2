import kagglehub

# Download latest version
print("Starting download for Maharashtra Engineering Colleges...")
try:
    path = kagglehub.dataset_download("notcostheta/engineering-colleges-in-maharashtra")
    print("Path to dataset files:", path)
except Exception as e:
    print("Error downloading dataset:", e)
