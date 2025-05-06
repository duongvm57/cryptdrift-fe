import React, { useState, useRef, ChangeEvent } from 'react';
import { UploadCloudIcon, ClockIcon, DownloadIcon, AlertCircleIcon } from 'lucide-react';
import { useFileContext } from '../hooks/useFileContext';

interface UploadFormProps {
  onUploadSuccess: (url: string, key: string) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [expirationTime, setExpirationTime] = useState('24');
  const [downloadLimit, setDownloadLimit] = useState('1');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use context instead of local state
  const {
    isUploading,
    uploadProgress,
    error,
    uploadEncryptedFile,
    resetError
  } = useFileContext();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check file size limit (1GB)
      if (selectedFile.size > 1024 * 1024 * 1024) {
        resetError();
        return;
      }

      setFile(selectedFile);
      resetError();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];

      // Check file size limit (1GB)
      if (droppedFile.size > 1024 * 1024 * 1024) {
        resetError();
        return;
      }

      setFile(droppedFile);
      resetError();
    }
  };

  const handleUpload = async () => {
    if (!file) {
      resetError();
      return;
    }

    try {
      // Use uploadEncryptedFile function from context
      const { url, key } = await uploadEncryptedFile(
        file,
        parseInt(expirationTime),
        parseInt(downloadLimit)
      );

      // Call callback to notify successful upload
      onUploadSuccess(url, key);

      // Reset form
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      // Error has been handled in the context
    }
  };

  const formatFileSize = (size: number): string => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  return (
    <div className="flex flex-col p-6 bg-slate-800 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-4">Secure File Upload</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md flex items-start">
          <AlertCircleIcon className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div
        className={`
          border-2 border-dashed rounded-lg p-8 mb-4 text-center cursor-pointer transition-all
          ${file ? 'border-teal-500 bg-teal-500/10' : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'}
        `}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />

        <UploadCloudIcon className={`h-12 w-12 mx-auto mb-2 ${file ? 'text-teal-400' : 'text-slate-400'}`} />

        {file ? (
          <div>
            <p className="font-medium text-teal-300">{file.name}</p>
            <p className="text-slate-400 text-sm mt-1">{formatFileSize(file.size)}</p>
          </div>
        ) : (
          <div>
            <p className="text-slate-300 font-medium">Drop your file here or click to browse</p>
            <p className="text-slate-400 text-sm mt-1">Maximum file size: 1GB</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            <ClockIcon className="h-4 w-4 inline mr-1 opacity-70" />
            Expiration Time
          </label>
          <select
            value={expirationTime}
            onChange={(e) => setExpirationTime(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={isUploading}
          >
            <option value="1">1 hour</option>
            <option value="24">24 hours</option>
            <option value="168">7 days</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            <DownloadIcon className="h-4 w-4 inline mr-1 opacity-70" />
            Download Limit
          </label>
          <select
            value={downloadLimit}
            onChange={(e) => setDownloadLimit(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={isUploading}
          >
            <option value="1">1 download</option>
            <option value="2">2 downloads</option>
            <option value="5">5 downloads</option>
            <option value="10">10 downloads</option>
          </select>
        </div>
      </div>

      {isUploading && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-slate-300">
              {file && file.size > 10 * 1024 * 1024 
                ? `Uploading part ${uploadingPart} of ${totalParts}...`
                : 'Encrypting & Uploading...'}
            </span>
            <span className="text-sm text-teal-400">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={`
          w-full py-2 px-4 rounded-md font-medium transition-all
          ${!file || isUploading
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600'}
        `}
      >
        {isUploading ? 'Processing...' : 'Upload & Encrypt'}
      </button>
    </div>
  );
};

export default UploadForm;
