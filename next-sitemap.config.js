const { createClient } = require("@supabase/supabase-js");

module.exports = {
  siteUrl: "https://www.apnacounsellor.in",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "weekly",
  priority: 0.9,
  exclude: ["/admin/*", "/dashboard/*", "/api/*"],
  additionalPaths: async (config) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Fetch college slugs for sitemap
    // We fetch in chunks or prioritize those with actual data
    const { data: colleges } = await supabase
      .from("colleges")
      .select("college_id")
      .not("college_id", "is", null)
      .limit(45000); // Max for one sitemap index

    const collegePaths = (colleges || []).map((c) => ({
      loc: `/college/${c.college_id}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }));

    const corePaths = [
      { loc: '/counseling/josaa-counseling', priority: 1.0 },
      { loc: '/counseling/mht-cet-counseling', priority: 1.0 },
      { loc: '/counseling/neet-mcc-counseling', priority: 1.0 },
      { loc: '/predictor', priority: 1.0 },
      { loc: '/colleges', priority: 0.9 },
      { loc: '/blog', priority: 0.7 },
    ];

    return [...corePaths, ...collegePaths];
  },
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/api/" },
      { userAgent: "*", disallow: "/admin/" },
      { userAgent: "*", disallow: "/dashboard/" },
    ],
  },
}
