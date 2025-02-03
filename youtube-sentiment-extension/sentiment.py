from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS
from collections import Counter


app = Flask(__name__)
CORS(app)

sentiment_pipeline = pipeline("text-classification", 
                              model="nlptown/bert-base-multilingual-uncased-sentiment")


@app.route('/analyze_sentiment', methods=['POST'])



def analyze_sentiment():
    """
    This is the main function that takes the comments from the frontend and returns an overall
    sentiment.
    """
    
    try:
        # Retreiving comments
        data = request.get_json()
        comments = data.get('comments', [])

        if not comments or len(comments) < 20:
            return jsonify({"error": "Not enough comments"}), 500

        # analyzing using pretrained model
        sentiments = []
        for comment in comments:

            result = sentiment_pipeline(comment)
            sentiment_label = categorize_sentiment(result[0]['label'], result[0]['score'])
            sentiments.append(sentiment_label)

        sentiment_summary = compute_summary(sentiments)
        return jsonify({"sentiment": sentiment_summary})

    except Exception as e:
        return jsonify({"error": str(e)}), 500



def categorize_sentiment(label, score):
    """
    This turns the pretrained models 1-5 scoring system into negative, neutral, or positive
    categories.  Returns a string.

    (This doesn't actually use the confidence score atm)
    """

    # bucketing the scores into 3 categories
    if score >= 0.4:
        if label == "1 star" or label == "2 stars":
            return "Negative"
        elif label == "3 stars":
            return "Neutral"
        elif label == "4 stars" or label == "5 stars":
            return "Positive"
    else:
        return "Neutral"


def compute_summary(sentiments):
    """
    This function takes the analyzed comments and returns an overall sentiment as a single string.
    """

    sentiment_counts = Counter(sentiments)
    total = sum(sentiment_counts.values())
    print(total)

    pos_pct = (sentiment_counts["Positive"] / total) * 100
    neg_pct = (sentiment_counts["Negative"] / total) * 100
    neu_pct = (sentiment_counts["Neutral"] / total) * 100

    if neu_pct > 70:
        return "Neutral"
    elif abs(pos_pct - neg_pct) >= 10:
        return "Positive" if pos_pct > neg_pct else "Negative"
    else:
        return "Neutral"



if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000)