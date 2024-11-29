import React, { useEffect, useState } from 'react';
import Editor from './components/Editor';
import LoginPage from './components/LoginPage';
import { useAuthStore } from './store/authStore';
import { useDocumentsStore } from './store/documentsStore';

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const user = useAuthStore(state => state.user);
  const loadUserTabs = useDocumentsStore(state => state.loadUserTabs);

  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserTabs(user.username);
    }
  }, [user, loadUserTabs]);

  if (!user) {
    return <LoginPage theme={theme} />;
  }

  return <Editor theme={theme} onThemeChange={setTheme} />;
}

export default App;