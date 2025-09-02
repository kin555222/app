import React, { useState } from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon = null,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  loadingText = 'Loading...',
  ariaLabel,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = `
    inline-flex items-center justify-center font-semibold rounded-lg
    transition-all duration-200 transform
    focus:outline-none focus:ring-4 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? 'w-full' : ''}
    ${isPressed ? 'scale-95' : 'hover:scale-105'}
    ${className}
  `.trim();

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-blue-300
    `,
    secondary: `
      bg-gray-100 hover:bg-gray-200 text-gray-800 
      border border-gray-300 hover:border-gray-400
      focus:ring-gray-300
    `,
    emergency: `
      bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
      text-white shadow-lg hover:shadow-xl animate-heartbeat
      focus:ring-red-300
    `,
    success: `
      bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-green-300
    `,
    warning: `
      bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-yellow-300
    `,
    outline: `
      border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white
      focus:ring-blue-300
    `,
    ghost: `
      text-gray-700 hover:bg-gray-100 hover:text-gray-900
      focus:ring-gray-300
    `,
    link: `
      text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline
      focus:ring-blue-300 focus:ring-offset-0
    `
  };

  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const iconSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
  `.trim();

  const LoadingSpinner = () => (
    <svg 
      className={`animate-spin ${iconSizeClasses[size]} mr-2`} 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const IconComponent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    
    if (icon) {
      return (
        <span className={`
          ${iconSizeClasses[size]}
          ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}
        `}>
          {icon}
        </span>
      );
    }
    
    return null;
  };

  const ButtonContent = () => (
    <>
      {(icon || loading) && iconPosition === 'left' && <IconComponent />}
      <span className={loading ? 'opacity-75' : ''}>
        {loading ? loadingText : children}
      </span>
      {icon && iconPosition === 'right' && !loading && <IconComponent />}
    </>
  );

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel}
      {...props}
    >
      <ButtonContent />
    </button>
  );
};

// Button group component for related actions
export const ButtonGroup = ({ 
  children, 
  orientation = 'horizontal', // 'horizontal' or 'vertical'
  size = 'medium',
  className = '' 
}) => {
  const orientationClasses = {
    horizontal: 'flex flex-wrap gap-2',
    vertical: 'flex flex-col space-y-2'
  };

  return (
    <div className={`${orientationClasses[orientation]} ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            size: child.props.size || size,
            key: index
          });
        }
        return child;
      })}
    </div>
  );
};

// Floating Action Button
export const FloatingActionButton = ({
  children,
  icon,
  onClick,
  variant = 'primary',
  position = 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  className = '',
  ariaLabel,
  ...props
}) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-20 right-6',
    'top-left': 'fixed top-20 left-6'
  };

  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-2xl',
    emergency: 'bg-red-500 hover:bg-red-600 text-white shadow-2xl animate-heartbeat',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-2xl'
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${positionClasses[position]}
        ${variantClasses[variant]}
        w-14 h-14 rounded-full flex items-center justify-center
        transform hover:scale-110 transition-all duration-200
        focus:outline-none focus:ring-4 focus:ring-offset-2
        z-50 animate-scale-in
        ${className}
      `.trim()}
      aria-label={ariaLabel}
      {...props}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
