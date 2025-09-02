import React, { useState, useEffect } from 'react';

const ActivityFeed = ({ 
  activities = [], 
  title = "Recent Activity",
  maxItems = 5,
  showTimestamp = true,
  variant = 'default', // 'default', 'compact', 'detailed'
  emptyMessage = "No recent activity",
  className = ''
}) => {
  const [displayedActivities, setDisplayedActivities] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const sortedActivities = [...activities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, isExpanded ? activities.length : maxItems);
    
    setDisplayedActivities(sortedActivities);
  }, [activities, maxItems, isExpanded]);

  const getActivityIcon = (type) => {
    const iconMap = {
      achievement: '🏆',
      quiz_completed: '✅',
      resource_viewed: '👁️',
      badge_earned: '🥇',
      profile_updated: '👤',
      emergency_drill: '🚨',
      community_joined: '🤝',
      alert_received: '📢',
      skill_learned: '🧠',
      goal_reached: '🎯',
      default: '📝'
    };
    return iconMap[type] || iconMap.default;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      achievement: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      quiz_completed: 'text-green-600 bg-green-50 border-green-200',
      resource_viewed: 'text-blue-600 bg-blue-50 border-blue-200',
      badge_earned: 'text-purple-600 bg-purple-50 border-purple-200',
      profile_updated: 'text-gray-600 bg-gray-50 border-gray-200',
      emergency_drill: 'text-red-600 bg-red-50 border-red-200',
      community_joined: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      alert_received: 'text-orange-600 bg-orange-50 border-orange-200',
      skill_learned: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      goal_reached: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      default: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colorMap[type] || colorMap.default;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  };

  const ActivityItem = ({ activity, index }) => {
    const colorClasses = getActivityColor(activity.type);
    
    return (
      <div 
        className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200 animate-slide-left"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Icon */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-full border-2 
          flex items-center justify-center text-lg
          ${colorClasses}
        `}>
          {getActivityIcon(activity.type)}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 leading-5">
                {activity.title}
              </p>
              {activity.description && (
                <p className="text-xs text-gray-600 mt-1 leading-4">
                  {activity.description}
                </p>
              )}
              {activity.metadata && (
                <div className="flex items-center space-x-3 mt-2">
                  {activity.metadata.score && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      Score: {activity.metadata.score}%
                    </span>
                  )}
                  {activity.metadata.points && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      +{activity.metadata.points} points
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {showTimestamp && (
              <div className="flex-shrink-0 ml-2">
                <time className="text-xs text-gray-500">
                  {formatTimestamp(activity.timestamp)}
                </time>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CompactVariant = () => (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      )}
      <div className="space-y-2">
        {displayedActivities.length > 0 ? (
          displayedActivities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
              <span className="text-lg">{getActivityIcon(activity.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{activity.title}</p>
                {showTimestamp && (
                  <p className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm">{emptyMessage}</p>
          </div>
        )}
      </div>
      {activities.length > maxItems && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {isExpanded ? 'Show Less' : `Show ${activities.length - maxItems} More`}
        </button>
      )}
    </div>
  );

  const DefaultVariant = () => (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {title && (
        <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
      )}
      <div className="space-y-1">
        {displayedActivities.length > 0 ? (
          displayedActivities.map((activity, index) => (
            <ActivityItem key={index} activity={activity} index={index} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">📭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Yet</h3>
            <p className="text-gray-600 mb-4">{emptyMessage}</p>
            <button className="btn-primary">
              Get Started
            </button>
          </div>
        )}
      </div>
      {activities.length > maxItems && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full btn-ghost"
          >
            {isExpanded ? 'Show Less' : `Show ${activities.length - maxItems} More Activities`}
          </button>
        </div>
      )}
    </div>
  );

  switch (variant) {
    case 'compact':
      return <CompactVariant />;
    default:
      return <DefaultVariant />;
  }
};

// Sample activity data generator for testing
export const generateSampleActivities = () => [
  {
    type: 'quiz_completed',
    title: 'Completed Earthquake Preparedness Quiz',
    description: 'Successfully passed with 85% score',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    metadata: { score: 85, points: 50 }
  },
  {
    type: 'badge_earned',
    title: 'Earned "Safety Aware" Badge',
    description: 'Completed 3 emergency preparedness resources',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    metadata: { points: 100 }
  },
  {
    type: 'resource_viewed',
    title: 'Viewed Flood Safety Guide',
    description: 'Read comprehensive flood preparedness information',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
  },
  {
    type: 'alert_received',
    title: 'Weather Alert Received',
    description: 'Heavy rainfall warning for your area',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    type: 'profile_updated',
    title: 'Profile Updated',
    description: 'Added emergency contact information',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  }
];

export default ActivityFeed;
