# 📰 NewsHub: Your Personal News Aggregator 🌐

![NewsHub Screenshot](.\assets\images\screenshot.png)


## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Mobile App](#mobile-app)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## 🌟 Overview

NewsHub is a full-stack news aggregation platform that combines a Python-based API with a React Native mobile application. It fetches the latest news from Bing's Search API, stores it in a SQLite database, and serves it through a custom API. The mobile app provides a sleek, responsive interface for users to browse news, customize their experience, and stay informed.

## 🚀 Features

- 🔍 Real-time news fetching from Bing Search API
- 📊 Categorized news articles
- 👤 User authentication (Register/Login)
- 🌓 Dark and Light theme support
- 📱 Responsive design for various device sizes
- 🔒 Secure API with proper error handling
- 🔄 Regular news updates

## 💻 Tech Stack

- Backend:
  - 🐍 Python
  - 🗄️ SQLite
  - 🌐 FastAPI
- Frontend:
  - ⚛️ React Native
  - 🎨 Tailwind CSS
  - 🌙 next-themes for theming
- APIs:
  - 🔎 Bing Search API

## 🏁 Getting Started

### Prerequisites

- Python 3.8+
- Node.js and npm
- React Native development environment
- Bing Search API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/dcosodev/newsapp.git
   cd newshub
   ```

2. Set up the backend:
   ```
   cd backend
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

4. Configure environment variables:
   - Create a `.env` file in the backend directory
   - Add your Bing Search API key: `BING_API_KEY=your_api_key_here`

5. Initialize the database:
   ```
   python init_db.py
   ```

## 🖥️ Usage

1. Start the backend server:
   ```
   cd backend
   uvicorn main:app --reload
   ```

2. Run the React Native app:
   ```
   cd frontend
   npx react-native run-android  # or run-ios for iOS
   ```

## 🛠️ API Endpoints

- `GET /categories`: Fetch all news categories
- `GET /news/{category}`: Fetch news articles for a specific category
- `POST /register`: Register a new user
- `POST /login`: Authenticate a user

For full API documentation, visit `http://localhost:8000/docs` when the server is running.

## 📱 Mobile App

The React Native app provides an intuitive interface for browsing news:

- Swipe between categories
- Tap articles to read full stories
- Toggle between light and dark themes
- User authentication for a personalized experience

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Bing Search API](https://www.microsoft.com/en-us/bing/apis/bing-news-search-api)
- [FastAPI](https://fastapi.tiangolo.com/)
- [React Native](https://reactnative.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [next-themes](https://github.com/pacocoursey/next-themes)

---

Built with ❤️ by [DcosoDev](https://github.com/dcosodev)