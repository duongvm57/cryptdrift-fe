import React from 'react';

interface EncryptionAnimationProps {
  isActive: boolean;
  type: 'encrypt' | 'decrypt';
}

const EncryptionAnimation: React.FC<EncryptionAnimationProps> = ({ isActive, type }) => {
  if (!isActive) return null;
  
  const gridSize = 10;
  const cells = Array.from({ length: gridSize * gridSize });
  
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="grid grid-cols-10 gap-1 mb-6 w-64 mx-auto">
          {cells.map((_, index) => {
            const delay = (index % gridSize) * 0.05 + Math.floor(index / gridSize) * 0.05;
            return (
              <div 
                key={index}
                className={`
                  w-5 h-5 rounded-sm
                  ${type === 'encrypt' ? 'bg-teal-500' : 'bg-emerald-500'}
                  animate-pulse
                `}
                style={{ 
                  animationDelay: `${delay}s`,
                  opacity: Math.random() > 0.5 ? 0.8 : 0.4
                }}
              />
            );
          })}
        </div>
        <p className="text-white text-xl font-medium">
          {type === 'encrypt' ? 'Encrypting Your File...' : 'Decrypting Your File...'}
        </p>
        <p className="text-slate-300 mt-2">
          {type === 'encrypt' 
            ? 'Your file is being encrypted in your browser.' 
            : 'Your file is being decrypted in your browser.'}
        </p>
      </div>
    </div>
  );
};

export default EncryptionAnimation;