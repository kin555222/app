import React, { useState } from 'react';

const DashboardCard = ({ 
  title, 
  description,
  icon, 
  children,
  actionButton = null,
  variant = 'default',
  size = 'medium',
  interactive = false,
  loading = false,
  className = '',
  onClick = null,
  headerAction = null,
  footer = null
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const variantClasses = {
    default: 'bg-white border-gray-200',
    primary: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
    success: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
    warning: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
    emergency: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
    gradient: 'bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 border-blue-200'
  };

  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const baseClasses = `
    ${variantClasses[variant]} 
    ${sizeClasses[size]}
    border-2 rounded-2xl shadow-lg 
    transition-all duration-300 ease-in-out
    ${interactive || onClick ? 'cursor-pointer hover-lift' : ''}
    ${loading ? 'animate-pulse' : ''}
    ${className}
  `.trim();

  const CardContent = () => (
    <>
      {/* Header */}
      {(title || icon || headerAction) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className={`text-2xl transition-transform duration-200 ${
                isHovered && interactive ? 'animate-bounce-subtle' : ''
              }`}>
                {icon}
              </div>
            )}
            {title && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {title}
                </h3>
                {description && (
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            )}
          </div>
          {headerAction && (
            <div className="flex-shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {children && (
        <div className="mb-4">
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          ) : (
            children
          )}
        </div>
      )}

      {/* Action Button */}
      {actionButton && !loading && (
        <div className="mt-4">
          {actionButton}
        </div>
      )}

      {/* Footer */}
      {footer && !loading && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </>
  );

  const cardProps = {
    className: baseClasses,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    ...(onClick && { 
      onClick,
      role: 'button',
      tabIndex: 0,
      onKeyDown: (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }
    })
  };

  return (
    <div {...cardProps}>
      <CardContent />
    </div>
  );
};

export default DashboardCard;
