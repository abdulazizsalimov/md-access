interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  content?: string;
  parentPath: string;
  createdAt: number;
  updatedAt: number;
}