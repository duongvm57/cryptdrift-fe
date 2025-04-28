import React, { useState } from 'react';
import { CheckCircleIcon, CopyIcon, LinkIcon } from 'lucide-react';

interface SuccessMessageProps {
  url: string;
  onReset: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ url, onReset }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="p-6 bg-slate-800 rounded-lg shadow-xl">
      <div className="flex items-center mb-4">
        <CheckCircleIcon className="h-6 w-6 text-emerald-400 mr-2" />
        <h2 className="text-xl font-semibold text-white">File Encrypted & Uploaded</h2>
      </div>
      
      <p className="text-slate-300 mb-6">
        Your file has been encrypted and uploaded successfully. Share this link to allow others to download the file.
      </p>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-1">
          <LinkIcon className="h-4 w-4 inline mr-1 opacity-70" />
          Secure Download Link
        </label>
        <div className="flex">
          <div className="flex-grow bg-slate-700 text-slate-300 rounded-l-md p-2 truncate overflow-ellipsis border border-slate-600">
            {url}
          </div>
          <button 
            onClick={handleCopyUrl}
            className="bg-slate-600 hover:bg-slate-500 transition-colors rounded-r-md px-3 text-white flex items-center justify-center border border-slate-600"
          >
            {copiedUrl ? <CheckCircleIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          This link contains both the download token and decryption key. It will expire according to your settings.
        </p>
      </div>
      
      <button
        onClick={onReset}
        className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 transition-colors rounded-md text-white font-medium"
      >
        Upload Another File
      </button>
    </div>
  );
};

export default SuccessMessage;