from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.routes import transcribe

load_dotenv()

app = FastAPI(
    title="Outloud STT Service",
    version="1.0.0",
    description="Speech-to-text service using Faster Whisper"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "outloud-stt",
        "model": os.getenv("MODEL_SIZE", "base"),
        "device": os.getenv("DEVICE", "cpu"),
    }

# Include routes
app.include_router(transcribe.router, prefix="/stt", tags=["STT"])

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)