import React from 'react';

export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2 text-gray-400 animate-pulse">
      <div className="w-2 h-2 bg-current rounded-full" />
      <div className="w-2 h-2 bg-current rounded-full animation-delay-200" />
      <div className="w-2 h-2 bg-current rounded-full animation-delay-400" />
    </div>
  );
};

export default TypingIndicator;
