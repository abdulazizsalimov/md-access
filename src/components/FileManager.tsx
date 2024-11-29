import React, { useState, useRef } from 'react';
import { ArrowLeft, Plus, File, Folder, MoreVertical, Trash2, Upload } from 'lucide-react';
import { useFileSystemStore } from '../store/fileSystemStore';
import CreateItemDialog from './CreateItemDialog';
import { themeClasses } from '../utils/theme';

interface FileManagerProps {
  theme: 'dark' | 'light';
  onFileSelect: (path: string) => void;
}

const FileManager: React.FC<FileManagerProps> = ({ theme, onFileSelect }) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState<{ x: number; y: number; path: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    currentPath,
    items,
    loading,
    createFile,
    createDirectory,
    deleteItem,
    navigateUp,
    navigateTo,
    writeFile
  } = useFileSystemStore();

  const canNavigateUp = currentPath.split('/').length > 3;

  const handleCreateFile = async (name: string) => {
    await createFile(name);
    onFileSelect(`${currentPath}/${name}`);
  };

  const handleCreateDirectory = async (name: string) => {
    await createDirectory(name);
  };

  const handleItemClick = (item: { type: string; path: string }) => {
    if (item.type === 'file') {
      onFileSelect(item.path);
    } else {
      navigateTo(item.path);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setShowContextMenu({ x: e.clientX, y: e.clientY, path });
  };

  const handleDelete = async (path: string) => {
    await deleteItem(path);
    setShowContextMenu(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        const filePath = `${currentPath}/${file.name}`;
        await writeFile(filePath, content);
        onFileSelect(filePath);
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error uploading file:', error);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fileManagerTheme = {
    dark: {
      container: 'bg-gray-800 border-l border-gray-700',
      header: 'border-b border-gray-700',
      button: 'text-gray-400 hover:bg-gray-700 hover:text-white',
      item: 'hover:bg-gray-700 text-gray-300',
      contextMenu: 'bg-gray-800 border border-gray-700'
    },
    light: {
      container: 'bg-white border-l border-gray-200',
      header: 'border-b border-gray-200',
      button: 'text-gray-600 hover:bg-gray-100',
      item: 'hover:bg-gray-100 text-gray-700',
      contextMenu: 'bg-white border border-gray-200'
    }
  };

  return (
    <div className={`w-64 h-full flex flex-col ${fileManagerTheme[theme].container}`}>
      <div className={`p-2 flex justify-between items-center ${fileManagerTheme[theme].header}`}>
        <div className="flex items-center gap-2">
          {canNavigateUp && (
            <button
              className={`p-1 rounded ${fileManagerTheme[theme].button}`}
              onClick={navigateUp}
              title="Назад"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <h2 className="text-lg font-semibold">Файлы</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`p-1 rounded ${fileManagerTheme[theme].button}`}
            onClick={handleUploadClick}
            title="Загрузить файл"
          >
            <Upload size={16} />
          </button>
          <button
            className={`p-1 rounded ${fileManagerTheme[theme].button}`}
            onClick={() => setShowCreateDialog(true)}
            title="Создать"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".txt,.md,.html"
        onChange={handleFileUpload}
      />

      <div className="flex-1 overflow-auto p-2">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-sm opacity-75">Загрузка...</span>
          </div>
        ) : (
          <div className="space-y-1">
            {items.map((item) => (
              <div
                key={item.path}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${fileManagerTheme[theme].item}`}
                onClick={() => handleItemClick(item)}
                onContextMenu={(e) => handleContextMenu(e, item.path)}
              >
                {item.type === 'file' ? (
                  <File size={16} />
                ) : (
                  <Folder size={16} />
                )}
                <span className="flex-1 truncate">{item.name}</span>
                <button
                  className={`p-1 rounded opacity-0 group-hover:opacity-100 ${fileManagerTheme[theme].button}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContextMenu(e, item.path);
                  }}
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showContextMenu && (
        <div
          className={`fixed z-50 py-1 rounded-lg shadow-lg ${fileManagerTheme[theme].contextMenu}`}
          style={{ top: showContextMenu.y, left: showContextMenu.x }}
        >
          <button
            className={`w-full px-4 py-2 text-left flex items-center gap-2 ${fileManagerTheme[theme].item}`}
            onClick={() => handleDelete(showContextMenu.path)}
          >
            <Trash2 size={16} />
            <span>Удалить</span>
          </button>
        </div>
      )}

      <CreateItemDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreateFile={handleCreateFile}
        onCreateFolder={handleCreateDirectory}
        theme={theme}
      />
    </div>
  );
};

export default FileManager;