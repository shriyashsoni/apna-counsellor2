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

  // 1. Normalize Rank
  if (args.exam.toUpperCase().includes("JEE MAIN") && percentile > 0 && rank === 0) {
    rank = Math.max(1, Math.floor((100 - percentile) * 12000));
  }

  // 2. Fetch Colleges Broadly (Searching the 1.7L+ Database)
  // We search for colleges that match the counseling OR are in the target state
  let collegeQuery = supabase
    .from("colleges")
    .select(`
      id, college_id, name, state, type, avg_package, nirf_rank, image_url, counseling_id,
      ranks(course_name, category, opening_rank, closing_rank, year)
    `)
    .limit(300); // Fetch a good chunk to analyze

  // Filter by Counseling if possible
  const { data: counseling } = await supabase
    .from("counselings")
    .select("id")
    .or(`name.ilike.%${args.exam}%,exam.ilike.%${args.exam}%`)
    .limit(1)
    .single();

  if (counseling) {
    collegeQuery = collegeQuery.eq("counseling_id", counseling.id);
  } else if (args.homeState) {
    collegeQuery = collegeQuery.eq("state", args.homeState);
  }

  const { data: colleges, error } = await collegeQuery;

  if (error || !colleges || colleges.length === 0) {
    // Fallback search by name if counseling/state filters return nothing
    const { data: nameSearch } = await supabase
      .from("colleges")
      .select(`
        id, college_id, name, state, type, avg_package, nirf_rank, image_url, counseling_id,
        ranks(course_name, category, opening_rank, closing_rank, year)
      `)
      .ilike("name", `%${args.exam.split(' ')[0]}%`)
      .limit(100);
    
    return processResults(nameSearch || [], rank, args);
  }

  return processResults(colleges, rank, args);
}

function processResults(colleges: any[], userRank: number, args: any) {
  const finalResults: any[] = [];

  colleges.forEach(college => {
    // Case A: College has explicit rank data
    const matchingRanks = (college.ranks || []).filter((r: any) => r.category === args.category);
    
    if (matchingRanks.length > 0) {
      matchingRanks.forEach((r: any) => {
        if (userRank <= r.closing_rank * 1.5) { // Show if somewhat close
          finalResults.push(mapToResult(college, r, userRank, args));
        }
      });
    } else {
      // Case B: College has NO rank data (The "1.7L" issue)
      // We use a Reputation-Based Estimation Agent logic here
      // This "trains" the agent to provide results for every DB record
      const estimatedCutoff = estimateCutoff(college, args.category);
      
      if (userRank <= estimatedCutoff * 1.5) {
        finalResults.push(mapToResult(college, {
          course_name: args.preferredBranches?.[0] || "Computer Science",
          opening_rank: Math.floor(estimatedCutoff * 0.8),
          closing_rank: estimatedCutoff,
          year: 2024
        }, userRank, args));
      }
    }
  });

  return finalResults
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 50);
}

function mapToResult(college: any, rankRecord: any, userRank: number, args: any) {
  const buffer = rankRecord.closing_rank - userRank;
  const range = rankRecord.closing_rank - rankRecord.opening_rank || (rankRecord.closing_rank * 0.1); 
  
  let safetyScore = Math.min((buffer / range) * 100, 100);
  if (safetyScore < 0) safetyScore = 0;

  const isPreferredBranch = args.preferredBranches?.some(b => 
    rankRecord.course_name.toLowerCase().includes(b.toLowerCase())
  );
  
  const totalScore = safetyScore + (isPreferredBranch ? 20 : 0);
  const tag = safetyScore > 60 ? "Safe" : safetyScore > 30 ? "Moderate" : "Reach";
  const slug = college.college_id || (college.name || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

  return {
    id: slug,
    db_id: college.id,
    name: college.name,
    state: college.state || "India",
    type: college.type || "Premier",
    branch: rankRecord.course_name,
    year: rankRecord.year,
    cutoffRank: rankRecord.closing_rank,
    probability: Math.floor(safetyScore),
    safetyScore,
    totalScore,
    tag,
    quota: (args.homeState && college.state === args.homeState) ? "HS" : "AI",
    avgPackage: college.avg_package || "TBD",
    nirfRank: college.nirf_rank,
    image: college.image_url
  };
}

/**
 * SMART ESTIMATION AGENT
 * Uses NIRF, Type, and Name keywords to estimate cutoffs for the 1.7L colleges lacking rank records.
 */
function estimateCutoff(college: any, category: string) {
  let baseRank = 50000; // Default base for a generic college
  
  const name = college.name.toUpperCase();
  const isIIT = name.includes("IIT") || name.includes("INDIAN INSTITUTE OF TECHNOLOGY");
  const isNIT = name.includes("NIT") || name.includes("NATIONAL INSTITUTE OF TECHNOLOGY");
  const isIIIT = name.includes("IIIT");
  
  if (isIIT) baseRank = 5000;
  else if (isNIT) baseRank = 25000;
  else if (isIIIT) baseRank = 35000;
  else if (college.nirf_rank && college.nirf_rank < 100) baseRank = 40000;
  
  // Category Multiplier
  const multipliers: Record<string, number> = {
    "General": 1,
    "OBC": 1.5,
    "SC": 3,
    "ST": 5,
    "EWS": 1.2
  };
  
  return Math.floor(baseRank * (multipliers[category] || 1));
}





