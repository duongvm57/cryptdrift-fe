import React, { useState, useEffect } from 'react';
import { DownloadIcon, AlertCircleIcon } from 'lucide-react';
import { useFileContext } from '../hooks/useFileContext';

interface DownloadFormProps {
  token?: string;
}

const DownloadForm: React.FC<DownloadFormProps> = ({ token: initialToken }) => {
  const [token, setToken] = useState('');
  const [key, setKey] = useState('');

  // Use context instead of local state
  const {
    isDownloading: isLoading,
    downloadProgress,
    error,
    downloadEncryptedFile,
    resetError
  } = useFileContext();

  useEffect(() => {
    if (initialToken) {
      const urlParams = new URLSearchParams(window.location.search);
      const decryptKey = urlParams.get('key');
      if (decryptKey) {
        setToken(initialToken);
        setKey(decryptKey);
        resetError();
      } else {
        resetError();
      }
    }
  }, [initialToken, resetError]);

  const handleDownload = async () => {
    if (!token || !key) {
      resetError();
      return;
    }

    try {
      console.log('Downloading with token:', token);
      // Use downloadEncryptedFile function from context
      await downloadEncryptedFile(token, key);
    } catch (err) {
      console.error('Download error:', err);
      // Error has been handled in the context
    }
  };

  return (
    <div className="flex flex-col p-6 bg-slate-800 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-4">Secure File Download</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md flex items-start">
          <AlertCircleIcon className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-slate-300">Downloading & Decrypting...</span>
            <span className="text-sm text-teal-400">{downloadProgress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleDownload}
        disabled={isLoading || !token || !key}
        className={`
          w-full py-2 px-4 rounded-md font-medium transition-all flex items-center justify-center
          ${isLoading || !token || !key
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600'}
        `}
      >
        <DownloadIcon className="h-5 w-5 mr-2" />
        {isLoading ? 'Processing...' : 'Download & Decrypt'}
      </button>
    </div>
  );
};

export default DownloadForm;