import React from 'react';

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

const AboutDialog: React.FC<AboutDialogProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  const themeClasses = {
    dark: {
      dialog: 'bg-gray-800 text-gray-100',
      button: 'hover:bg-gray-700'
    },
    light: {
      dialog: 'bg-white text-gray-900',
      button: 'hover:bg-gray-100'
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${themeClasses[theme].dialog} rounded-lg p-6 w-[400px] shadow-xl`}>
        <h2 className="text-2xl font-semibold mb-2">MD-Access</h2>
        <p className="text-sm opacity-75 mb-4">Версия 1.0.0</p>
        <p className="mb-6 text-sm">
          MD-Access - это современный текстовый редактор с поддержкой Markdown, 
          предназначенный для создания и редактирования документов. Редактор 
          поддерживает работу с несколькими вкладками, форматирование текста и 
          постраничный режим просмотра.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${themeClasses[theme].button}`}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutDialog;