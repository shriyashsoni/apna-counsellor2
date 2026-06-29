const { createClient } = require("@supabase/supabase-js");
const fs = require('fs');
const path = require('path');

module.exports = {
  siteUrl: "https://www.apnacounsellor.in",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "weekly",
  priority: 0.9,
  exclude: ["/admin/*", "/dashboard/*", "/api/*", "/server-sitemap.xml"],
  additionalPaths: async (config) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const allPaths = [];
    const dateNow = new Date().toISOString();

    // 1. Fetch Colleges
    const { data: colleges } = await supabase
      .from("colleges")
      .select("college_id")
      .not("college_id", "is", null)
      .limit(45000);

    if (colleges) {
      colleges.forEach((c) => {
        allPaths.push({
          loc: `/college/${c.college_id}`,
          changefreq: "weekly",
          priority: 0.8,
          lastmod: dateNow,
        });
      });
    }

    // 2. Fetch Courses
    const { data: courses } = await supabase.from("courses").select("slug");
    if (courses) {
      courses.forEach((c) => {
        if (c.slug) {
          allPaths.push({
            loc: `/courses/${c.slug}`,
            changefreq: "daily",
            priority: 0.9,
            lastmod: dateNow,
          });
        }
      });
    }

    // 3. Fetch Blogs
    const { data: blogs } = await supabase.from("blogs").select("slug, updated_at");
    if (blogs) {
      blogs.forEach((b) => {
        if (b.slug) {
          allPaths.push({
            loc: `/blog/${b.slug}`,
            changefreq: "weekly",
            priority: 0.7,
            lastmod: b.updated_at || dateNow,
          });
        }
      });
    }

    // 4. Fetch Mentors
    const { data: mentors } = await supabase.from("profiles").select("slug, id").eq("role", "mentor");
    if (mentors) {
      mentors.forEach((m) => {
        const idToUse = m.slug || m.id;
        if (idToUse) {
          allPaths.push({
            loc: `/mentor/${idToUse}`,
            changefreq: "monthly",
            priority: 0.8,
            lastmod: dateNow,
          });
        }
      });
    }

    // 5. Add Static Counseling and Tools Directories dynamically
    try {
      const counselingDir = path.join(process.cwd(), 'app', 'counseling');
      if (fs.existsSync(counselingDir)) {
        const counselingRoutes = fs.readdirSync(counselingDir, { withFileTypes: true })
          .filter(d => d.isDirectory() && !d.name.includes('['))
          .map(d => `/counseling/${d.name}`);
        
        counselingRoutes.forEach(route => {
          allPaths.push({ loc: route, changefreq: "monthly", priority: 0.8, lastmod: dateNow });
        });
      }

      const toolsDir = path.join(process.cwd(), 'app', 'tools');
      if (fs.existsSync(toolsDir)) {
        const toolsRoutes = fs.readdirSync(toolsDir, { withFileTypes: true })
          .filter(d => d.isDirectory() && !d.name.includes('['))
          .map(d => `/tools/${d.name}`);
        
        toolsRoutes.forEach(route => {
          allPaths.push({ loc: route, changefreq: "weekly", priority: 0.9, lastmod: dateNow });
        });
      }
    } catch (err) {
      console.warn("Could not read static directories for sitemap:", err.message);
    }

    // 6. Core Static Hub Paths
    const corePaths = [
      { loc: '/', priority: 1.0, changefreq: "daily" },
      { loc: '/courses', priority: 1.0, changefreq: "daily" },
      { loc: '/counselling', priority: 1.0, changefreq: "daily" },
      { loc: '/predictors', priority: 1.0, changefreq: "weekly" },
      { loc: '/blog', priority: 0.9, changefreq: "daily" },
      { loc: '/about', priority: 0.8, changefreq: "monthly" },
      { loc: '/contact', priority: 0.8, changefreq: "monthly" },
      // ── Featured products – pinned at highest priority ─────────────────────
      { loc: '/courses/josaa-choice-filling-list-2026', priority: 1.0, changefreq: "daily", lastmod: dateNow },
      { loc: '/courses/comedk-2026-choice-filling-list', priority: 1.0, changefreq: "daily", lastmod: dateNow },
      { loc: '/courses/mpdte-2026-choice-filling-list', priority: 1.0, changefreq: "daily", lastmod: dateNow },
    ];

    return [...corePaths, ...allPaths];
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
