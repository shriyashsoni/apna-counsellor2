module.exports = {
  siteUrl: "https://www.apnacounsellor.in",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "weekly",
  priority: 0.9,
  additionalPaths: async (config) => {
    const corePaths = [
      'counseling/josaa-counseling',
      'counseling/mht-cet-counseling',
      'counseling/neet-mcc-counseling',
      'tools/college-predictor',
      'blog',
    ];
    
    return corePaths.map((slug) => ({
      loc: `https://www.apnacounsellor.in/${slug}`,
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
      // Only add specific partitions if they are not already in the main index
    ],
  },
}
