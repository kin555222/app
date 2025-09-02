import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  color = 'blue',
  trend = null,
  size = 'medium',
  onClick = null,
  className = ''
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600',
      accent: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600',
      accent: 'text-green-600'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
      accent: 'text-red-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-600',
      accent: 'text-yellow-600'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-800',
      icon: 'text-purple-600',
      accent: 'text-purple-600'
    }
  };

  const sizeClasses = {
    small: {
      container: 'p-4',
      icon: 'text-2xl',
      value: 'text-xl',
      title: 'text-sm',
      description: 'text-xs'
    },
    medium: {
      container: 'p-6',
      icon: 'text-3xl',
      value: 'text-2xl',
      title: 'text-base',
      description: 'text-sm'
    },
    large: {
      container: 'p-8',
      icon: 'text-4xl',
      value: 'text-3xl',
      title: 'text-lg',
      description: 'text-base'
    }
  };

  const colors = colorClasses[color];
  const sizes = sizeClasses[size];

  const cardClasses = `
    ${colors.bg} ${colors.border} border-2 rounded-xl 
    ${sizes.container} 
    ${onClick ? 'cursor-pointer hover:shadow-lg card-hover' : ''} 
    transition-all duration-200 
    ${className}
  `.trim();

  const CardContent = () => (
    <>
      <div className="flex items-start justify-between mb-4">
        <div className={`${colors.icon} ${sizes.icon}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center text-xs font-medium ${
            trend.direction === 'up' ? 'text-green-600' : 
            trend.direction === 'down' ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {trend.direction === 'up' && '↗️'}
            {trend.direction === 'down' && '↘️'}
            {trend.direction === 'neutral' && '➡️'}
            <span className="ml-1">{trend.value}</span>
          </div>
        )}
      </div>
      
      <div className={`${sizes.value} font-bold ${colors.text} mb-2`}>
        {value}
      </div>
      
      <div className={`${sizes.title} font-semibold ${colors.text} mb-1`}>
        {title}
      </div>
      
      {description && (
        <div className={`${sizes.description} text-gray-600`}>
          {description}
        </div>
      )}
    </>
  );

  return onClick ? (
    <button 
      onClick={onClick}
      className={cardClasses}
      aria-label={`${title}: ${value}`}
    >
      <CardContent />
    </button>
  ) : (
    <div className={cardClasses}>
      <CardContent />
    </div>
  );
};

export default StatsCard;
