import React from 'react';

const Loading = ({ message = "Loading...", subMessage = null, size = 'large' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className={`loading-spinner ${sizeClasses[size]} mb-4`}></div>
      <div className="text-lg font-medium text-gray-700 mb-2">{message}</div>
      {subMessage && (
        <div className="text-sm text-gray-500 text-center max-w-md">
          {subMessage}
        </div>
      )}
    </div>
  );
};

export default Loading;
