import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Markets } from './components/Markets';
import { Exchange } from './components/Exchange';
import { Transfer } from './components/Transfer';
import { NavView } from './types';

function App() {
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

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default App;