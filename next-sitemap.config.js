module.exports = {
  siteUrl: "https://apnacounsellor.in",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "weekly",
  priority: 0.9,
  additionalPaths: async (config) => {
    // In a real scenario, fetch all 150,000 slugs from Convex/DB
    // For now, we return the known core paths
    const corePaths = [
      'counseling/josaa-counseling',
      'counseling/mht-cet-counseling',
      'counseling/neet-mcc-counseling',
      'tools/college-predictor',
      'blog',
    ];
    
    return corePaths.map((slug) => ({
      loc: `https://apnacounsellor.in/${slug}`,
      changefreq: "weekly",
      priority: 0.9,
      lastmod: new Date().toISOString(),
    }));
  },
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/api/" },
      { userAgent: "*", disallow: "/admin/" },
    ],
    additionalSitemaps: [
      "https://apnacounsellor.in/sitemap-colleges.xml",
      "https://apnacounsellor.in/sitemap-counseling.xml",
      "https://apnacounsellor.in/sitemap-blogs.xml",
    ],
  },
}
