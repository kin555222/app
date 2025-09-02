import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'medium',
  icon = null,
  removable = false,
  onRemove = null,
  className = ''
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    primary: 'bg-blue-100 text-blue-800 border-blue-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    achievement: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300',
    emergency: 'bg-red-600 text-white border-red-700 animate-pulse-slow'
  };

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };

  const baseClasses = 'inline-flex items-center font-medium rounded-full border transition-all duration-200';
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];

  return (
    <span className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}>
      {icon && (
        <span className="mr-1">
          {icon}
        </span>
      )}
      {children}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-2 hover:bg-black hover:bg-opacity-20 rounded-full p-0.5 transition-colors"
          aria-label="Remove badge"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  );
};

// Achievement Badge Component
export const AchievementBadge = ({ title, description, icon, earned = false, progress = null }) => {
  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${
      earned 
        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md' 
        : 'bg-gray-50 border-gray-200 opacity-60'
    }`}>
      <div className="flex items-center space-x-3 mb-2">
        <div className={`text-2xl ${earned ? '' : 'grayscale'}`}>
          {icon}
        </div>
        <div>
          <h3 className={`font-semibold ${earned ? 'text-yellow-800' : 'text-gray-600'}`}>
            {title}
          </h3>
          {earned && (
            <Badge variant="achievement" size="small">
              Earned!
            </Badge>
          )}
        </div>
      </div>
      
      <p className={`text-sm ${earned ? 'text-yellow-700' : 'text-gray-500'}`}>
        {description}
      </p>
      
      {!earned && progress && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress.current}/{progress.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Badge;
