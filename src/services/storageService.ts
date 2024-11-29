// Storage keys and prefixes
const STORAGE_PREFIX = {
  TEMP_DOC: 'temp_doc',
  USER_TABS: 'user_tabs'
};

export const createStorageKey = (prefix: string, username: string, id?: string): string => {
  if (!prefix || !username) {
    throw new Error('Prefix and username are required for storage key creation');
  }
  return [prefix, username, id].filter(Boolean).join('_');
};

export const getStorageItem = <T>(key: string): T | null => {
  if (!key) {
    console.warn('Key is required for getStorageItem');
    return null;
  }

  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsed = JSON.parse(item);
    return parsed as T;
  } catch (error) {
    console.error(`Error reading from storage (${key}):`, error);
    return null;
  }
};

export const setStorageItem = (key: string, value: any): boolean => {
  if (!key) {
    console.warn('Key is required for setStorageItem');
    return false;
  }

  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Error writing to storage (${key}):`, error);
    return false;
  }
};

export const removeStorageItem = (key: string): boolean => {
  if (!key) {
    console.warn('Key is required for removeStorageItem');
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from storage (${key}):`, error);
    return false;
  }
};

export const getAllUserKeys = (username: string, prefix: string): string[] => {
  if (!username || !prefix) {
    console.warn('Username and prefix are required for getAllUserKeys');
    return [];
  }

  try {
    const keys: string[] = [];
    const prefixPattern = `${prefix}_${username}`;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefixPattern)) {
        keys.push(key);
      }
    }
    return keys;
  } catch (error) {
    console.error('Error in getAllUserKeys:', error);
    return [];
  }
};

export { STORAGE_PREFIX };