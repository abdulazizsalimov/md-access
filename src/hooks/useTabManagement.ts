import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDocumentsStore } from '../store/documentsStore';
import { generateUniqueId } from '../utils/idGenerator';
import { saveToTemp, removeFromTemp } from '../services/fileService';

export const useTabManagement = () => {
  const [pendingTabClose, setPendingTabClose] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const user = useAuthStore(state => state.user);
  const { getTabs, addTab, removeTab, updateTab, setActiveTab } = useDocumentsStore();

  const handleTabClose = useCallback((tabId: string) => {
    if (!user) return;

    const tabs = getTabs(user.username);
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;

    const hasUnsavedChanges = tab.content !== (tab.originalContent || '') && tab.content !== '';
    
    if (hasUnsavedChanges) {
      setPendingTabClose(tabId);
      setShowConfirmDialog(true);
    } else {
      closeTab(tabId);
    }
  }, [user, getTabs]);

  const closeTab = useCallback((tabId: string) => {
    if (!user) return;

    removeTab(user.username, tabId);
    removeFromTemp(user.username, tabId);

    const remainingTabs = getTabs(user.username);
    
    if (remainingTabs.length === 0) {
      const newTab = {
        id: generateUniqueId(),
        title: 'Новый документ',
        content: '',
        isNew: true,
        lastModified: Date.now()
      };
      addTab(user.username, newTab);
    }
  }, [user, getTabs, addTab, removeTab]);

  const handleNewTab = useCallback(() => {
    if (!user) return;
    
    const newTab = {
      id: generateUniqueId(),
      title: 'Новый документ',
      content: '',
      isNew: true,
      lastModified: Date.now()
    };
    
    addTab(user.username, newTab);
  }, [user, addTab]);

  const handleTabSelect = useCallback((tabId: string) => {
    if (!user) return;
    setActiveTab(user.username, tabId);
  }, [user, setActiveTab]);

  const handleTabRename = useCallback((tabId: string, newTitle: string) => {
    if (!user) return;
    
    const tabs = getTabs(user.username);
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      updateTab(user.username, tabId, tab.content, newTitle);
    }
  }, [user, getTabs, updateTab]);

  return {
    pendingTabClose,
    showConfirmDialog,
    setPendingTabClose,
    setShowConfirmDialog,
    handleTabClose,
    closeTab,
    handleNewTab,
    handleTabSelect,
    handleTabRename
  };
};