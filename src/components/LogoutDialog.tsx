import React from 'react';

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  theme: 'dark' | 'light';
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({ isOpen, onClose, onConfirm, theme }) => {
  if (!isOpen) return null;

  const themeClasses = {
    dark: {
      dialog: 'bg-gray-800 text-gray-100',
      button: {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'text-gray-300 hover:bg-gray-700'
      }
    },
    light: {
      dialog: 'bg-white text-gray-900',
      button: {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'text-gray-600 hover:bg-gray-100'
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${themeClasses[theme].dialog} rounded-lg p-6 w-[400px] shadow-xl`}>
        <h2 className="text-xl font-semibold mb-4">Подтверждение выхода</h2>
        <p className="mb-6">Вы уверены, что хотите выйти из аккаунта?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${themeClasses[theme].button.secondary}`}
          >
            Нет
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded ${themeClasses[theme].button.primary}`}
          >
            Да
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutDialog;