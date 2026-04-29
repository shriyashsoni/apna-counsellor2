import kagglehub
from kagglehub import KaggleDatasetAdapter

# Set the path to the file you'd like to load
file_path = "200_top_Engineering_Colleges_india.csv"

print(f"Loading dataset: iottech/top-engineering-colleges-india, file: {file_path}")

try:
    # Load the latest version
    df = kagglehub.load_dataset(
      KaggleDatasetAdapter.PANDAS,
      "iottech/top-engineering-colleges-india",
      file_path,
    )

    print("\nFirst 5 records:")
    print(df.head())
except Exception as e:
    print(f"\nError: {e}")
    print("Trying to download and list files first...")
    path = kagglehub.dataset_download("iottech/top-engineering-colleges-india")
    print(f"Dataset downloaded to: {path}")
    import os
    print(f"Files in directory: {os.listdir(path)}")
