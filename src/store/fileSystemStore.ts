import { create } from 'zustand';
import { fileSystem, FileSystemItem } from '../services/fileSystemService';

interface FileSystemState {
  currentPath: string;
  items: FileSystemItem[];
  isFileManagerVisible: boolean;
  loading: boolean;
  error: string | null;
  selectedItem: string | null;
  
  initialize: (username: string) => Promise<void>;
  setVisible: (visible: boolean) => void;
  createFile: (name: string) => Promise<void>;
  createDirectory: (name: string) => Promise<void>;
  deleteItem: (path: string) => Promise<void>;
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  navigateUp: () => void;
  navigateTo: (path: string) => void;
  refresh: () => Promise<void>;
}

export const useFileSystemStore = create<FileSystemState>((set, get) => ({
  currentPath: '',
  items: [],
  isFileManagerVisible: true,
  loading: false,
  error: null,
  selectedItem: null,

  initialize: async (username: string) => {
    set({ loading: true, error: null });
    try {
      const rootPath = await fileSystem.ensureUserRoot(username);
      const items = await fileSystem.listDirectory(rootPath);
      set({ currentPath: rootPath, items });
    } catch (error) {
      set({ error: 'Failed to initialize file system' });
    } finally {
      set({ loading: false });
    }
  },

  setVisible: (visible: boolean) => {
    set({ isFileManagerVisible: visible });
  },

  createFile: async (name: string) => {
    const { currentPath, refresh } = get();
    set({ loading: true, error: null });
    try {
      const path = `${currentPath}/${name}`;
      await fileSystem.createFile(path, name);
      await refresh();
    } catch (error) {
      set({ error: 'Failed to create file' });
    } finally {
      set({ loading: false });
    }
  },

  createDirectory: async (name: string) => {
    const { currentPath, refresh } = get();
    set({ loading: true, error: null });
    try {
      const path = `${currentPath}/${name}`;
      await fileSystem.createDirectory(path, name);
      await refresh();
    } catch (error) {
      set({ error: 'Failed to create directory' });
    } finally {
      set({ loading: false });
    }
  },

  deleteItem: async (path: string) => {
    const { refresh } = get();
    set({ loading: true, error: null });
    try {
      await fileSystem.delete(path);
      await refresh();
    } catch (error) {
      set({ error: 'Failed to delete item' });
    } finally {
      set({ loading: false });
    }
  },

  readFile: async (path: string) => {
    set({ loading: true, error: null });
    try {
      return await fileSystem.readFile(path);
    } catch (error) {
      set({ error: 'Failed to read file' });
      return '';
    } finally {
      set({ loading: false });
    }
  },

  writeFile: async (path: string, content: string) => {
    set({ loading: true, error: null });
    try {
      await fileSystem.writeFile(path, content);
    } catch (error) {
      set({ error: 'Failed to write file' });
    } finally {
      set({ loading: false });
    }
  },

  navigateUp: () => {
    const { currentPath } = get();
    const parentPath = currentPath.split('/').slice(0, -1).join('/');
    if (parentPath) {
      get().navigateTo(parentPath);
    }
  },

  navigateTo: async (path: string) => {
    set({ loading: true, error: null });
    try {
      const items = await fileSystem.listDirectory(path);
      set({ currentPath: path, items });
    } catch (error) {
      set({ error: 'Failed to navigate' });
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    const { currentPath } = get();
    set({ loading: true, error: null });
    try {
      const items = await fileSystem.listDirectory(currentPath);
      set({ items });
    } catch (error) {
      set({ error: 'Failed to refresh directory' });
    } finally {
      set({ loading: false });
    }
  }
}));