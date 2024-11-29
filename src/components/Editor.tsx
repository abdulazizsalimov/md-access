import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useDocumentsStore } from '../store/documentsStore';
import { useFileSystemStore } from '../store/fileSystemStore';
import { generateUniqueId } from '../utils/idGenerator';
import MenuBar from './MenuBar';
import TabBar from './TabBar';
import EditorToolbar from './EditorToolbar';
import FloatingToolbar from './FloatingToolbar';
import SaveDialog from './SaveDialog';
import SaveConfirmDialog from './SaveConfirmDialog';
import ConfirmDialog from './ConfirmDialog';
import PageEditor from './PageEditor';
import EditableContent from './EditableContent';
import FileManager from './FileManager';
import { themeClasses } from '../utils/theme';
import html2pdf from 'html2pdf.js';

interface EditorProps {
  theme: 'dark' | 'light';
  onThemeChange: (theme: 'dark' | 'light') => void;
}

function Editor({ theme, onThemeChange }: EditorProps) {
  const [fontSize, setFontSize] = useState(16);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [stats, setStats] = useState({ charCount: 0, wordCount: 0, sentenceCount: 0 });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSaveConfirmDialog, setShowSaveConfirmDialog] = useState(false);
  const [pendingTabClose, setPendingTabClose] = useState<string | null>(null);
  const [isPageMode, setIsPageMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore(state => state.user);
  const { 
    getTabs,
    getActiveTabId,
    addTab,
    updateTab,
    removeTab,
    setActiveTab,
    closeAllTabs
  } = useDocumentsStore();

  const {
    isFileManagerVisible,
    initialize: initializeFileSystem,
    createFile,
    createDirectory,
    deleteItem,
    readFile,
    writeFile
  } = useFileSystemStore();

  const activeTabId = user ? getActiveTabId(user.username) : '';
  const tabs = user ? getTabs(user.username) : [];
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  useEffect(() => {
    if (user) {
      initializeFileSystem(user.username);
    }
  }, [user, initializeFileSystem]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed && editorRef.current?.contains(sel.anchorNode)) {
        setSelection(sel);
      } else {
        setSelection(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const updateStats = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '');
    const charCount = text.length;
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;
    setStats({ charCount, wordCount, sentenceCount });
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      if (user && activeTabId) {
        updateTab(user.username, activeTabId, newContent);
      }
      updateStats(newContent);
    }
  };

  const handleContentChange = (content: string) => {
    if (user && activeTabId) {
      updateTab(user.username, activeTabId, content);
    }
    updateStats(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&#009');
    }
  };

  const handleFileOpen = async (path: string) => {
    try {
      const content = await readFile(path);
      const filename = path.split('/').pop() || 'Новый документ';
      
      if (activeTab?.isNew && !activeTab.content) {
        updateTab(user!.username, activeTabId, content, filename);
      } else {
        const newTabId = generateUniqueId();
        addTab(user!.username, {
          id: newTabId,
          title: filename,
          content,
          isNew: false,
          originalContent: content,
          lastModified: Date.now()
        });
      }
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const handleFileSave = () => {
    if (!activeTab) return;
    setShowSaveDialog(true);
  };

  const handleSaveConfirm = async (filename: string, format: string) => {
    if (!activeTab || !user) return;

    let content = activeTab.content;
    let filePath = `/home/${user.username}/${filename}.${format}`;

    try {
      switch (format) {
        case 'pdf':
          const element = document.createElement('div');
          element.innerHTML = content;
          const pdf = await html2pdf().from(element).outputPdf();
          const blob = new Blob([pdf], { type: 'application/pdf' });
          const reader = new FileReader();
          reader.onload = async () => {
            if (reader.result) {
              await writeFile(filePath, reader.result as string);
            }
          };
          reader.readAsBinaryString(blob);
          break;
        default:
          await writeFile(filePath, content);
      }

      updateTab(user.username, activeTab.id, content, filename);
      setShowSaveDialog(false);

      if (pendingTabClose) {
        removeTab(user.username, pendingTabClose);
        setPendingTabClose(null);
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const handleTabClose = (tabId: string) => {
    if (!user) return;

    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;

    const hasUnsavedChanges = tab.content !== (tab.originalContent || '') && tab.content.trim() !== '';
    
    if (hasUnsavedChanges) {
      setPendingTabClose(tabId);
      setShowSaveConfirmDialog(true);
    } else {
      removeTab(user.username, tabId);
    }
  };

  const handleSaveLocal = () => {
    setShowSaveConfirmDialog(false);
    setShowSaveDialog(true);
  };

  const handleSaveServer = async () => {
    if (!activeTab || !user || !pendingTabClose) return;

    try {
      const filename = activeTab.title;
      const filePath = `/home/${user.username}/${filename}`;
      await writeFile(filePath, activeTab.content);
      removeTab(user.username, pendingTabClose);
      setPendingTabClose(null);
      setShowSaveConfirmDialog(false);
    } catch (error) {
      console.error('Error saving to server:', error);
    }
  };

  const handleDiscardChanges = () => {
    if (pendingTabClose && user) {
      removeTab(user.username, pendingTabClose);
      setPendingTabClose(null);
      setShowSaveConfirmDialog(false);
    }
  };

  const handleNewTab = () => {
    if (!user) return;
    
    const newTab = {
      id: generateUniqueId(),
      title: 'Новый документ',
      content: '',
      isNew: true,
      lastModified: Date.now()
    };
    
    addTab(user.username, newTab);
  };

  const handleTabSelect = (tabId: string) => {
    if (!user) return;
    setActiveTab(user.username, tabId);
  };

  const handleTabRename = (tabId: string, newTitle: string) => {
    if (!user) return;
    
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      updateTab(user.username, tabId, tab.content, newTitle);
    }
  };

  return (
    <div className={`flex flex-col h-screen ${themeClasses[theme].container}`}>
      <MenuBar
        onFileOpen={handleFileOpen}
        onFileSave={handleFileSave}
        onNewTab={handleNewTab}
        onCloseTab={() => activeTabId && handleTabClose(activeTabId)}
        showLineNumbers={showLineNumbers}
        onToggleLineNumbers={() => setShowLineNumbers(!showLineNumbers)}
        theme={theme}
        onThemeChange={onThemeChange}
        onUndo={() => document.execCommand('undo')}
        onRedo={() => document.execCommand('redo')}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        isPageMode={isPageMode}
        onPageModeChange={() => setIsPageMode(!isPageMode)}
      />

      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={handleTabSelect}
        onTabClose={handleTabClose}
        onNewTab={handleNewTab}
        onTabRename={handleTabRename}
        theme={theme}
      />

      <EditorToolbar
        theme={theme}
        fontSize={fontSize}
        setFontSize={setFontSize}
        showColorPicker={showColorPicker}
        setShowColorPicker={setShowColorPicker}
        showBgColorPicker={showBgColorPicker}
        setShowBgColorPicker={setShowBgColorPicker}
        onFormat={handleFormat}
      />

      <div className="flex-1 overflow-hidden relative flex">
        <div className={`flex-1 ${isFileManagerVisible ? 'mr-64' : ''}`}>
          {selection && (
            <FloatingToolbar
              selection={selection}
              onFormat={handleFormat}
              theme={theme}
            />
          )}
          
          {isPageMode ? (
            <PageEditor
              content={activeTab?.content || ''}
              onChange={handleContentChange}
              theme={theme}
              fontSize={fontSize}
              showLineNumbers={showLineNumbers}
            />
          ) : (
            <EditableContent
              ref={editorRef}
              content={activeTab?.content || ''}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              className={`h-full p-4 prose ${
                theme === 'light' ? 'prose-slate' : 'prose-invert'
              } max-w-none`}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: '1.5',
                overflowY: 'auto'
              }}
            />
          )}
        </div>

        {isFileManagerVisible && (
          <FileManager
            theme={theme}
            onFileSelect={handleFileOpen}
          />
        )}
      </div>

      <div className={`px-4 py-2 text-sm ${themeClasses[theme].stats}`}>
        <span>Символов: {stats.charCount}</span>
        <span className="mx-4">Слов: {stats.wordCount}</span>
        <span>Предложений: {stats.sentenceCount}</span>
      </div>

      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSaveConfirm}
        initialFilename={activeTab?.title}
      />

      <SaveConfirmDialog
        isOpen={showSaveConfirmDialog}
        onClose={() => {
          setShowSaveConfirmDialog(false);
          setPendingTabClose(null);
        }}
        onSaveLocal={handleSaveLocal}
        onSaveServer={handleSaveServer}
        onDiscard={handleDiscardChanges}
        theme={theme}
      />
    </div>
  );
}

export default Editor;