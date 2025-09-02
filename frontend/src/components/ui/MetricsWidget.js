import React, { useState, useEffect } from 'react';

const MetricsWidget = ({ 
  metrics, 
  title = "Dashboard Metrics",
  layout = 'grid', // 'grid' or 'list'
  animated = true,
  className = ''
}) => {
  const [animatedValues, setAnimatedValues] = useState({});

  // Animate number counting
  useEffect(() => {
    if (!animated) return;

    const animateNumbers = () => {
      metrics.forEach((metric, index) => {
        if (typeof metric.value === 'number') {
          let startValue = 0;
          const endValue = metric.value;
          const duration = 1000; // 1 second
          const stepTime = Math.abs(Math.floor(duration / endValue));
          
          const timer = setInterval(() => {
            startValue += Math.ceil(endValue / 50);
            if (startValue >= endValue) {
              startValue = endValue;
              clearInterval(timer);
            }
            setAnimatedValues(prev => ({
              ...prev,
              [index]: startValue
            }));
          }, stepTime);
        }
      });
    };

    const timeout = setTimeout(animateNumbers, 200);
    return () => clearTimeout(timeout);
  }, [metrics, animated]);

  const getValueDisplay = (metric, index) => {
    if (animated && typeof metric.value === 'number') {
      return animatedValues[index] || 0;
    }
    return metric.value;
  };

  const getTrendIcon = (trend) => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <span className="text-green-500">↗️</span>;
      case 'down':
        return <span className="text-red-500">↘️</span>;
      case 'neutral':
        return <span className="text-gray-500">➡️</span>;
      default:
        return null;
    }
  };

  const getMetricColorClass = (metric) => {
    const colorMap = {
      primary: 'text-blue-600',
      success: 'text-green-600',
      warning: 'text-yellow-600',
      emergency: 'text-red-600',
      info: 'text-cyan-600',
      purple: 'text-purple-600'
    };
    return colorMap[metric.color] || 'text-gray-600';
  };

  const GridLayout = () => (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 p-6 hover-lift animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {metric.icon && (
                <span className="text-2xl">{metric.icon}</span>
              )}
              <span className="text-sm font-medium text-gray-600">
                {metric.label}
              </span>
            </div>
            {metric.trend && (
              <div className="flex items-center space-x-1 text-xs">
                {getTrendIcon(metric.trend)}
                <span className={
                  metric.trend.direction === 'up' ? 'text-green-600' :
                  metric.trend.direction === 'down' ? 'text-red-600' :
                  'text-gray-600'
                }>
                  {metric.trend.value}
                </span>
              </div>
            )}
          </div>
          
          <div className={`text-3xl font-bold ${getMetricColorClass(metric)} mb-2`}>
            {getValueDisplay(metric, index)}
            {metric.unit && (
              <span className="text-lg text-gray-500 ml-1">{metric.unit}</span>
            )}
          </div>
          
          {metric.description && (
            <p className="text-xs text-gray-500">{metric.description}</p>
          )}
          
          {metric.progress && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{metric.progress.current}/{metric.progress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                    metric.color === 'success' ? 'bg-green-500' :
                    metric.color === 'warning' ? 'bg-yellow-500' :
                    metric.color === 'emergency' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}
                  style={{ 
                    width: `${(metric.progress.current / metric.progress.total) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const ListLayout = () => (
    <div className={`space-y-4 ${className}`}>
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover-lift animate-slide-left"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center space-x-4">
            {metric.icon && (
              <div className="text-2xl">{metric.icon}</div>
            )}
            <div>
              <h4 className="font-semibold text-gray-900">{metric.label}</h4>
              {metric.description && (
                <p className="text-sm text-gray-600">{metric.description}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getMetricColorClass(metric)}`}>
              {getValueDisplay(metric, index)}
              {metric.unit && (
                <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
              )}
            </div>
            {metric.trend && (
              <div className="flex items-center justify-end space-x-1 text-xs mt-1">
                {getTrendIcon(metric.trend)}
                <span className={
                  metric.trend.direction === 'up' ? 'text-green-600' :
                  metric.trend.direction === 'down' ? 'text-red-600' :
                  'text-gray-600'
                }>
                  {metric.trend.value}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mb-6">
      {title && (
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      )}
      {layout === 'grid' ? <GridLayout /> : <ListLayout />}
    </div>
  );
};

export default MetricsWidget;
