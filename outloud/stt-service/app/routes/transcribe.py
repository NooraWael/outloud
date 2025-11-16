from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
import os
import tempfile
from typing import Optional

from app.services.whisper_service import whisper_service

router = APIRouter()

# Allowed audio file extensions
ALLOWED_EXTENSIONS = {'.wav', '.mp3', '.m4a', '.webm', '.ogg', '.flac'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@router.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    language: Optional[str] = Form(None)
):
    """
    Transcribe audio file to text using Whisper
    
    Args:
        file: Audio file (wav, mp3, m4a, webm, ogg, flac)
        language: Optional language code (e.g., 'en', 'ar')
    
    Returns:
        JSON with transcript and metadata
    """
    
    # Validate file extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Read file content
    content = await file.read()
    file_size = len(content)
    
    # Validate file size
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // 1024 // 1024}MB"
        )
    
    if file_size == 0:
        raise HTTPException(
            status_code=400,
            detail="Empty file"
        )
    
    # Save to temporary file
    temp_file = None
    try:
        # Create temporary file with proper extension
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Transcribe
        result = whisper_service.transcribe(
            temp_file_path,
            language=language
        )
        
        return JSONResponse(content=result)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Transcription error: {str(e)}"
        )
    
    finally:
        # Clean up temporary file
        if temp_file and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except:
                pass