import multer from 'multer';
import { AppError } from './errorHandler';

// Store files in memory (we'll upload to Supabase)
const storage = multer.memoryStorage();

// File filter (only audio files)
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedMimeTypes = [
    'audio/webm',
    'audio/wav',
    'audio/mp4',
    'audio/m4a',
    'audio/mpeg',
    'audio/mp3',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only audio files are allowed', 400), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
});