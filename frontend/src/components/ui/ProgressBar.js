import React from 'react';

const ProgressBar = ({ 
  progress, 
  max = 100, 
  label = '', 
  showPercentage = true, 
  color = 'blue',
  size = 'medium',
  animated = false,
  className = ''
}) => {
  const percentage = Math.min(Math.max((progress / max) * 100, 0), 100);
  
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      track: 'bg-blue-100'
    },
    green: {
      bg: 'bg-green-500',
      track: 'bg-green-100'
    },
    red: {
      bg: 'bg-red-500',
      track: 'bg-red-100'
    },
    yellow: {
      bg: 'bg-yellow-500',
      track: 'bg-yellow-100'
    },
    purple: {
      bg: 'bg-purple-500',
      track: 'bg-purple-100'
    }
  };

  const sizeClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  };

  const colors = colorClasses[color];
  const height = sizeClasses[size];

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-600">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full ${colors.track} rounded-full overflow-hidden ${height}`}>
        <div
          className={`${colors.bg} ${height} rounded-full transition-all duration-500 ease-out ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || `Progress: ${Math.round(percentage)}%`}
        >
          {/* Shine effect for animated progress */}
          {animated && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-slide-right"></div>
          )}
        </div>
      </div>
      
      {progress > 0 && progress < max && (
        <div className="mt-1 text-xs text-gray-500">
          {progress} of {max} completed
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
