import React from 'react';
import { ShieldCheckIcon, EyeOffIcon, ClockIcon } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-6 px-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <ShieldCheckIcon className="h-5 w-5 text-teal-400" />
            <span className="text-sm">End-to-End Encryption</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <EyeOffIcon className="h-5 w-5 text-teal-400" />
            <span className="text-sm">Zero Knowledge Privacy</span>
          </div>
          
          <div className="flex items-center justify-center md:justify-end space-x-2">
            <ClockIcon className="h-5 w-5 text-teal-400" />
            <span className="text-sm">Self-Destructing Files</span>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CryptDrift. All rights reserved.</p>
          <p className="mt-1">Files are automatically deleted after expiration.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;