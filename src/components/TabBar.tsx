import React, { useState } from 'react';
import { X, Plus, Pencil } from 'lucide-react';

interface Tab {
  id: string;
  title: string;
  content: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
  onTabRename: (tabId: string, newTitle: string) => void;
  theme: 'dark' | 'light';
}

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onNewTab,
  onTabRename,
  theme
}) => {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (tabId: string, currentTitle: string) => {
    setEditingTabId(tabId);
    setEditValue(currentTitle);
  };

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === 'Enter') {
      if (editValue.trim()) {
        onTabRename(tabId, editValue.trim());
      }
      setEditingTabId(null);
    } else if (e.key === 'Escape') {
      setEditingTabId(null);
    }
  };

  const handleBlur = (tabId: string) => {
    if (editValue.trim()) {
      onTabRename(tabId, editValue.trim());
    }
    setEditingTabId(null);
  };

  const themeClasses = {
    dark: {
      container: 'bg-gray-750 border-b border-gray-700',
      tab: {
        base: 'border-r border-gray-700',
        active: 'bg-gray-800 text-white',
        inactive: 'text-gray-400 hover:bg-gray-800 hover:text-white'
      },
      input: 'bg-gray-700 focus:ring-blue-500',
      newTab: 'hover:bg-gray-700 text-gray-400 hover:text-white'
    },
    light: {
      container: 'bg-gray-50 border-b border-gray-200',
      tab: {
        base: 'border-r border-gray-200',
        active: 'bg-white text-gray-900',
        inactive: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      },
      input: 'bg-white border-gray-300 focus:ring-blue-500',
      newTab: 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
    }
  };

  return (
    <div className={`flex px-2 ${themeClasses[theme].container}`}>
      <div className="flex-1 flex overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`group flex items-center gap-2 px-4 py-2 ${themeClasses[theme].tab.base} ${
              activeTabId === tab.id
                ? themeClasses[theme].tab.active
                : themeClasses[theme].tab.inactive
            } cursor-pointer`}
            onClick={() => onTabSelect(tab.id)}
          >
            {editingTabId === tab.id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, tab.id)}
                onBlur={() => handleBlur(tab.id)}
                className={`px-2 py-0.5 rounded outline-none focus:ring-1 ${themeClasses[theme].input}`}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(tab.id, tab.title);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded p-0.5 mr-1"
                  aria-label="Edit tab name"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <span className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap cursor-default">
                  {tab.title}
                </span>
              </>
            )}
            {tabs.length > 1 && !editingTabId && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded p-0.5"
                aria-label="Close tab"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={onNewTab}
        className={`px-3 py-2 flex items-center gap-1 ${themeClasses[theme].newTab}`}
        aria-label="New tab"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TabBar;