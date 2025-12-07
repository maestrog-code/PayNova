import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Markets } from './components/Markets';
import { Exchange } from './components/Exchange';
import { Transfer } from './components/Transfer';
import { SignIn } from './components/SignIn';
import { NavView } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<NavView>('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'markets':
        return <Markets />;
      case 'exchange':
        return <Exchange />;
      case 'transfer':
        return <Transfer />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  if (!isAuthenticated) {
    return <SignIn onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView}
      onLogout={() => setIsAuthenticated(false)}
    >
      {renderView()}
    </Layout>
  );
}

export default App;
