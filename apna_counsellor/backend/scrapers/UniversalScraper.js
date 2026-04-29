const { PlaywrightCrawler, Dataset } = require('crawlee');
const { puter } = require('@heyputer/puter.js');

class UniversalScraper {
    constructor(urls) {
        this.urls = urls;
    }

    async start() {
        const crawler = new PlaywrightCrawler({
            async requestHandler({ page, request, log }) {
                log.info(`Processing ${request.url}...`);
                
                // Get page content
                const content = await page.content();
                const text = await page.evaluate(() => document.body.innerText);

                // Use Puter AI to extract structured data from the text
                const prompt = `Extract the following details from this counseling website text:
                - Counseling Name
                - Official Application Link
                - Important Dates
                - List of Colleges mentioned
                - Admission Criteria
                
                Text: ${text.substring(0, 5000)} // Limit text for AI context`;

                try {
                    const aiResponse = await puter.ai.chat(prompt);
                    const extractedData = aiResponse.message.content;
                    
                    // Save to Crawlee dataset
                    await Dataset.pushData({
                        url: request.url,
                        extractedData,
                        timestamp: new Date().toISOString()
                    });
                } catch (error) {
                    log.error(`AI extraction failed for ${request.url}: ${error.message}`);
                }
            },
        });

        await crawler.run(this.urls);
        console.log('Scraping completed. Data saved to ./storage/datasets/default');
    }
}

module.exports = UniversalScraper;
