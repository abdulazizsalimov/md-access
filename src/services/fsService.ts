import { promises as fs } from 'fs';
import path from 'path';

export const ensureDirectoryExists = async (dirPath: string) => {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

export const writeFile = async (filePath: string, content: string) => {
  await ensureDirectoryExists(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf8');
};

export const readFile = async (filePath: string): Promise<string> => {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return '';
  }
};

export const removeFile = async (filePath: string) => {
  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore errors if file doesn't exist
  }
};

export const listFiles = async (dirPath: string): Promise<string[]> => {
  try {
    await ensureDirectoryExists(dirPath);
    return await fs.readdir(dirPath);
  } catch {
    return [];
  }
};