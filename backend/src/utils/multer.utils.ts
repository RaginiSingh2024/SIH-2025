import multer from 'multer';
import path from 'path';

import { cleanFileName, ensureUploadDir } from './fileParser.utils';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    ensureUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const cleanedName = cleanFileName(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${cleanedName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

export const handleFileUpload = upload.single('file');
export const handleMultipleFileUpload = (key: string) => upload.array(key, 5);
