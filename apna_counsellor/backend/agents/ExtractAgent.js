const fs = require('fs');
const path = require('path');
const UniversalScraper = require('../scrapers/UniversalScraper');

/**
 * ExtractAgent - Responsible for processing the master link file and extracting data from all websites.
 */
class ExtractAgent {
    constructor(filePath) {
        this.filePath = filePath;
    }

    /**
     * Parses the markdown file to extract all URLs.
     */
    async getUrls() {
        const content = fs.readFileSync(this.filePath, 'utf8');
        const urlRegex = /https?:\/\/[^\s)|]+(?=\s|\||\))/g;
        const urls = content.match(urlRegex) || [];
        return [...new Set(urls)]; // Deduplicate
    }

    /**
     * Starts the extraction process for all found URLs.
     */
    async runExtraction() {
        console.log("ExtractAgent: Starting global data extraction...");
        const urls = await this.getUrls();
        console.log(`ExtractAgent: Found ${urls.length} unique URLs to process.`);

        const scraper = new UniversalScraper(urls);
        await scraper.start();
        
        console.log("ExtractAgent: Extraction complete.");
    }
}

// Example usage:
// const filePath = path.resolve(__dirname, '../../C:/Users/Shriyash Soni/.gemini/antigravity/brain/b5daf357-3f8f-46c2-8cb7-1afb17afd69a/global_counseling_links.md');
// const agent = new ExtractAgent(filePath);
// agent.runExtraction();

module.exports = ExtractAgent;
