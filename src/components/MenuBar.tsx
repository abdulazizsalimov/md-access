import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, HelpCircle, Users, FilePlus } from 'lucide-react';
import Menu, { MenuItem } from './Menu';
import AboutDialog from './AboutDialog';
import LogoutDialog from './LogoutDialog';
import CreateUserDialog from './CreateUserDialog';
import UserManagementDialog from './UserManagementDialog';
import CloseAllDialog from './CloseAllDialog';
import CreateItemDialog from './CreateItemDialog';
import { useAuthStore } from '../store/authStore';
import { useDocumentsStore } from '../store/documentsStore';
import { useFileSystemStore } from '../store/fileSystemStore';
import { menuThemeClasses } from '../utils/menuTheme';
import { themeClasses } from '../utils/theme';

interface MenuBarProps {
  onFileOpen: (path: string) => void;
  onFileSave: () => void;
  onNewTab: () => void;
  onCloseTab: () => void;
  showLineNumbers: boolean;
  onToggleLineNumbers: () => void;
  theme: 'dark' | 'light';
  onThemeChange: (theme: 'dark' | 'light') => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isPageMode?: boolean;
  onPageModeChange?: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  onFileOpen,
  onFileSave,
  onNewTab,
  onCloseTab,
  showLineNumbers,
  onToggleLineNumbers,
  theme,
  onThemeChange,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  isPageMode = false,
  onPageModeChange
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showCloseAllDialog, setShowCloseAllDialog] = useState(false);
  const [showCreateItemDialog, setShowCreateItemDialog] = useState(false);
  
  const { user, logout, createUser, updatePassword, deleteUser, getAllUsers } = useAuthStore();
  const closeAllTabs = useDocumentsStore(state => state.closeAllTabs);
  const { isFileManagerVisible, setVisible: setFileManagerVisible } = useFileSystemStore();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Ошибка переключения полноэкранного режима:', err);
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
    setActiveMenu(null);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  const handleCloseAll = () => {
    setShowCloseAllDialog(true);
    setActiveMenu(null);
  };

  const handleConfirmCloseAll = () => {
    if (user) {
      closeAllTabs(user.username);
    }
    setShowCloseAllDialog(false);
  };

  const handleCreateUser = (username: string, password: string, isAdmin: boolean) => {
    createUser(username, password, isAdmin);
  };

  const handleUpdatePassword = (username: string, newPassword: string) => {
    updatePassword(username, newPassword);
  };

  const handleDeleteUser = (username: string) => {
    deleteUser(username);
  };

  const handleMenuClick = (menuKey: string) => {
    setActiveMenu(activeMenu === menuKey ? null : menuKey);
  };

  const menus: Record<string, { label: string; items: MenuItem[] }> = {
    file: {
      label: 'Файл',
      items: [
        { 
          label: 'Создать', 
          shortcut: 'Ctrl+N',
          icon: <FilePlus className="w-4 h-4" />,
          onClick: () => {
            setShowCreateItemDialog(true);
            setActiveMenu(null);
          }
        },
        { 
          label: 'Сохранить', 
          shortcut: 'Ctrl+S', 
          onClick: () => {
            onFileSave();
            setActiveMenu(null);
          }
        },
        { 
          label: 'Закрыть', 
          shortcut: 'Ctrl+W', 
          onClick: () => {
            onCloseTab();
            setActiveMenu(null);
          }
        },
        {
          label: 'Закрыть все',
          onClick: handleCloseAll
        },
        { type: 'separator' },
        { 
          label: 'Выход',
          onClick: handleLogout
        },
      ],
    },
    edit: {
      label: 'Правка',
      items: [
        {
          label: 'Отменить',
          shortcut: 'Ctrl+Z',
          onClick: onUndo,
          disabled: !canUndo
        },
        {
          label: 'Повторить',
          shortcut: 'Ctrl+Y',
          onClick: onRedo,
          disabled: !canRedo
        },
        { type: 'separator' },
        {
          label: 'Вырезать',
          shortcut: 'Ctrl+X',
          onClick: () => document.execCommand('cut')
        },
        {
          label: 'Копировать',
          shortcut: 'Ctrl+C',
          onClick: () => document.execCommand('copy')
        },
        {
          label: 'Вставить',
          shortcut: 'Ctrl+V',
          onClick: () => document.execCommand('paste')
        },
        { type: 'separator' },
        {
          label: 'Выделить всё',
          shortcut: 'Ctrl+A',
          onClick: () => document.execCommand('selectAll')
        }
      ],
    },
    view: {
      label: 'Вид',
      items: [
        /*{
          label: 'Номера строк',
          onClick: () => {
            onToggleLineNumbers();
            setActiveMenu(null);
          },
          shortcut: showLineNumbers ? '✓' : '',
        },*/
        {
          label: 'Тема',
          onClick: () => {
            onThemeChange(theme === 'dark' ? 'light' : 'dark');
            setActiveMenu(null);
          },
          shortcut: theme === 'dark' ? 'Темная ✓' : 'Светлая ✓',
        },
        {
          label: 'Файловый менеджер',
          onClick: () => {
            setFileManagerVisible(!isFileManagerVisible);
            setActiveMenu(null);
          },
          shortcut: isFileManagerVisible ? '✓' : '',
        },
        {
          label: 'Постраничный режим',
          onClick: () => {
            if (onPageModeChange) {
              onPageModeChange();
              setActiveMenu(null);
            }
          },
          shortcut: isPageMode ? '✓' : '',
        },
        {
          label: 'Полноэкранный режим',
          onClick: toggleFullscreen,
          icon: isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />,
          shortcut: isFullscreen ? 'Esc' : 'F11',
        },
      ],
    },
    ...(user?.isAdmin ? {
      users: {
        label: 'Пользователи',
        items: [
          {
            label: 'Создать',
            icon: <Users className="w-4 h-4" />,
            onClick: () => {
              setShowCreateUserDialog(true);
              setActiveMenu(null);
            }
          },
          {
            label: 'Управление',
            onClick: () => {
              setShowUserManagement(true);
              setActiveMenu(null);
            }
          }
        ]
      }
    } : {}),
    help: {
      label: 'Справка',
      items: [
        {
          label: 'О программе',
          icon: <HelpCircle className="w-4 h-4" />,
          onClick: () => {
            setShowAbout(true);
            setActiveMenu(null);
          }
        }
      ]
    }
  };

  return (
    <>
      <div className={`flex px-2 py-1 rounded-t-lg ${menuThemeClasses.menuBar[theme]}`}>
        {Object.entries(menus).map(([key, menu]) => (
          <div key={key} className="relative">
            <button
              className={`px-3 py-1 rounded ${menuThemeClasses.button[theme]} ${
                activeMenu === key ? menuThemeClasses.activeButton[theme] : ''
              }`}
              onClick={() => handleMenuClick(key)}
            >
              {menu.label}
            </button>
            <Menu
              items={menu.items}
              isOpen={activeMenu === key}
              onClose={() => setActiveMenu(null)}
              theme={theme}
            />
          </div>
        ))}
      </div>

      <AboutDialog
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        theme={theme}
      />

      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleConfirmLogout}
        theme={theme}
      />

      <CreateUserDialog
        isOpen={showCreateUserDialog}
        onClose={() => setShowCreateUserDialog(false)}
        onCreateUser={handleCreateUser}
        theme={theme}
      />

      <UserManagementDialog
        isOpen={showUserManagement}
        onClose={() => setShowUserManagement(false)}
        users={getAllUsers()}
        onUpdatePassword={handleUpdatePassword}
        onDeleteUser={handleDeleteUser}
        theme={theme}
      />

      <CloseAllDialog
        isOpen={showCloseAllDialog}
        onClose={() => setShowCloseAllDialog(false)}
        onConfirm={handleConfirmCloseAll}
        theme={theme}
      />

      <CreateItemDialog
        isOpen={showCreateItemDialog}
        onClose={() => setShowCreateItemDialog(false)}
        onCreateFile={(name) => {
          onNewTab();
          setShowCreateItemDialog(false);
        }}
        onCreateFolder={() => {
          setShowCreateItemDialog(false);
        }}
        theme={theme}
      />
    </>
  );
};

export default MenuBar;