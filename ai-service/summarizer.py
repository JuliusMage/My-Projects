from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import os

app = FastAPI()

class SummarizeRequest(BaseModel):
    chat_history: list[str]


def local_summary(text: str) -> str:
    """Fallback summarization using a naive first-sentences approach."""
    sentences = [s.strip() for s in text.split(".") if s.strip()]
    return ". ".join(sentences[:3])[:200]

@app.post("/summarize")
async def summarize(req: SummarizeRequest):
    text = "\n".join(req.chat_history)
    api_key = os.getenv("OPENAI_API_KEY", "mock")
    if api_key != "mock":
        openai.api_key = api_key
        try:
            resp = await openai.ChatCompletion.acreate(
                model=os.getenv("OPENAI_MODEL", "gpt-3.5-turbo"),
                messages=[
                    {"role": "system", "content": "Summarize the following conversation."},
                    {"role": "user", "content": text},
                ],
            )
            summary = resp["choices"][0]["message"]["content"]
        except Exception:
            summary = local_summary(text)
    else:
        summary = local_summary(text)
    return {"summary": summary}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
