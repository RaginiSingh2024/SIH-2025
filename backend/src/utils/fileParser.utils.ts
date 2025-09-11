import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const parseFile = async (
  filePath: string,
  fileType: string,
): Promise<string> => {
  try {
    switch (fileType) {
      case 'pdf':
        return await parsePDF(filePath);
      case 'docx':
        return await parseDOCX(filePath);
      case 'txt':
        return await parseTXT(filePath);
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('File parsing error:', error);
    throw new Error('Failed to parse file content');
  }
};

const parsePDF = async (filePath: string): Promise<string> => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

const parseDOCX = async (filePath: string): Promise<string> => {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
};

const parseTXT = async (filePath: string): Promise<string> => {
  return fs.readFileSync(filePath, 'utf-8');
};

export const chunkText = (
  text: string,
  maxChunkSize: number = 3000,
): string[] => {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (currentChunk.length + trimmedSentence.length + 1 <= maxChunkSize) {
      currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk + '.');
      }
      currentChunk = trimmedSentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk + '.');
  }

  return chunks.length > 0 ? chunks : [text];
};

export const cleanFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

export const ensureUploadDir = (uploadPath: string): void => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
};

export const deleteFile = (filePath: string): void => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};
