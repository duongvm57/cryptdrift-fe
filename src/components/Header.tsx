import React from 'react';
import { LockIcon, ShieldIcon } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4 px-6 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <LockIcon className="h-8 w-8 text-teal-400" />
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-teal-400">Crypt</span>Drift
          </h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center text-sm text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-full">
            <ShieldIcon className="h-4 w-4 mr-2 text-teal-400" />
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;