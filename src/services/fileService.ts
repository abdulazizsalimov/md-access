import { Tab } from '../store/documentsStore';

export const saveToTemp = async (username: string, tab: Tab) => {
  try {
    // Only save if tab has content
    if (!tab.content.trim()) {
      localStorage.removeItem(`temp_${username}_${tab.id}`);
      return;
    }

    const tempDoc = {
      id: tab.id,
      title: tab.title,
      content: tab.content,
      lastModified: Date.now()
    };

    localStorage.setItem(
      `temp_${username}_${tab.id}`,
      JSON.stringify(tempDoc)
    );
  } catch (error) {
    console.error('Error saving temp document:', error);
  }
};

export const loadFromTemp = async (username: string): Promise<Tab[]> => {
  try {
    const tabs: Tab[] = [];
    
    // Get all temp documents for this user
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`temp_${username}_`)) {
        const tempDocStr = localStorage.getItem(key);
        if (tempDocStr) {
          const tempDoc = JSON.parse(tempDocStr);
          
          // Only load documents that have content
          if (tempDoc.content.trim()) {
            tabs.push({
              id: tempDoc.id,
              title: tempDoc.title,
              content: tempDoc.content,
              lastModified: tempDoc.lastModified,
              isNew: false
            });
          }
        }
      }
    }

    // Sort tabs by last modified date
    return tabs.sort((a, b) => b.lastModified - a.lastModified);
  } catch (error) {
    console.error('Error loading temp documents:', error);
    return [];
  }
};

export const removeFromTemp = async (username: string, tabId: string) => {
  try {
    localStorage.removeItem(`temp_${username}_${tabId}`);
  } catch (error) {
    console.error('Error removing temp document:', error);
  }
};

export const clearAllTemp = async (username: string) => {
  try {
    // Remove all temp documents for this user
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith(`temp_${username}_`)) {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Error clearing temp documents:', error);
  }
};