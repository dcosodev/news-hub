from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from . import database, news_fetcher
import logging
from datetime import datetime, date
from typing import List
from fastapi.middleware.cors import CORSMiddleware

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

def track_api_usage(db: Session, endpoint: str):
    today = date.today()
    usage = db.query(database.ApiUsage).filter(
        database.ApiUsage.endpoint == endpoint,
        database.ApiUsage.last_accessed == today
    ).first()
    if usage:
        usage.request_count += 1
    else:
        usage = database.ApiUsage(endpoint=endpoint, request_count=1, last_accessed=today)
        db.add(usage)
    db.commit()

@app.get("/")
async def root(db: Session = Depends(database.get_db)):
    track_api_usage(db, "/")
    return {"message": "Welcome to the News API"}

@app.get("/fetch-news")
async def fetch_news(db: Session = Depends(database.get_db)):
    track_api_usage(db, "/fetch-news")
    try:
        news = news_fetcher.get_news_for_all_categories()
        for category, articles in news.items():
            for article in articles:
                db_article = database.Article(
                    title=article['name'],
                    description=article.get('description', ''),
                    url=article['url'],
                    published_at=datetime.fromisoformat(article['datePublished'].rstrip('Z')),
                    category=category,
                    provider=article['provider'][0]['name'] if article['provider'] else '',
                    image_url=article['image']['thumbnail']['contentUrl'] if article.get('image') else None
                )
                db.add(db_article)
                
                # Update category count
                db_category = db.query(database.Category).filter(database.Category.name == category).first()
                if db_category:
                    db_category.article_count += 1
                else:
                    db_category = database.Category(name=category, article_count=1)
                    db.add(db_category)
        
        db.commit()
        return {"message": "News fetched and stored successfully", "news": news}
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/news/{category}")
async def get_news_by_category(category: str, db: Session = Depends(database.get_db)):
    track_api_usage(db, f"/news/{category}")
    try:
        db_news = db.query(database.Article).filter(database.Article.category == category).all()
        
        if not db_news:
            # If no news in database, fetch fresh news
            news = news_fetcher.fetch_news(category)
        else:
            news = [
                {
                    "name": article.title,
                    "description": article.description,
                    "url": article.url,
                    "datePublished": article.published_at.isoformat(),
                    "provider": [{"name": article.provider}],
                    "image": {"thumbnail": {"contentUrl": article.image_url}} if article.image_url else None
                }
                for article in db_news
            ]
        
        return {"category": category, "news": news}
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/categories", response_model=List[str])
async def get_categories(db: Session = Depends(database.get_db)):
    track_api_usage(db, "/categories")
    categories = db.query(database.Category).all()
    return [category.name for category in categories]

@app.get("/api-usage")
async def get_api_usage(db: Session = Depends(database.get_db)):
    track_api_usage(db, "/api-usage")
    usage = db.query(database.ApiUsage).all()
    return [{"endpoint": u.endpoint, "request_count": u.request_count, "last_accessed": u.last_accessed} for u in usage]

# Initialize categories
@app.on_event("startup")
async def initialize_categories():
    db = next(database.get_db())
    categories = ['Business', 'Technology', 'Health', 'Science', 'Sports', 'Entertainment']
    for category in categories:
        if not db.query(database.Category).filter(database.Category.name == category).first():
            db.add(database.Category(name=category))
    db.commit()