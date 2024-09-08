from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = "sqlite:///./news.db"

# Check if the database file exists and remove it (for development purposes)
if os.path.exists("news.db"):
    os.remove("news.db")
    print("Existing database removed.")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    url = Column(String, unique=True, index=True)
    published_at = Column(DateTime)
    category = Column(String, index=True)
    provider = Column(String)
    image_url = Column(String)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    article_count = Column(Integer, default=0)

class ApiUsage(Base):
    __tablename__ = "api_usage"

    id = Column(Integer, primary_key=True, index=True)
    endpoint = Column(String, index=True)
    request_count = Column(Integer, default=0)
    last_accessed = Column(Date)

# Create all tables
Base.metadata.create_all(bind=engine)
print("Database tables created.")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()