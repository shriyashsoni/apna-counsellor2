"use server"

import { createClient } from "@/lib/supabase/server"

export async function predictColleges(args: {
  exam: string;
  rank?: number;
  percentile?: number;
  category: string;
  preferredBranches?: string[];
  preferredStates?: string[];
}) {
  const supabase = createClient()
  let rank = args.rank || 0;
  const percentile = args.percentile || 0;

  // Rank Normalization Logic
  if (args.exam.toUpperCase() === "JEE MAINS" && percentile > 0) {
    rank = Math.max(1, Math.floor((100 - percentile) * 12000));
  } else if (args.exam.toUpperCase() === "JEE ADVANCED" && rank === 0) {
    rank = 50000;
  }

  // Optimized Query: Find counseling by name
  let collegeQuery = supabase.from("colleges").select("*")
  
  const { data: counseling } = await supabase
    .from("counselings")
    .select("id")
    .eq("name", args.exam)
    .single()

  if (counseling) {
    collegeQuery = collegeQuery.eq("counseling_id", counseling.id)
  } else {
    // Fallback to name search
    collegeQuery = collegeQuery.ilike("name", `%${args.exam}%`)
  }

  const { data: colleges, error } = await collegeQuery.limit(500)
  if (error || !colleges) return []

  const results: any[] = []

  for (const c of colleges) {
    if (args.preferredStates && args.preferredStates.length > 0 && !args.preferredStates.includes(c.state || "")) {
      continue;
    }

    const cutoffs = (c.cutoffs as any) || {};
    for (const [branch, data] of Object.entries(cutoffs)) {
      const branchName = branch;
      const branchData = data as any;

      if (args.preferredBranches && args.preferredBranches.length > 0 && !args.preferredBranches.includes(branchName)) {
        continue;
      }

      // Get cutoff for category or fallback to General
      const catCutoff = branchData[args.category] || branchData["General"] || 99999;

      if (rank <= catCutoff) {
        // Probability calculation formula
        const prob = Math.min(95, Math.max(30, Math.floor(100 - (rank / Math.max(catCutoff, 1)) * 60)));
        
        results.push({
          id: c.college_id || c.id,
          name: c.name,
          shortName: c.short_name || c.name,
          state: c.state,
          type: c.type,
          branch: branchName,
          cutoffRank: catCutoff,
          yourRank: rank,
          probability: prob,
          annualFee: c.annual_fee,
          avgPackage: c.avg_package,
          nirfRank: c.nirf_rank || 999,
        });
        break; 
      }
    }
  }

  return results
    .sort((a, b) => b.probability - a.probability || a.nirfRank - b.nirfRank)
    .slice(0, 15);
}
