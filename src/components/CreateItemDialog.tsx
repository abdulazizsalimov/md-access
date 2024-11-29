import React, { useState } from 'react';
import { File, Folder } from 'lucide-react';

interface CreateItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFile: (name: string) => void;
  onCreateFolder: (name: string) => void;
  theme: 'dark' | 'light';
}

const CreateItemDialog: React.FC<CreateItemDialogProps> = ({
  isOpen,
  onClose,
  onCreateFile,
  onCreateFolder,
  theme
}) => {
  const [itemType, setItemType] = useState<'file' | 'folder'>('file');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const themeClasses = {
    dark: {
      dialog: 'bg-gray-800 text-gray-100',
      input: 'bg-gray-700 border-gray-600 text-white',
      button: {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'text-gray-300 hover:bg-gray-700'
      },
      option: 'hover:bg-gray-700'
    },
    light: {
      dialog: 'bg-white text-gray-900',
      input: 'bg-white border-gray-300 text-gray-900',
      button: {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'text-gray-600 hover:bg-gray-100'
      },
      option: 'hover:bg-gray-100'
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (itemType === 'file') {
      onCreateFile(name.endsWith('.md') ? name : `${name}.md`);
    } else {
      onCreateFolder(name);
    }
    
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${themeClasses[theme].dialog} rounded-lg p-6 w-[400px] shadow-xl`}>
        <h2 className="text-xl font-semibold mb-4">Создать новый элемент</h2>
        
        <div className="flex gap-4 mb-4">
          <button
            className={`flex-1 p-4 rounded-lg border ${
              itemType === 'file' ? 'border-blue-500' : 'border-gray-600'
            } ${themeClasses[theme].option}`}
            onClick={() => setItemType('file')}
          >
            <div className="flex flex-col items-center gap-2">
              <File className="w-8 h-8" />
              <span>Файл</span>
            </div>
          </button>
          
          <button
            className={`flex-1 p-4 rounded-lg border ${
              itemType === 'folder' ? 'border-blue-500' : 'border-gray-600'
            } ${themeClasses[theme].option}`}
            onClick={() => setItemType('folder')}
          >
            <div className="flex flex-col items-center gap-2">
              <Folder className="w-8 h-8" />
              <span>Папка</span>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Название {itemType === 'file' ? 'файла' : 'папки'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${themeClasses[theme].input} w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder={itemType === 'file' ? 'document.md' : 'New Folder'}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${themeClasses[theme].button.secondary}`}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded ${themeClasses[theme].button.primary}`}
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItemDialog;