import os
import json

def counseling_health_check(base_dir="counselings_data"):
    report = []
    folders = [f.path for f in os.scandir(base_dir) if f.is_dir()]
    
    for folder in folders:
        name = os.path.basename(folder)
        has_info = os.path.exists(os.path.join(folder, "info.json"))
        has_processes = os.path.exists(os.path.join(folder, "processes.json"))
        has_colleges = os.path.exists(os.path.join(folder, "colleges.json"))
        has_ranks = os.path.exists(os.path.join(folder, "ranks.json"))
        has_pdf = os.path.exists(os.path.join(folder, "Information_Brochure_2025_26.pdf"))
        
        score = sum([has_info, has_processes, has_colleges, has_ranks, has_pdf])
        
        report.append({
            "name": name,
            "score": score,
            "completeness": f"{(score/5)*100}%",
            "missing": [f for f, exists in [
                ("info.json", has_info), 
                ("processes.json", has_processes), 
                ("colleges.json", has_colleges), 
                ("ranks.json", has_ranks), 
                ("PDF", has_pdf)
            ] if not exists]
        })
    
    # Sort by completeness
    report.sort(key=lambda x: x["score"], reverse=True)
    return report

if __name__ == "__main__":
    results = counseling_health_check()
    print(json.dumps(results[:15], indent=4)) # Show top 15
