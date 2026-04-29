import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const extractCollegeData = action({
  args: { 
    collegeId: v.id("colleges"),
    url: v.string() 
  },
  handler: async (ctx, args) => {
    try {
      const urlObj = new URL(args.url);
      // Fetch with a standard User-Agent to avoid basic bot blockers
      const response = await fetch(args.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const html = await response.text();
      
      // Extract og:image or twitter:image
      let imageUrl = null;
      const ogImageMatch = html.match(/<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image["']/i);
      const twitterImageMatch = html.match(/<meta[^>]+(?:property|name)=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']twitter:image["']/i);
      
      if (ogImageMatch && ogImageMatch[1]) {
        imageUrl = ogImageMatch[1];
      } else if (twitterImageMatch && twitterImageMatch[1]) {
        imageUrl = twitterImageMatch[1];
      }

      // Ensure URL is absolute
      if (imageUrl && !imageUrl.startsWith('http')) {
         if (imageUrl.startsWith('//')) {
             imageUrl = `${urlObj.protocol}${imageUrl}`;
         } else if (imageUrl.startsWith('/')) {
             imageUrl = `${urlObj.origin}${imageUrl}`;
         } else {
             imageUrl = `${urlObj.origin}/${imageUrl}`;
         }
      }

      // Extract description
      let description = null;
      const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
      const ogDescMatch = html.match(/<meta[^>]+(?:property|name)=["']og:description["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:description["']/i);

      if (ogDescMatch && ogDescMatch[1]) {
        description = ogDescMatch[1]; // og:description is usually better
      } else if (descMatch && descMatch[1]) {
        description = descMatch[1];
      }

      // Clean up description HTML entities if needed (basic cleanup)
      if (description) {
          description = description.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
      }

      // Call mutation to update the college record
      if (imageUrl || description) {
        await ctx.runMutation(api.colleges.updateCollegeMetadata, {
          collegeId: args.collegeId,
          imageUrl: imageUrl || undefined,
          description: description || undefined
        });
      }

      return { success: true, imageUrl, description };

    } catch (error: any) {
      console.error("Extraction error:", error);
      return { success: false, error: error.message };
    }
  }
});
