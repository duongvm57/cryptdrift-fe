import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DownloadForm from '../components/DownloadForm';
import EncryptionAnimation from '../components/EncryptionAnimation';

interface DownloadPageProps {
  token?: string;
}

const DownloadPage: React.FC<DownloadPageProps> = ({ token }) => {
  const [showDecryptionAnimation, setShowDecryptionAnimation] = useState(false);
  const [parsedToken, setParsedToken] = useState<string | undefined>(token);

  useEffect(() => {
    // Process token from URL
    if (!token) {
      // Get token from URL path
      const pathParts = window.location.pathname.split('/');
      const urlToken = pathParts[pathParts.length - 1];

      if (urlToken && urlToken !== 'download') {
        // Ensure token is not 'download'
        setParsedToken(urlToken);
        console.log('Parsed token from URL:', urlToken);
      }
    }
  }, [token]);

  // This would be triggered by the DownloadForm component in a real implementation
  const handleDownloadStart = () => {
    setShowDecryptionAnimation(true);
    setTimeout(() => {
      setShowDecryptionAnimation(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
      <Header />

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Secure File <span className="text-teal-400">Download</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Enter your decryption key to access and download your file.
              Remember, files are automatically deleted after the expiration time or download limit.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <DownloadForm token={parsedToken} />
          </div>
        </div>
      </main>

      <Footer />

      <EncryptionAnimation isActive={showDecryptionAnimation} type="decrypt" />
    </div>
  );
};

export default DownloadPage;