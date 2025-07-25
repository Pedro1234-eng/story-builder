
import React from 'react';

export const Spinner: React.FC<{ text?: string; small?: boolean }> = ({ text, small = false }) => {
  const sizeClasses = small ? 'w-5 h-5 border-2' : 'w-12 h-12 border-4';
  const textClass = small ? 'text-sm' : 'text-lg';

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-cyan-300" role="status">
      <div 
        className={`${sizeClasses} border-solid border-gray-600 border-t-cyan-400 rounded-full animate-spin`}
      ></div>
      {text && <span className={`${textClass} font-medium`}>{text}</span>}
      <span className="sr-only">Loading...</span>
    </div>
  );
};
