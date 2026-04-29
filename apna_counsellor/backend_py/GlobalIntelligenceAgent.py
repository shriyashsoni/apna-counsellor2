import scrapy
from scrapy_playwright.page import PageMethod
from goose3 import Goose
from newspaper import Article
import json
import os

class GlobalIntelligenceAgent:
    """
    The Global Intelligence Agent scours the public web for 
    counseling-related data using OSINT techniques.
    """
    def __init__(self):
        self.g = Goose()

    def extract_from_article(self, url):
        """
        Uses Newspaper3k and Goose3 to extract clean data from any URL.
        This works on 'almost everywhere' by focusing on the core content.
        """
        print(f"Intelligence Agent: Extracting from {url}...")
        try:
            # Method 1: Newspaper3k
            article = Article(url)
            article.download()
            article.parse()
            data_n3k = {
                "title": article.title,
                "text": article.text[:5000],
                "keywords": article.keywords,
                "summary": article.summary
            }

            # Method 2: Goose3 (Better for structured cleanup)
            extract = self.g.extract(url=url)
            data_goose = {
                "title": extract.title,
                "text": extract.cleaned_text[:5000],
                "meta": extract.meta_description
            }

            return {"n3k": data_n3k, "goose": data_goose}
        except Exception as e:
            return {"error": str(e)}

    def find_hidden_databases(self, query):
        """
        Simulates 'Dorking' to find CSV/PDF/JSON files on the public web.
        """
        # In a real scenario, this would use a search engine API
        # To find 'filetype:csv JoSAA ranks' or similar
        print(f"Intelligence Agent: Searching global indices for '{query}'...")
        return [
            f"https://data.gov.in/search?query={query}",
            f"https://archive.org/search.php?query={query}",
            f"https://github.com/search?q={query}+filetype:csv"
        ]

if __name__ == "__main__":
    agent = GlobalIntelligenceAgent()
    
    # Example: Extraction from a complex site
    sample_url = "https://josaa.nic.in"
    results = agent.extract_from_article(sample_url)
    
    print("\n--- Intelligence Extraction Results ---")
    print(json.dumps(results, indent=2))

    # Example: Finding data sources
    sources = agent.find_hidden_databases("engineering counseling ranks")
    print("\n--- Identified Global Data Sources ---")
    for s in sources:
        print(f"- {s}")
