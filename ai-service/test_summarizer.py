import pytest
from fastapi.testclient import TestClient
from summarizer import app, simple_sentiment_analysis

client = TestClient(app)

def test_summarize_endpoint():
    response = client.post("/summarize", json={"chat_history": ["Hello", "This is a test"]})
    assert response.status_code == 200
    assert "summary" in response.json()

def test_analyze_endpoint():
    response = client.post("/analyze", json={"text": "This is a great service!"})
    assert response.status_code == 200
    json_response = response.json()
    assert "sentiment" in json_response
    assert "keywords" in json_response
    assert json_response["sentiment"] == "positive"
    assert "great" in json_response["keywords"]

def test_simple_sentiment_analysis_positive():
    sentiment, keywords = simple_sentiment_analysis("This is a good and excellent experience.")
    assert sentiment == "positive"
    assert "good" in keywords
    assert "excellent" in keywords

def test_simple_sentiment_analysis_negative():
    sentiment, keywords = simple_sentiment_analysis("This is a bad and terrible service.")
    assert sentiment == "negative"
    assert "bad" in keywords
    assert "terrible" in keywords

def test_simple_sentiment_analysis_neutral():
    sentiment, keywords = simple_sentiment_analysis("This is a factual statement.")
    assert sentiment == "neutral"
    assert not keywords

def test_simple_sentiment_analysis_mixed():
    sentiment, keywords = simple_sentiment_analysis("This is a good service but I had a problem.")
    assert sentiment == "neutral" # good (+1) and problem (-1) cancel out
    assert "good" in keywords
    assert "problem" in keywords

def test_analyze_endpoint_empty_text():
    response = client.post("/analyze", json={"text": ""})
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["sentiment"] == "neutral"
    assert not json_response["keywords"]

def test_summarize_endpoint_empty_history():
    response = client.post("/summarize", json={"chat_history": []})
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["summary"] == ""

def test_local_summary_long_text():
    # Create a long text with more than 3 sentences
    long_text = "This is the first sentence. This is the second sentence. This is the third sentence. This is the fourth sentence which should be truncated."
    # The local_summary function is not directly exposed via an endpoint in the same way,
    # but we can test its behavior through the /summarize endpoint with a mock API key.
    # To do this properly, one might need to refactor or use mocking for os.getenv.
    # For now, we assume "mock" is the default and it will use local_summary.
    response = client.post("/summarize", json={"chat_history": [long_text]})
    assert response.status_code == 200
    summary = response.json()["summary"]
    assert len(summary) <= 200
    assert "fourth sentence" not in summary # Assuming it gets truncated

def test_analyze_endpoint_with_various_keywords():
    response = client.post("/analyze", json={"text": "I love this helpful product, thanks!"})
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["sentiment"] == "positive"
    assert "love" in json_response["keywords"]
    assert "helpful" in json_response["keywords"]
    assert "thanks" in json_response["keywords"]

    response = client.post("/analyze", json={"text": "This is a terrible issue and a bad problem."})
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["sentiment"] == "negative"
    assert "terrible" in json_response["keywords"]
    assert "issue" in json_response["keywords"]
    assert "bad" in json_response["keywords"]
    assert "problem" in json_response["keywords"]
