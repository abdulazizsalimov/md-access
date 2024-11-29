import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

interface LoginPageProps {
  theme: 'dark' | 'light';
}

const LoginPage: React.FC<LoginPageProps> = ({ theme }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  
  const login = useAuthStore(state => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password, remember);
    if (!success) {
      setError('Неверное имя пользователя или пароль');
    }
  };

  const themeClasses = {
    dark: {
      container: 'bg-gray-900',
      card: 'bg-gray-800',
      input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
      button: 'bg-blue-600 hover:bg-blue-700',
      text: 'text-gray-300',
      error: 'text-red-400'
    },
    light: {
      container: 'bg-gray-50',
      card: 'bg-white',
      input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
      button: 'bg-blue-500 hover:bg-blue-600',
      text: 'text-gray-600',
      error: 'text-red-500'
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses[theme].container} flex items-center justify-center p-4`}>
      <div className={`${themeClasses[theme].card} w-full max-w-md rounded-lg shadow-lg p-8`}>
        <h2 className="text-2xl font-bold mb-6 text-center">Вход в MD-Access</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className={`${themeClasses[theme].error} text-sm text-center`}>
              {error}
            </div>
          )}
          
          <div>
            <label className={`block text-sm font-medium ${themeClasses[theme].text} mb-2`}>
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
            <label className={`block text-sm font-medium ${themeClasses[theme].text} mb-2`}>
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
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="remember"
              className={`ml-2 block text-sm ${themeClasses[theme].text}`}
            >
              Запомнить вход
            </label>
          </div>

          <button
            type="submit"
            className={`${themeClasses[theme].button} w-full py-2 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;