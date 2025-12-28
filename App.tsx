
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Assistant } from './components/Assistant';
import { Exchange } from './components/Exchange';
import { Transfer } from './components/Transfer';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { NavView, AppTheme, API_BASE_URL } from './types';
import { Loader2 } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [authView, setAuthView] = useState<'signIn' | 'signUp'>('signIn');
  const [currentView, setCurrentView] = useState<NavView>('home');
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('paynova_theme') as AppTheme) || 'dark';
  });

  // Check backend health and existing session on mount
  useEffect(() => {
    const initApp = async () => {
      const savedAuth = localStorage.getItem('paynova_auth');
      
      try {
        // Ping backend to ensure connectivity
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok && savedAuth === 'true') {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Backend unreachable:", err);
      } finally {
        setIsInitializing(false);
      }
    };

    initApp();
  }, []);

  useEffect(() => {
    localStorage.setItem('paynova_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleLogin = () => {
    localStorage.setItem('paynova_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('paynova_auth');
    setIsAuthenticated(false);
    setCurrentView('home');
  };

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

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-[#4facfe] animate-spin" />
        <p className="text-[#4facfe] font-mono text-xs tracking-[0.5em] uppercase animate-pulse">Connecting to PayNova Node...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authView === 'signIn') {
      return <SignIn onLogin={handleLogin} onNavigateToSignUp={() => setAuthView('signUp')} />;
    }
    return <SignUp onSignUp={handleLogin} onNavigateToSignIn={() => setAuthView('signIn')} />;
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
