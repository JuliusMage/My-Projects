from fastapi import FastAPI
from pydantic import BaseModel
import os

app = FastAPI()

class SummarizeRequest(BaseModel):
    chat_history: list[str]

@app.post("/summarize")
async def summarize(req: SummarizeRequest):
    text = "\n".join(req.chat_history)
    # Mock summarization
    summary = text[:200]
    return {"summary": summary}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
