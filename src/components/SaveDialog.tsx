import React, { useState } from 'react';

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (filename: string, format: string) => void;
  initialFilename?: string;
}

const SaveDialog: React.FC<SaveDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialFilename = 'Новый документ'
}) => {
  const [filename, setFilename] = useState(initialFilename);
  const [format, setFormat] = useState('md');

  if (!isOpen) return null;

  const formats = [
    { value: 'md', label: 'Markdown (.md)' },
    { value: 'txt', label: 'Текстовый файл (.txt)' },
    { value: 'html', label: 'HTML документ (.html)' },
    { value: 'pdf', label: 'PDF документ (.pdf)' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(filename, format);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-[500px] shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Сохранить документ</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Имя файла:
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Формат файла:
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {formats.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveDialog;