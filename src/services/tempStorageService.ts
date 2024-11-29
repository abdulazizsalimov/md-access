import { Tab } from '../store/documentsStore';
import { 
  STORAGE_PREFIX, 
  createStorageKey, 
  getStorageItem, 
  setStorageItem, 
  removeStorageItem,
  getAllUserKeys 
} from './storageService';

interface TempDocument {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

export const saveTempDocument = (username: string, tab: Tab): boolean => {
  if (!username || !tab || !tab.id) {
    console.warn('Invalid parameters provided to saveTempDocument');
    return false;
  }

  try {
    if (!tab.content.trim()) {
      return removeTempDocument(username, tab.id);
    }

    const tempDoc: TempDocument = {
      id: tab.id,
      title: tab.title || 'Untitled',
      content: tab.content,
      lastModified: Date.now()
    };

    const key = createStorageKey(STORAGE_PREFIX.TEMP_DOC, username, tab.id);
    return setStorageItem(key, tempDoc);
  } catch (error) {
    console.error('Error in saveTempDocument:', error);
    return false;
  }
};

export const loadTempDocuments = (username: string): Tab[] => {
  if (!username) {
    console.warn('Username is required for loadTempDocuments');
    return [];
  }

  try {
    const keys = getAllUserKeys(username, STORAGE_PREFIX.TEMP_DOC);
    const tabs: Tab[] = [];

    for (const key of keys) {
      const tempDoc = getStorageItem<TempDocument>(key);
      if (tempDoc?.content.trim()) {
        tabs.push({
          id: tempDoc.id,
          title: tempDoc.title,
          content: tempDoc.content,
          lastModified: tempDoc.lastModified,
          isNew: false
        });
      }
    }

    // Remove duplicates based on content
    const uniqueTabs = tabs.reduce((acc: Tab[], current) => {
      const exists = acc.find(tab => tab.content === current.content);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    return uniqueTabs.sort((a, b) => b.lastModified - a.lastModified);
  } catch (error) {
    console.error('Error in loadTempDocuments:', error);
    return [];
  }
};

export const removeTempDocument = (username: string, tabId: string): boolean => {
  if (!username || !tabId) {
    console.warn('Username and tabId are required for removeTempDocument');
    return false;
  }

  try {
    const key = createStorageKey(STORAGE_PREFIX.TEMP_DOC, username, tabId);
    return removeStorageItem(key);
  } catch (error) {
    console.error('Error in removeTempDocument:', error);
    return false;
  }
};

export const clearAllTempDocuments = (username: string): void => {
  if (!username) {
    console.warn('Username is required for clearAllTempDocuments');
    return;
  }

  try {
    const keys = getAllUserKeys(username, STORAGE_PREFIX.TEMP_DOC);
    keys.forEach(key => removeStorageItem(key));
  } catch (error) {
    console.error('Error in clearAllTempDocuments:', error);
  }
};