import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const QuickActionPanel = ({ 
  actions = [], 
  title = "Quick Actions",
  variant = 'default', // 'default', 'emergency', 'compact'
  className = ''
}) => {
  const [pressedAction, setPressedAction] = useState(null);

  const handleActionPress = (actionId, action) => {
    setPressedAction(actionId);
    setTimeout(() => setPressedAction(null), 200);
    
    if (action.onClick) {
      action.onClick();
    }
  };

  const getActionColorClass = (action) => {
    const colorMap = {
      primary: 'bg-blue-500 hover:bg-blue-600 text-white',
      emergency: 'bg-red-500 hover:bg-red-600 text-white animate-heartbeat',
      success: 'bg-green-500 hover:bg-green-600 text-white',
      warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300',
      outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
    };
    return colorMap[action.variant] || colorMap.primary;
  };

  const ActionButton = ({ action, index }) => {
    const isPressed = pressedAction === action.id;
    
    const buttonClasses = `
      ${getActionColorClass(action)}
      rounded-xl px-6 py-4 font-semibold transition-all duration-200
      transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2
      ${action.variant === 'emergency' ? 'focus:ring-red-300' : 'focus:ring-blue-300'}
      ${isPressed ? 'scale-95' : ''}
      ${action.disabled ? 'opacity-50 cursor-not-allowed transform-none' : 'cursor-pointer'}
      animate-fade-in
    `.trim();

    const ActionContent = () => (
      <div className="flex items-center justify-center space-x-3">
        {action.icon && (
          <span className={`text-xl ${
            action.variant === 'emergency' ? 'animate-wiggle' : ''
          }`}>
            {action.icon}
          </span>
        )}
        <div className="text-center">
          <div className="font-semibold">{action.label}</div>
          {action.subtitle && (
            <div className="text-xs opacity-75 mt-1">{action.subtitle}</div>
          )}
        </div>
        {action.badge && (
          <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">
            {action.badge}
          </span>
        )}
      </div>
    );

    if (action.href) {
      return (
        <a
          href={action.href}
          className={buttonClasses}
          style={{ animationDelay: `${index * 0.1}s` }}
          target={action.external ? '_blank' : undefined}
          rel={action.external ? 'noopener noreferrer' : undefined}
          aria-label={action.ariaLabel || action.label}
        >
          <ActionContent />
        </a>
      );
    }

    if (action.to) {
      return (
        <Link
          to={action.to}
          className={buttonClasses}
          style={{ animationDelay: `${index * 0.1}s` }}
          aria-label={action.ariaLabel || action.label}
        >
          <ActionContent />
        </Link>
      );
    }

    return (
      <button
        onClick={() => handleActionPress(action.id, action)}
        className={buttonClasses}
        style={{ animationDelay: `${index * 0.1}s` }}
        disabled={action.disabled}
        aria-label={action.ariaLabel || action.label}
      >
        <ActionContent />
      </button>
    );
  };

  const CompactVariant = () => (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <ActionButton key={action.id || index} action={action} index={index} />
        ))}
      </div>
    </div>
  );

  const DefaultVariant = () => (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {title && (
        <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <ActionButton key={action.id || index} action={action} index={index} />
        ))}
      </div>
    </div>
  );

  const EmergencyVariant = () => (
    <div className={`bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-2xl animate-heartbeat">🚨</span>
        <h2 className="text-xl font-bold text-red-800">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <ActionButton key={action.id || index} action={action} index={index} />
        ))}
      </div>
      <div className="mt-4 p-3 bg-red-200 bg-opacity-50 rounded-lg">
        <p className="text-xs text-red-700 text-center">
          ⚠️ For immediate life-threatening emergencies, call 112 directly
        </p>
      </div>
    </div>
  );

  switch (variant) {
    case 'compact':
      return <CompactVariant />;
    case 'emergency':
      return <EmergencyVariant />;
    default:
      return <DefaultVariant />;
  }
};

// Pre-configured emergency actions
export const EMERGENCY_ACTIONS = [
  {
    id: 'call-112',
    label: 'Call 112',
    subtitle: 'National Emergency',
    icon: '📞',
    variant: 'emergency',
    href: 'tel:112',
    ariaLabel: 'Call 112 for emergency services'
  },
  {
    id: 'call-101',
    label: 'Fire Dept',
    subtitle: '101',
    icon: '🔥',
    variant: 'emergency',
    href: 'tel:101',
    ariaLabel: 'Call 101 for fire department'
  },
  {
    id: 'call-102',
    label: 'Ambulance',
    subtitle: '102',
    icon: '🚑',
    variant: 'emergency',
    href: 'tel:102',
    ariaLabel: 'Call 102 for ambulance services'
  },
  {
    id: 'emergency-guide',
    label: 'Emergency Guide',
    subtitle: 'Quick Reference',
    icon: '📋',
    variant: 'warning',
    to: '/emergency',
    ariaLabel: 'View emergency action guide'
  }
];

// Pre-configured main actions
export const MAIN_ACTIONS = [
  {
    id: 'resources',
    label: 'Browse Resources',
    subtitle: 'Learn & Prepare',
    icon: '📚',
    variant: 'primary',
    to: '/resources',
    ariaLabel: 'Browse emergency preparedness resources'
  },
  {
    id: 'quiz',
    label: 'Take Quiz',
    subtitle: 'Test Knowledge',
    icon: '🧠',
    variant: 'success',
    to: '/resources',
    ariaLabel: 'Take preparedness quiz'
  },
  {
    id: 'profile',
    label: 'View Progress',
    subtitle: 'Track Learning',
    icon: '📊',
    variant: 'secondary',
    to: '/profile',
    ariaLabel: 'View learning progress'
  },
  {
    id: 'emergency',
    label: 'Emergency Tools',
    subtitle: 'Quick Access',
    icon: '🚨',
    variant: 'warning',
    to: '/emergency',
    ariaLabel: 'Access emergency tools and contacts'
  }
];

export default QuickActionPanel;
