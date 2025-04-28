import React from 'react';
import HomePage from './pages/HomePage';
import DownloadPage from './pages/DownloadPage';

function App() {
  // Simple routing based on pathname
  // In a real implementation, this would use React Router
  const path = window.location.pathname;
  
  if (path.startsWith('/download')) {
    return <DownloadPage />;
  }
  
  return <HomePage />;
}

export default App;