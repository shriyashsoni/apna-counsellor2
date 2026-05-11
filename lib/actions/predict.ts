"use server"

import { createClient } from "@/lib/supabase/server"

export async function predictColleges(args: {
  exam: string;
  rank?: number;
  percentile?: number;
  category: string;
  homeState?: string;
  gender?: string;
  preferredBranches?: string[];
}) {
  const supabase = createClient()
  let rank = args.rank || 0;
  const percentile = args.percentile || 0;

  // 1. Rank Normalization (for JEE Mains)
  if (args.exam.toUpperCase().includes("JEE MAIN") && percentile > 0 && rank === 0) {
    rank = Math.max(1, Math.floor((100 - percentile) * 12000));
  }

  // 2. Find the Counseling ID first
  const { data: counseling } = await supabase
    .from("counselings")
    .select("id, name, exam")
    .or(`name.ilike.%${args.exam}%,exam.ilike.%${args.exam}%`)
    .limit(1)
    .single();

  // 3. Query the Ranks Table directly (Data-First approach)
  let rankQuery = supabase
    .from("ranks")
    .select(`
      *,
      colleges!inner(
        id, college_id, name, state, type, avg_package, nirf_rank, image_url, counseling_id
      )
    `)
    .eq("category", args.category)
    .gte("closing_rank", rank);

  if (counseling) {
    rankQuery = rankQuery.eq("colleges.counseling_id", counseling.id);
  }

  const { data: rankRecords, error: rankError } = await rankQuery.limit(200);

  if (rankError || !rankRecords || rankRecords.length === 0) {
    const { data: fallbackRecords } = await supabase
      .from("ranks")
      .select(`
        *,
        colleges!inner(
          id, college_id, name, state, type, avg_package, nirf_rank, image_url, counseling_id
        )
      `)
      .eq("category", args.category)
      .gte("closing_rank", rank)
      .order("closing_rank", { ascending: true })
      .limit(100);
    
    if (!fallbackRecords) return [];
    return processResults(fallbackRecords, rank, args);
  }

  return processResults(rankRecords, rank, args);
}

function processResults(records: any[], userRank: number, args: any) {
  const results = records.map(record => {
    const college = record.colleges;
    
    // Effective Rank & Quota Logic
    let quota = "AI";
    if (args.homeState && college.state === args.homeState) {
      quota = "HS";
    }

    // Safety score calculation
    const buffer = record.closing_rank - userRank;
    const range = record.closing_rank - record.opening_rank || (record.closing_rank * 0.1); 
    
    let safetyScore = Math.min((buffer / range) * 100, 100);
    if (safetyScore < 0) safetyScore = 0;

    const isPreferredBranch = args.preferredBranches?.some(b => 
      record.course_name.toLowerCase().includes(b.toLowerCase())
    );
    const branchScore = isPreferredBranch ? 20 : 0;

    const totalScore = safetyScore + branchScore;

    let tag: "Safe" | "Moderate" | "Reach" = "Reach";
    if (safetyScore > 60) tag = "Safe";
    else if (safetyScore > 30) tag = "Moderate";

    // Use the slug (college_id) if available, otherwise slugify the name
    const slug = college.college_id || (college.name || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    return {
      id: slug, // This is the ID used for linking to /college/[id]
      db_id: college.id,
      name: college.name,
      state: college.state,
      type: college.type,
      branch: record.course_name,
      cutoffRank: record.closing_rank,
      openingRank: record.opening_rank,
      probability: Math.floor(safetyScore),
      safetyScore,
      totalScore,
      tag,
      quota,
      avgPackage: college.avg_package,
      nirfRank: college.nirf_rank,
      image: college.image_url
    };
  });

  return results
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 50);
}



