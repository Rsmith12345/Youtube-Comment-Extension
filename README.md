# YouTube Sentiment Analyzer Chrome Extension

## Overview
YouTube Sentiment Analyzer is a Chrome extension that analyzes the sentiment of YouTube comment sections. It determines whether the overall sentiment of the comments is **Positive, Negative, or Neutral** and displays the result directly below the comment section header.

The project consists of:
- **Frontend:** JavaScript (`content.js`) for extracting comments and interacting with YouTube’s DOM.
- **Backend:** Python (`sentiment.py`) using `nlptown/bert-base-multilingual-uncased-sentiment` for sentiment analysis.

## How It Works
1. The extension extracts loaded comments from a YouTube video page.
2. It sends the comments to a Flask backend (`sentiment.py`) for processing.
3. The backend classifies each comment's sentiment and categorizes the comment section as a whole.
4. A sentiment label appears below the YouTube comment section header.

## Features
- Displays **Positive, Negative, or Neutral** sentiment analysis.
- SEE SCREENSHOT FOR EXAMPLE

## Requirements
- **Python**
- **Python Libraries:**
  - **Flask**
  - **Flask_CORS**
  - **Transformers (Hugging Face)**
  - **Collections**
- **Google Chrome**

## Installation & Usage

### 1. Clone the Repository
```sh
git clone https://github.com/Rsmith12345/youtube-comment-extension.git
cd youtube-sentiment-analyzer
```

### 2. Install Python Dependencies
```sh
pip install flask transformers flask-cors collections
```

### 3. Run the Backend Server
```sh
python sentiment.py
```

### 4. Load the Chrome Extension
1. Open **Google Chrome** and go to `chrome://extensions/`
2. Enable **Developer Mode** (top right corner).
3. Click **Load unpacked** and select the project folder (which needs to include content.js, manifest.json, and styles.css to work)

### 5. Use the Extension
- Go to a **YouTube video page**.
- Wait a few seconds for the sentiment label to appear.
- Scroll to load more comments for better analysis.

## Important Notes!
- It **only analyzes loaded comments**.  Since comments are loaded dynamically on youtube, scroll and open comment threads to analyze more of the comment section.
- It needs at least **20 comments** to work properly.

## Future Improvements
- Implement **multithreading**.
- Extend support for other websites (e.g., Twitter, Reddit).
- Optimize the sentiment model for faster performance.
