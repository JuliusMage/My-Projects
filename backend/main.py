from fastapi import FastAPI
from typing import List
import json
from .models import Patent, PatentSearchRequest

app = FastAPI()

# Load mock data
with open("../data/mock_patents.json", "r") as f:
    patents_data = json.load(f)
    patents: List[Patent] = [Patent(**p) for p in patents_data]


@app.get("/api/health")
def read_root():
    return {"status": "ok"}


@app.post("/api/patents/search", response_model=List[Patent])
def search_patents(request: PatentSearchRequest):
    """
    Searches for patents based on a keyword.
    The keyword is searched in the title and abstract of the patents.
    """
    if not request.keyword:
        return patents

    keyword = request.keyword.lower()
    search_results = [
        p for p in patents
        if keyword in p.title.lower() or keyword in p.abstract.lower()
    ]
    return search_results
