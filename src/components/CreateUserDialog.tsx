import React, { useState } from 'react';

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: (username: string, password: string, isAdmin: boolean) => void;
  theme: 'dark' | 'light';
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ isOpen, onClose, onCreateUser, theme }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      onCreateUser(username.trim(), password.trim(), isAdmin);
      setUsername('');
      setPassword('');
      setIsAdmin(false);
      onClose();
    }
  };

  const themeClasses = {
    dark: {
      dialog: 'bg-gray-800 text-gray-100',
      input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
      button: {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'text-gray-300 hover:bg-gray-700'
      }
    },
    light: {
      dialog: 'bg-white text-gray-900',
      input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
      button: {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'text-gray-600 hover:bg-gray-100'
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${themeClasses[theme].dialog} rounded-lg p-6 w-[400px] shadow-xl`}>
        <h2 className="text-xl font-semibold mb-4">Создать пользователя</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Имя пользователя
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`${themeClasses[theme].input} w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${themeClasses[theme].input} w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isAdmin" className="ml-2 block text-sm">
              Администратор
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
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

export default CreateUserDialog;