import React from 'react';
import { ShieldIcon, ClockIcon, KeyIcon, EyeOffIcon } from 'lucide-react';

const InfoSection: React.FC = () => {
  return (
    <div className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Secure File Sharing Made <span className="text-teal-400">Simple</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 p-5 rounded-lg shadow-md transform transition hover:scale-105 duration-300">
            <div className="bg-slate-700 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <ShieldIcon className="h-6 w-6 text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">End-to-End Encryption</h3>
            <p className="text-slate-300 text-sm">Files are encrypted in your browser before upload. We never see your unencrypted data.</p>
          </div>
          
          <div className="bg-slate-800 p-5 rounded-lg shadow-md transform transition hover:scale-105 duration-300">
            <div className="bg-slate-700 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <ClockIcon className="h-6 w-6 text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Self-Destructing Files</h3>
            <p className="text-slate-300 text-sm">Files automatically delete after expiration time or download limit is reached.</p>
          </div>
          
          <div className="bg-slate-800 p-5 rounded-lg shadow-md transform transition hover:scale-105 duration-300">
            <div className="bg-slate-700 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <KeyIcon className="h-6 w-6 text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Secure Key Management</h3>
            <p className="text-slate-300 text-sm">Your encryption keys are never stored on our servers. Only you control who can access your files.</p>
          </div>
          
          <div className="bg-slate-800 p-5 rounded-lg shadow-md transform transition hover:scale-105 duration-300">
            <div className="bg-slate-700 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <EyeOffIcon className="h-6 w-6 text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Anonymous Sharing</h3>
            <p className="text-slate-300 text-sm">No account required. We don't track or store personal information about our users.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;