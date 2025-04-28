import React, { createContext, useContext, useState, ReactNode } from 'react';
import { uploadFile, getFileInfo, downloadFile } from '../services/api';
import { generateEncryptionKey, encryptFile, exportKeyToHex, importKeyFromHex, decryptFile } from '../utils/encryption';

// Define data type for context
interface FileContextType {
  // State
  isUploading: boolean;
  uploadProgress: number;
  isDownloading: boolean;
  downloadProgress: number;
  error: string | null;

  // Upload handling function
  uploadEncryptedFile: (
    file: File,
    expirationHours: number,
    downloadLimit: number
  ) => Promise<{ url: string, key: string }>;

  // Download handling function
  downloadEncryptedFile: (
    token: string,
    key: string
  ) => Promise<void>;

  // Function to get file information
  getFileInformation: (token: string) => Promise<any>;

  // Function to reset error
  resetError: () => void;
}

// Create context with default value null
const FileContext = createContext<FileContextType | null>(null);

// Hook to use context
export function useFileContext() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return context;
}

// Props for Provider
interface FileProviderProps {
  children: ReactNode;
}

// Provider component
export function FileProvider({ children }: FileProviderProps) {
  // Required states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Function to upload encrypted file
  const uploadEncryptedFile = async (
    file: File,
    expirationHours: number = 24,
    downloadLimit: number = 1
  ): Promise<{ url: string, key: string }> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      // Create encryption key
      const encryptionKey = await generateEncryptionKey();

      // Encrypt file
      const encryptedFile = await encryptFile(file, encryptionKey);

      // Export key as hex string
      const keyString = await exportKeyToHex(encryptionKey);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Call upload API
      const response = await uploadFile({
        file,
        encryptedFile,
        expiration_hours: expirationHours,
        download_limit: downloadLimit,
        decryption_key: keyString,
        use_multipart: file.size > 10 * 1024 * 1024 // Use multipart if file > 10MB
      });

      // Complete the progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Return URL and key
      return {
        url: response.url,
        key: keyString
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while uploading the file');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  // Function to download encrypted file
  const downloadEncryptedFile = async (token: string, key: string): Promise<void> => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      setError(null);

      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Process token if it's a full URL
      let tokenValue = token;
      if (token.includes('http://') || token.includes('https://')) {
        // If token is a full URL, only extract the JWT token part
        const parts = token.split('/api/download/');
        if (parts.length > 1) {
          tokenValue = parts[1];
        }
      }

      console.log('Using token for download:', tokenValue);

      // Call download API
      const encryptedBlob = await downloadFile(tokenValue);

      // Import key from hex string
      const encryptionKey = await importKeyFromHex(key);

      // Decrypt file
      const decryptedBlob = await decryptFile(encryptedBlob, encryptionKey);

      // Complete the progress
      clearInterval(progressInterval);
      setDownloadProgress(100);

      // Create URL and download file
      const url = URL.createObjectURL(decryptedBlob);
      const a = document.createElement('a');
      a.href = url;

      // Get file information to set file name
      try {
        const fileInfo = await getFileInfo(tokenValue);
        a.download = fileInfo.filename || 'downloaded-file';
      } catch {
        a.download = 'downloaded-file';
      }

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while downloading the file');
      throw err;
    } finally {
      setIsDownloading(false);
    }
  };

  // Function to get file information
  const getFileInformation = async (token: string) => {
    try {
      // Process token if it's a full URL
      let tokenValue = token;
      if (token.includes('http://') || token.includes('https://')) {
        // If token is a full URL, only extract the JWT token part
        const parts = token.split('/api/download/');
        if (parts.length > 1) {
          tokenValue = parts[1];
        }
      }

      return await getFileInfo(tokenValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while getting file information');
      throw err;
    }
  };

  // Function to reset error
  const resetError = () => {
    setError(null);
  };

  // Context value
  const value: FileContextType = {
    isUploading,
    uploadProgress,
    isDownloading,
    downloadProgress,
    error,
    uploadEncryptedFile,
    downloadEncryptedFile,
    getFileInformation,
    resetError
  };

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
}
