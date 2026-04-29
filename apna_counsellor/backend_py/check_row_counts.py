import pandas as pd
import os

def check_counts(base_dir):
    csv_files = []
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.csv'):
                csv_files.append(os.path.join(root, file))
    
    total_rows = 0
    for file in csv_files:
        try:
            # Use chunksize to avoid memory issues with huge files
            count = 0
            for chunk in pd.read_csv(file, chunksize=10000, encoding='latin1', on_bad_lines='skip'):
                count += len(chunk)
            print(f"{os.path.basename(file)}: {count} rows")
            total_rows += count
        except Exception as e:
            print(f"Error reading {file}: {e}")
    
    print(f"\nTotal Rows across all datasets: {total_rows}")

if __name__ == "__main__":
    check_counts("e:/Apna Counsellor 2026 platfrom/datasets")
