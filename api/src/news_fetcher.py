import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

API_KEY = os.getenv('BING_NEWS_API_KEY')
ENDPOINT = 'https://api.bing.microsoft.com/v7.0/news'

def fetch_news(category):
    headers = {"Ocp-Apim-Subscription-Key": API_KEY}
    params = {
        "category": category,
        "count": 10,
        "mkt": "en-US",
        "sortBy": "relevance"
    }
    
    response = requests.get(ENDPOINT, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()['value']
    else:
        print(f"Error fetching news for {category}: {response.status_code}")
        return []

def get_news_for_all_categories():
    categories = ['Business', 'Technology', 'Health', 'Science', 'Sports', 'Entertainment']
    all_news = {}

    for category in categories:
        print(f"Fetching news for {category}...")
        news = fetch_news(category)
        all_news[category] = news

    return all_news

if __name__ == "__main__":
    news = get_news_for_all_categories()
    for category, articles in news.items():
        print(f"\nTop 10 {category} News:")
        for i, article in enumerate(articles, 1):
            print(f"{i}. Title: {article['name']}")
            print(f"   Description: {article.get('description', 'N/A')}")
            print(f"   URL: {article['url']}")
            print(f"   Published: {article.get('datePublished', 'N/A')}")
            print(f"   Provider: {article['provider'][0]['name'] if article['provider'] else 'N/A'}")
            print(f"   Image URL: {article['image']['thumbnail']['contentUrl'] if article.get('image') else 'N/A'}")
            print("-" * 50)