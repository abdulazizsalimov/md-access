import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface UserManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  users: Array<{
    username: string;
    isAdmin: boolean;
    lastLogin?: string;
  }>;
  onUpdatePassword: (username: string, newPassword: string) => void;
  onDeleteUser: (username: string) => void;
  theme: 'dark' | 'light';
}

const UserManagementDialog: React.FC<UserManagementDialogProps> = ({
  isOpen,
  onClose,
  users,
  onUpdatePassword,
  onDeleteUser,
  theme
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  if (!isOpen) return null;

  const handleDeleteClick = (username: string) => {
    setUserToDelete(username);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete);
      setShowConfirmDelete(false);
      setUserToDelete(null);
    }
  };

  const handlePasswordClick = (username: string) => {
    setUserToUpdate(username);
    setShowPasswordDialog(true);
  };

  const handlePasswordUpdate = () => {
    if (userToUpdate && newPassword.trim()) {
      onUpdatePassword(userToUpdate, newPassword.trim());
      setShowPasswordDialog(false);
      setUserToUpdate(null);
      setNewPassword('');
    }
  };

  const themeClasses = {
    dark: {
      dialog: 'bg-gray-800 text-gray-100',
      table: 'border-gray-700',
      cell: 'border-gray-700',
      input: 'bg-gray-700 border-gray-600 text-white',
      button: {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'text-gray-300 hover:bg-gray-700',
        danger: 'bg-red-600 hover:bg-red-700 text-white'
      }
    },
    light: {
      dialog: 'bg-white text-gray-900',
      table: 'border-gray-200',
      cell: 'border-gray-200',
      input: 'bg-white border-gray-300 text-gray-900',
      button: {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'text-gray-600 hover:bg-gray-100',
        danger: 'bg-red-500 hover:bg-red-600 text-white'
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${themeClasses[theme].dialog} rounded-lg p-6 w-[800px] shadow-xl`}>
          <h2 className="text-xl font-semibold mb-4">Управление пользователями</h2>
          <div className="overflow-x-auto">
            <table className={`w-full border ${themeClasses[theme].table}`}>
              <thead>
                <tr>
                  <th className={`px-4 py-2 text-left border ${themeClasses[theme].cell}`}>
                    Имя пользователя
                  </th>
                  <th className={`px-4 py-2 text-left border ${themeClasses[theme].cell}`}>
                    Последний вход
                  </th>
                  <th className={`px-4 py-2 text-left border ${themeClasses[theme].cell}`}>
                    Пароль
                  </th>
                  <th className={`px-4 py-2 text-center border ${themeClasses[theme].cell}`}>
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.username}>
                    <td className={`px-4 py-2 border ${themeClasses[theme].cell}`}>
                      {user.username} {user.isAdmin && <span className="text-blue-500">(Админ)</span>}
                    </td>
                    <td className={`px-4 py-2 border ${themeClasses[theme].cell}`}>
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleString()
                        : 'Никогда'}
                    </td>
                    <td className={`px-4 py-2 border ${themeClasses[theme].cell}`}>
                      ••••••••
                      <button
                        onClick={() => handlePasswordClick(user.username)}
                        className="ml-2 p-1 rounded hover:bg-gray-700"
                        title="Изменить пароль"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                    <td className={`px-4 py-2 border ${themeClasses[theme].cell} text-center`}>
                      {user.username !== 'admin' && (
                        <button
                          onClick={() => handleDeleteClick(user.username)}
                          className="p-1 rounded hover:bg-gray-700 text-red-500"
                          title="Удалить пользователя"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded ${themeClasses[theme].button.secondary}`}
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
        title="Подтверждение удаления"
        message="Вы уверены, что хотите удалить этого пользователя?"
        theme={theme}
      />

      {showPasswordDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${themeClasses[theme].dialog} rounded-lg p-6 w-[400px] shadow-xl`}>
            <h3 className="text-lg font-semibold mb-4">Изменить пароль</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Новый пароль
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`${themeClasses[theme].input} w-full px-3 py-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPasswordDialog(false);
                  setUserToUpdate(null);
                  setNewPassword('');
                }}
                className={`px-4 py-2 rounded ${themeClasses[theme].button.secondary}`}
              >
                Отмена
              </button>
              <button
                onClick={handlePasswordUpdate}
                className={`px-4 py-2 rounded ${themeClasses[theme].button.primary}`}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagementDialog;