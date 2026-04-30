import os
import json

def generate_seed():
    base_path = "apna_counsellor/counselings_data"
    counseling_list = []
    
    for folder in os.listdir(base_path):
        folder_path = os.path.join(base_path, folder)
        if os.path.isdir(folder_path):
            name = folder.replace("_", " ")
            category = "Engineering"
            region = "India"
            
            if any(x in folder for x in ["Medical", "NEET", "MCC", "AACCC"]):
                category = "Medical"
            if any(x in folder for x in ["Swiss", "UCAS", "Univ_NZ", "California", "UAC", "VFS"]):
                region = "International"
            
            counseling_list.append({
                "name": name,
                "category": category,
                "region": region,
                "exam": name
            })

    # Generate a Convex mutation file
    with open("convex/seed_counselings.ts", "w", encoding='utf-8') as f:
        f.write('import { mutation } from "./_generated/server";\n\n')
        f.write('export const seedAllCounselings = mutation({\n')
        f.write('  handler: async (ctx) => {\n')
        f.write('    const existing = await ctx.db.query("counselings").collect();\n')
        f.write('    for (const c of existing) { await ctx.db.delete(c._id); }\n\n')
        f.write('    const list = ' + json.dumps(counseling_list) + ';\n')
        f.write('    let count = 0;\n')
        f.write('    for (const item of list) {\n')
        f.write('        await ctx.db.insert("counselings", item);\n')
        f.write('        count++;\n')
        f.write('    }\n')
        f.write('    return `Reset and Inserted ${count} counselings`;\n')
        f.write('  }\n')
        f.write('});\n')

if __name__ == "__main__":
    generate_seed()
