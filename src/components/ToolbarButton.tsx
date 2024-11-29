import React from 'react';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
  shortcut?: string;
  isActive?: boolean;
  theme?: 'dark' | 'light';
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  onClick,
  label,
  shortcut,
  isActive,
  theme = 'dark'
}) => {
  const themeClasses = {
    dark: {
      base: 'text-gray-100',
      hover: 'hover:bg-gray-700',
      active: 'bg-gray-700'
    },
    light: {
      base: 'text-gray-700',
      hover: 'hover:bg-gray-100',
      active: 'bg-gray-100'
    }
  };

  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded transition-colors relative group ${themeClasses[theme].base} ${themeClasses[theme].hover} ${
        isActive ? themeClasses[theme].active : ''
      }`}
      title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
      aria-label={label}
    >
      {icon}
    </button>
  );
};

export default ToolbarButton;