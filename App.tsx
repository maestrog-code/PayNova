
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Assistant } from './components/Assistant';
import { Exchange } from './components/Exchange';
import { Transfer } from './components/Transfer';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { NavView, AppTheme } from './types';
import { apiService } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return apiService.isAuthenticated();
  });
  const [authView, setAuthView] = useState<'signIn' | 'signUp'>('signIn');
  const [currentView, setCurrentView] = useState<NavView>('home');
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('paynova_theme') as AppTheme) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('paynova_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  const handleLogout = () => {
    apiService.clearTokens();
    setIsAuthenticated(false);
    setAuthView('signIn');
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'assistant':
        return <Assistant />;
      case 'exchange':
        return <Exchange theme={theme} />;
      case 'transfer':
        return <Transfer theme={theme} />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  if (!isAuthenticated) {
    if (authView === 'signIn') {
      return <SignIn onLogin={() => setIsAuthenticated(true)} onNavigateToSignUp={() => setAuthView('signUp')} />;
    }
    return <SignUp onSignUp={() => setIsAuthenticated(true)} onNavigateToSignIn={() => setAuthView('signIn')} />;
  }

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView}
      onLogout={handleLogout}
      theme={theme}
      onToggleTheme={toggleTheme}
    >
      {renderView()}
    </Layout>
  );
}

export default App;
