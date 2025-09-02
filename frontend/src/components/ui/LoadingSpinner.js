import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'blue', 
  message = '', 
  fullScreen = false,
  overlay = false,
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    red: 'border-red-600',
    green: 'border-green-600',
    yellow: 'border-yellow-600',
    purple: 'border-purple-600',
    white: 'border-white'
  };

  const spinnerClasses = `
    ${sizeClasses[size]} 
    border-4 border-gray-200 border-t-4 ${colorClasses[color]} 
    rounded-full animate-spin
  `.trim();

  const Spinner = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={spinnerClasses} />
      {message && (
        <div className={`text-center ${fullScreen ? 'text-lg text-gray-600' : 'text-sm text-gray-500'}`}>
          {message}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 bg-white flex items-center justify-center z-50 ${className}`}>
        <Spinner />
      </div>
    );
  }

  if (overlay) {
    return (
      <div className={`absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 ${className}`}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center p-4 ${className}`}>
      <Spinner />
    </div>
  );
};

// Skeleton Loading Component
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  showAvatar = false,
  showImage = false 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {showImage && (
        <div className="bg-gray-200 rounded-lg h-48 w-full mb-4"></div>
      )}
      
      <div className="space-y-3">
        {showAvatar && (
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gray-200 rounded-full h-10 w-10"></div>
            <div className="space-y-2 flex-1">
              <div className="bg-gray-200 rounded h-4 w-1/3"></div>
              <div className="bg-gray-200 rounded h-3 w-1/4"></div>
            </div>
          </div>
        )}
        
        {Array.from({ length: lines }).map((_, index) => (
          <div 
            key={index}
            className={`bg-gray-200 rounded h-4 ${
              index === lines - 1 ? 'w-2/3' : 'w-full'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Dots Loading Animation
export const DotsLoader = ({ color = 'blue', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    red: 'bg-red-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600'
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );
};

// Progress Loading Bar
export const ProgressLoader = ({ progress = 0, message = '' }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Loading...</span>
        <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      
      {message && (
        <div className="text-center text-sm text-gray-500 mt-2">
          {message}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
