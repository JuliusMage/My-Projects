from fastapi import FastAPI
from pydantic import BaseModel
import openai
import os

app = FastAPI()

class SummarizeRequest(BaseModel):
    chat_history: list[str]

@app.post("/summarize")
async def summarize(req: SummarizeRequest):
    text = "\n".join(req.chat_history)
    api_key = os.getenv("OPENAI_API_KEY", "mock")
    if api_key != "mock":
        openai.api_key = api_key
        try:
            resp = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Summarize the following conversation."},
                    {"role": "user", "content": text},
                ],
            )
            summary = resp["choices"][0]["message"]["content"]
        except Exception:
            summary = text[:200]
    else:
        summary = text[:200]
    return {"summary": summary}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
