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
    .select("id, name")
    .or(`name.ilike.%${args.exam}%,exam.ilike.%${args.exam}%`)
    .limit(1)
    .single()

  if (counseling) {
    collegeQuery = collegeQuery.eq("counseling_id", counseling.id)
  } else {
    // Better fallback: search for exam name in college name or description
    collegeQuery = collegeQuery.or(`name.ilike.%${args.exam}%,location.ilike.%${args.exam}%`)
  }

  const { data: colleges, error } = await collegeQuery.limit(200)
  if (error || !colleges) return []

  // Try fetching from ranks table if colleges don't have cutoffs
  const collegeIds = colleges.map(c => c.id)
  const { data: rankRecords } = await supabase
    .from("ranks")
    .select("*")
    .in("college_id", collegeIds)
    .eq("category", args.category)
    .gte("closing_rank", rank) // All colleges where student can get admission
    .order("closing_rank", { ascending: true })

  const results: any[] = []

  for (const c of colleges) {
    if (args.preferredStates && args.preferredStates.length > 0 && !args.preferredStates.includes(c.state || "")) {
      continue;
    }

    const cutoffs = (c.cutoffs as any) || {};
    const collegeRanks = rankRecords?.filter(r => r.college_id === c.id) || [];

    // Check embedded cutoffs
    let match = false;
    for (const [branch, data] of Object.entries(cutoffs)) {
      const branchData = data as any;
      const catCutoff = branchData[args.category] || branchData["General"] || 0;

      if (catCutoff > 0 && rank <= catCutoff) {
        // Higher probability if rank is much lower than cutoff
        const prob = Math.min(99, Math.max(30, Math.floor(100 - (rank / catCutoff) * 60)));
        results.push({
          id: c.id,
          name: c.name,
          state: c.state,
          type: c.type,
          branch: branch,
          cutoffRank: catCutoff,
          probability: prob,
          avgPackage: c.avg_package,
          nirfRank: c.nirf_rank,
        });
        match = true;
        break;
      }
    }

    // Check ranks table fallback
    if (!match && collegeRanks.length > 0) {
      const bestRank = collegeRanks[0]; // Already sorted by closing_rank ASC
      if (rank <= bestRank.closing_rank) {
        const prob = Math.min(99, Math.max(30, Math.floor(100 - (rank / bestRank.closing_rank) * 60)));
        results.push({
          id: c.id,
          name: c.name,
          state: c.state,
          type: c.type,
          branch: bestRank.course_name,
          cutoffRank: bestRank.closing_rank,
          probability: prob,
          avgPackage: c.avg_package,
          nirfRank: c.nirf_rank,
        });
      }
    }
  }

  return results
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 30);
}
