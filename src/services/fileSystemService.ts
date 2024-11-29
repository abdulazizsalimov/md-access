import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  content?: string;
  parentPath: string;
  createdAt: number;
  updatedAt: number;
}

class FileSystemService {
  private storage: LocalForage;

  constructor() {
    this.storage = localforage.createInstance({
      name: 'FileSystemDB',
      storeName: 'filesystem'
    });
  }

  async ensureUserRoot(username: string) {
    const rootPath = `/home/${username}`;
    
    try {
      const root = await this.storage.getItem<FileSystemItem>(rootPath);
      if (!root) {
        await this.createDirectory(rootPath, username);
      }
    } catch (error) {
      console.error('Error ensuring user root:', error);
      await this.createDirectory(rootPath, username);
    }
    
    return rootPath;
  }

  private async getItem(path: string): Promise<FileSystemItem | null> {
    try {
      return await this.storage.getItem<FileSystemItem>(path);
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  }

  async listDirectory(path: string): Promise<FileSystemItem[]> {
    const items: FileSystemItem[] = [];
    
    try {
      await this.storage.iterate<FileSystemItem, void>((value, key) => {
        if (value.parentPath === path) {
          items.push(value);
        }
      });

      return items.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'directory' ? -1 : 1;
      });
    } catch (error) {
      console.error('Error listing directory:', error);
      return [];
    }
  }

  async createDirectory(path: string, name: string): Promise<void> {
    try {
      const parentPath = path.split('/').slice(0, -1).join('/');
      
      const directory: FileSystemItem = {
        id: uuidv4(),
        path,
        name,
        type: 'directory',
        parentPath,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await this.storage.setItem(path, directory);
    } catch (error) {
      console.error('Error creating directory:', error);
      throw new Error('Failed to create directory');
    }
  }

  async createFile(path: string, name: string, content: string = ''): Promise<string> {
    try {
      const parentPath = path.split('/').slice(0, -1).join('/');
      
      const file: FileSystemItem = {
        id: uuidv4(),
        path,
        name,
        type: 'file',
        content,
        parentPath,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await this.storage.setItem(path, file);
      return path;
    } catch (error) {
      console.error('Error creating file:', error);
      throw new Error('Failed to create file');
    }
  }

  async readFile(path: string): Promise<string> {
    try {
      const file = await this.getItem(path);
      if (!file || file.type !== 'file') {
        throw new Error('Not a file');
      }
      return file.content || '';
    } catch (error) {
      console.error('Error reading file:', error);
      throw new Error('Failed to read file');
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    try {
      const file = await this.getItem(path);
      if (!file || file.type !== 'file') {
        const parentPath = path.split('/').slice(0, -1).join('/');
        const name = path.split('/').pop()!;
        await this.createFile(path, name, content);
        return;
      }
      
      await this.storage.setItem(path, {
        ...file,
        content,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error('Error writing file:', error);
      throw new Error('Failed to write file');
    }
  }

  async delete(path: string): Promise<void> {
    try {
      const item = await this.getItem(path);
      if (!item) return;

      if (item.type === 'directory') {
        const items = await this.listDirectory(path);
        for (const child of items) {
          await this.delete(child.path);
        }
      }

      await this.storage.removeItem(path);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw new Error('Failed to delete item');
    }
  }
}

export const fileSystem = new FileSystemService();