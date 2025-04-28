import React from 'react';
import HomePage from './pages/HomePage';
import DownloadPage from './pages/DownloadPage';
import { FileProvider } from './context/FileContext';

function App() {
  // Simple routing based on pathname
  // In a real implementation, this would use React Router
  const path = window.location.pathname;

  // Wrap the entire app with FileProvider to make context available everywhere
  return (
    <FileProvider>
      {path.startsWith('/download') ? <DownloadPage /> : <HomePage />}
    </FileProvider>
  );
}

export default App;