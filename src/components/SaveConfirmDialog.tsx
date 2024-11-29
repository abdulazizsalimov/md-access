import React from 'react';

interface SaveConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLocal: () => void;
  onSaveServer: () => void;
  onDiscard: () => void;
  theme: 'dark' | 'light';
}

const SaveConfirmDialog: React.FC<SaveConfirmDialogProps> = ({
  isOpen,
  onClose,
  onSaveLocal,
  onSaveServer,
  onDiscard,
  theme
}) => {
  if (!isOpen) return null;

  const themeClasses = {
    dark: {
      dialog: 'bg-gray-800 text-gray-100',
      button: {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'text-gray-300 hover:bg-gray-700',
        danger: 'bg-red-600 hover:bg-red-700 text-white'
      }
    },
    light: {
      dialog: 'bg-white text-gray-900',
      button: {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'text-gray-600 hover:bg-gray-100',
        danger: 'bg-red-500 hover:bg-red-600 text-white'
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${themeClasses[theme].dialog} rounded-lg p-6 w-[400px] shadow-xl`}>
        <h2 className="text-xl font-semibold mb-4">Сохранить изменения?</h2>
        <p className="mb-6">У вас есть несохранённые изменения. Как вы хотите поступить?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${themeClasses[theme].button.secondary}`}
          >
            Отмена
          </button>
          <button
            onClick={onDiscard}
            className={`px-4 py-2 rounded ${themeClasses[theme].button.danger}`}
          >
            Не сохранять
          </button>
          <button
            onClick={onSaveLocal}
            className={`px-4 py-2 rounded ${themeClasses[theme].button.primary}`}
          >
            Сохранить локально
          </button>
          <button
            onClick={onSaveServer}
            className={`px-4 py-2 rounded ${themeClasses[theme].button.primary}`}
          >
            Сохранить на сервере
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveConfirmDialog;