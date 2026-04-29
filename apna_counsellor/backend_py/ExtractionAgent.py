import re
import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from convex import ConvexClient
import os

class ExtractionAgent:
    def __init__(self, links_file, convex_url):
        self.links_file = links_file
        self.client = ConvexClient(convex_url)
        self.urls = []

    def load_links(self):
        with open(self.links_file, 'r', encoding='utf-8') as f:
            content = f.read()
            # Regex to find URLs in markdown tables/links
            self.urls = list(set(re.findall(r'https?://[^\s)|]+', content)))
            print(f"Found {len(self.urls)} unique URLs.")

    async def extract_data(self, url):
        print(f"Extracting data from: {url}")
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            try:
                await page.goto(url, timeout=60000)
                content = await page.content()
                soup = BeautifulSoup(content, 'html.parser')
                
                # Basic extraction logic (can be enhanced with AI)
                title = soup.title.string if soup.title else "No Title"
                text = soup.get_text(separator=' ', strip=True)[:10000] # Limit to 10k chars
                
                # Identify folder name
                folder_name = re.sub(r'[^\w\s-]', '', title).strip().replace(' ', '_')
                path = os.path.join("counselings_data", folder_name)
                
                if not os.path.exists(path):
                    os.makedirs(path)

                # Save extracted data
                with open(os.path.join(path, "extracted_data.txt"), "w", encoding='utf-8') as f:
                    f.write(f"Title: {title}\nURL: {url}\n\nContent:\n{text}")
                
                print(f"Successfully processed and saved: {title}")
                
            except Exception as e:
                print(f"Failed to process {url}: {e}")
            finally:
                await browser.close()

    async def run_all(self):
        self.load_links()
        tasks = [self.extract_data(url) for url in self.urls[:10]] # Limiting to 10 for demo
        await asyncio.gather(*tasks)

if __name__ == "__main__":
    # Example usage
    links_path = "../C:/Users/Shriyash Soni/.gemini/antigravity/brain/b5daf357-3f8f-46c2-8cb7-1afb17afd69a/global_counseling_links.md"
    convex_url = "https://your-deployment.convex.cloud" # Placeholder
    agent = ExtractionAgent(links_path, convex_url)
    asyncio.run(agent.run_all())
