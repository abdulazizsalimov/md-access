import React, { useRef, useEffect } from 'react';

export interface MenuItem {
  label: string;
  shortcut?: string;
  onClick?: () => void;
  children?: MenuItem[];
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: 'separator';
}

interface MenuProps {
  items: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

const Menu: React.FC<MenuProps> = ({ items, isOpen, onClose, theme }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuThemeClasses = {
    dark: 'bg-gray-800 shadow-lg',
    light: 'bg-white shadow-lg border border-gray-200'
  };

  const itemThemeClasses = {
    dark: 'hover:bg-gray-700 text-gray-100',
    light: 'hover:bg-gray-100 text-gray-900'
  };

  const shortcutThemeClasses = {
    dark: 'text-gray-400',
    light: 'text-gray-500'
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

  return (
    <div
      ref={menuRef}
      className={`absolute top-full left-0 mt-1 rounded-lg py-1 min-w-[200px] z-50 ${menuThemeClasses[theme]}`}
    >
      {items.map((item, index) => (
        item.type === 'separator' ? (
          <hr key={index} className="my-1 border-gray-700" />
        ) : (
          <button
            key={index}
            className={`w-full px-4 py-2 text-left flex justify-between items-center ${itemThemeClasses[theme]} ${
              item.disabled ? disabledClasses : ''
            }`}
            onClick={() => {
              if (item.onClick && !item.disabled) {
                item.onClick();
                onClose();
              }
            }}
            disabled={item.disabled}
          >
            <span className="flex items-center gap-2">
              {item.icon && <span className="w-4 h-4">{item.icon}</span>}
              {item.label}
            </span>
            {item.shortcut && (
              <span className={`text-sm ml-4 ${shortcutThemeClasses[theme]}`}>{item.shortcut}</span>
            )}
          </button>
        )
      ))}
    </div>
  );
};

export default Menu;