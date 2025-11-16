from faster_whisper import WhisperModel
import os
from typing import Dict, List, Optional

class WhisperService:
    def __init__(self):
        """Initialize Whisper model with settings from environment"""
        model_size = os.getenv("MODEL_SIZE", "base")  # tiny, base, small, medium, large
        device = os.getenv("DEVICE", "cpu")  # cpu or cuda
        compute_type = os.getenv("COMPUTE_TYPE", "int8")  # int8, float16, float32
        
        print(f"🎤 Loading Whisper model: {model_size} on {device} ({compute_type})")
        
        self.model = WhisperModel(
            model_size,
            device=device,
            compute_type=compute_type,
        )
        
        print(f"✅ Whisper model loaded successfully")
    
    def transcribe(
        self, 
        audio_path: str, 
        language: Optional[str] = None
    ) -> Dict:
        """
        Transcribe audio file to text
        
        Args:
            audio_path: Path to audio file
            language: Optional language code (e.g., 'en', 'ar')
        
        Returns:
            Dict with transcript and optional word-level timestamps
        """
        try:
            # Transcribe with word-level timestamps
            segments, info = self.model.transcribe(
                audio_path,
                language=language,
                beam_size=5,
                word_timestamps=True,  # Enable word timestamps for future heatmap
            )
            
            # Collect all segments
            transcript_parts = []
            words_data = []
            
            for segment in segments:
                transcript_parts.append(segment.text)
                
                # Collect word-level timestamps
                if hasattr(segment, 'words') and segment.words:
                    for word in segment.words:
                        words_data.append({
                            "text": word.word,
                            "start": round(word.start, 2),
                            "end": round(word.end, 2),
                        })
            
            full_transcript = " ".join(transcript_parts).strip()
            
            return {
                "transcript": full_transcript,
                "language": info.language,
                "language_probability": round(info.language_probability, 2),
                "duration": round(info.duration, 2),
                "words": words_data,  # Word-level timestamps
            }
            
        except Exception as e:
            raise Exception(f"Transcription failed: {str(e)}")

# Global instance (loaded once when app starts)
whisper_service = WhisperService()