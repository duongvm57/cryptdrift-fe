import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UploadForm from '../components/UploadForm';
import SuccessMessage from '../components/SuccessMessage';
import InfoSection from '../components/InfoSection';
import EncryptionAnimation from '../components/EncryptionAnimation';

const HomePage: React.FC = () => {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [showEncryptionAnimation, setShowEncryptionAnimation] = useState(false);

  const handleUploadSuccess = (token: string, key: string) => {
    // Show encryption animation
    setShowEncryptionAnimation(true);
    setTimeout(() => {
      setShowEncryptionAnimation(false);
      // Create download URL with token and key
      // Use window.location.origin to get the base URL of the site
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/download/${token}?key=${key}`;
      console.log('Generated URL:', url);
      setDownloadUrl(url);
      setUploadSuccess(true);
    }, 2000);
  };

  const handleReset = () => {
    setUploadSuccess(false);
    setDownloadUrl('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
      <Header />

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Secure, <span className="text-teal-400">Anonymous</span> File Sharing
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              End-to-end encrypted file sharing with self-destructing links.
              No registration, no tracking, no data retention.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            {uploadSuccess ? (
              <SuccessMessage
                url={downloadUrl}
                onReset={handleReset}
              />
            ) : (
              <UploadForm onUploadSuccess={handleUploadSuccess} />
            )}
          </div>
        </div>

        <InfoSection />
      </main>

      <Footer />

      <EncryptionAnimation isActive={showEncryptionAnimation} type="encrypt" />
    </div>
  );
};

export default HomePage;