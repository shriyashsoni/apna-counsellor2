import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query) {
      return NextResponse.json({ error: "Missing search query" }, { status: 400 })
    }

    console.log(`Searching leads for query: ${query}`)
    const searchUrl = `https://s.jina.ai/${encodeURIComponent(query)}`
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/plain'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch from Jina Search: ${response.statusText}`)
    }

    const text = await response.text()
    
    // Parse markdown links & content to extract lists of leads
    // Jina search format usually contains lines like:
    // [1] Title: COEP Pune
    // URL: https://www.coep.org.in/
    // Description: ...
    const leads: Array<{ name: string; url: string; description: string; type: string }> = []
    
    // Simple robust regex parsing to extract blocks
    const blocks = text.split(/\[\d+\]/).slice(1) // Skip first split which is headers
    
    for (const block of blocks) {
      if (leads.length >= 6) break // Limit to top 6 high-quality results
      
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
      let name = ""
      let url = ""
      let description = ""
      
      // Parse Title
      const titleLine = lines.find(l => l.toLowerCase().startsWith('title:'))
      if (titleLine) {
        name = titleLine.replace(/^title:\s*/i, "").trim()
      }
      
      // Parse URL
      const urlLine = lines.find(l => l.toLowerCase().startsWith('url:'))
      if (urlLine) {
        url = urlLine.replace(/^url:\s*/i, "").trim()
      }
      
      // Parse Snippet / Description
      const snippetLine = lines.find(l => l.toLowerCase().startsWith('snippet:') || l.toLowerCase().startsWith('content:'))
      if (snippetLine) {
        description = snippetLine.replace(/^(snippet|content):\s*/i, "").trim()
      } else {
        // Fallback to joining remaining lines
        description = lines.filter(l => !l.toLowerCase().startsWith('title:') && !l.toLowerCase().startsWith('url:')).slice(0, 2).join(' ')
      }
      
      // Clean up description length
      if (description.length > 180) {
        description = description.substring(0, 180) + "..."
      }
      
      // If we got a name and a URL, it is a valid lead!
      if (name && url && url.startsWith('http')) {
        // Try to identify type from query keywords
        let type = "Company"
        if (name.toLowerCase().includes('college') || name.toLowerCase().includes('university') || name.toLowerCase().includes('institute') || query.toLowerCase().includes('college')) {
          type = "College"
        } else if (name.toLowerCase().includes('school') || name.toLowerCase().includes('vidyalaya') || query.toLowerCase().includes('school')) {
          type = "School"
        } else if (name.toLowerCase().includes('fund') || name.toLowerCase().includes('capital') || name.toLowerCase().includes('venture') || query.toLowerCase().includes('funding')) {
          type = "Funding"
        }
        
        leads.push({
          name,
          url,
          description: description || "No description available.",
          type
        })
      }
    }
    
    // Fallback in case parsing didn't find any blocks
    if (leads.length === 0) {
      // Direct regex to find markdown style links e.g. [Title](URL)
      const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
      let match
      while ((match = linkRegex.exec(text)) !== null && leads.length < 6) {
        const [_, name, url] = match
        if (!leads.some(l => l.url === url) && !url.includes('google.com') && !url.includes('jina.ai')) {
          leads.push({
            name: name.trim(),
            url: url.trim(),
            description: "Discovered via partnership search engine.",
            type: query.toLowerCase().includes('college') ? "College" : "Organization"
          })
        }
      }
    }

    return NextResponse.json({ success: true, leads })
  } catch (error: any) {
    console.error("Lead finder error:", error)
    return NextResponse.json({ error: error.message || "Failed to search leads" }, { status: 500 })
  }
}
