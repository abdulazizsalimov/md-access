import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateUniqueId } from '../utils/idGenerator';
import { 
  saveTempDocument, 
  removeTempDocument, 
  clearAllTempDocuments,
  loadTempDocuments 
} from '../services/tempStorageService';

export interface Tab {
  id: string;
  title: string;
  content: string;
  isNew?: boolean;
  originalContent?: string;
  lastModified: number;
}

interface UserDocuments {
  [username: string]: {
    tabs: Tab[];
    activeTabId: string;
  };
}

interface DocumentsState {
  documents: UserDocuments;
  addTab: (username: string, tab: Omit<Tab, 'lastModified'>) => void;
  updateTab: (username: string, tabId: string, content: string, title?: string) => void;
  removeTab: (username: string, tabId: string) => void;
  closeAllTabs: (username: string) => void;
  setActiveTab: (username: string, tabId: string) => void;
  getTabs: (username: string) => Tab[];
  getActiveTabId: (username: string) => string;
  clearUserData: (username: string) => void;
  loadUserTabs: (username: string) => void;
}

export const useDocumentsStore = create<DocumentsState>()(
  persist(
    (set, get) => ({
      documents: {},
      
      loadUserTabs: (username) => {
        if (!username) return;

        const tempTabs = loadTempDocuments(username);
        
        set(state => {
          // If user already has tabs, don't load temp tabs
          if (state.documents[username]?.tabs.length > 0) {
            return state;
          }

          const tabs = tempTabs.length > 0 ? tempTabs : [{
            id: generateUniqueId(),
            title: 'Новый документ',
            content: '',
            isNew: true,
            lastModified: Date.now()
          }];

          return {
            documents: {
              ...state.documents,
              [username]: {
                tabs,
                activeTabId: tabs[0].id
              }
            }
          };
        });
      },

      addTab: (username, tab) => {
        if (!username) return;

        set((state) => {
          const userDocs = state.documents[username] || { tabs: [], activeTabId: '' };
          
          // If this is a new empty tab and there's already an empty tab, don't add it
          if (tab.isNew && !tab.content.trim()) {
            const existingEmptyTab = userDocs.tabs.find(t => !t.content.trim() && t.isNew);
            if (existingEmptyTab) {
              return {
                documents: {
                  ...state.documents,
                  [username]: {
                    ...userDocs,
                    activeTabId: existingEmptyTab.id
                  }
                }
              };
            }
          }

          // Check for duplicate content
          const existingTab = userDocs.tabs.find(t => t.content === tab.content);
          if (existingTab) {
            return {
              documents: {
                ...state.documents,
                [username]: {
                  ...userDocs,
                  activeTabId: existingTab.id
                }
              }
            };
          }

          const newTab = {
            ...tab,
            id: tab.id || generateUniqueId(),
            lastModified: Date.now()
          };

          // Save to temp if it has content
          if (newTab.content.trim()) {
            saveTempDocument(username, newTab);
          }

          return {
            documents: {
              ...state.documents,
              [username]: {
                tabs: [...userDocs.tabs, newTab],
                activeTabId: newTab.id
              }
            }
          };
        });
      },

      updateTab: (username, tabId, content, title) => {
        if (!username || !tabId) return;

        set((state) => {
          const userDocs = state.documents[username];
          if (!userDocs) return state;

          const updatedTabs = userDocs.tabs.map(tab => {
            if (tab.id === tabId) {
              const updatedTab = {
                ...tab,
                content,
                title: title || tab.title,
                lastModified: Date.now(),
                isNew: false
              };

              // Save to temp if it has content, otherwise remove from temp
              if (content.trim()) {
                saveTempDocument(username, updatedTab);
              } else {
                removeTempDocument(username, tabId);
              }

              return updatedTab;
            }
            return tab;
          });

          return {
            documents: {
              ...state.documents,
              [username]: {
                ...userDocs,
                tabs: updatedTabs
              }
            }
          };
        });
      },

      removeTab: (username, tabId) => {
        if (!username || !tabId) return;

        set((state) => {
          const userDocs = state.documents[username];
          if (!userDocs) return state;

          // Remove from temp storage
          removeTempDocument(username, tabId);

          const newTabs = userDocs.tabs.filter(tab => tab.id !== tabId);
          let newActiveTabId = userDocs.activeTabId;

          if (userDocs.activeTabId === tabId) {
            newActiveTabId = newTabs[newTabs.length - 1]?.id || '';
          }

          // If no tabs remain, create a new empty tab
          if (newTabs.length === 0) {
            const newTab = {
              id: generateUniqueId(),
              title: 'Новый документ',
              content: '',
              isNew: true,
              lastModified: Date.now()
            };
            newTabs.push(newTab);
            newActiveTabId = newTab.id;
          }

          return {
            documents: {
              ...state.documents,
              [username]: {
                tabs: newTabs,
                activeTabId: newActiveTabId
              }
            }
          };
        });
      },

      closeAllTabs: (username) => {
        if (!username) return;

        set((state) => {
          const userDocs = state.documents[username];
          if (!userDocs) return state;

          // Clear all temp files for this user
          clearAllTempDocuments(username);

          // Create a new empty tab
          const newTab = {
            id: generateUniqueId(),
            title: 'Новый документ',
            content: '',
            isNew: true,
            lastModified: Date.now()
          };

          return {
            documents: {
              ...state.documents,
              [username]: {
                tabs: [newTab],
                activeTabId: newTab.id
              }
            }
          };
        });
      },

      setActiveTab: (username, tabId) => {
        if (!username || !tabId) return;

        set((state) => {
          const userDocs = state.documents[username];
          if (!userDocs) return state;

          return {
            documents: {
              ...state.documents,
              [username]: {
                ...userDocs,
                activeTabId: tabId
              }
            }
          };
        });
      },

      getTabs: (username) => {
        if (!username) return [];
        const userDocs = get().documents[username];
        if (!userDocs) return [];
        return userDocs.tabs;
      },

      getActiveTabId: (username) => {
        if (!username) return '';
        return get().documents[username]?.activeTabId || '';
      },

      clearUserData: (username) => {
        if (!username) return;

        set((state) => {
          const { [username]: _, ...remainingDocs } = state.documents;
          clearAllTempDocuments(username);
          return { documents: remainingDocs };
        });
      },
    }),
    {
      name: 'documents-storage',
      skipHydration: true,
    }
  )
);