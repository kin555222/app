import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserProfile = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await userAPI.getProfile(user.id);
      setUserProfile(response);
      setError('');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const getBadgeColor = (badge) => {
    const colorMap = {
      'First Steps': 'bg-blue-100 text-blue-800 border-blue-200',
      'Safety Aware': 'bg-green-100 text-green-800 border-green-200',
      'Emergency Expert': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colorMap[badge] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getBadgeIcon = (badge) => {
    const iconMap = {
      'First Steps': '🌱',
      'Safety Aware': '🛡️',
      'Emergency Expert': '🏆'
    };
    return iconMap[badge] || '🏅';
  };

  const getProgressPercentage = (completed, total = 10) => {
    return Math.round((completed / total) * 100);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{userProfile?.user?.username}</h1>
              <p className="text-gray-600">{userProfile?.user?.email}</p>
              <p className="text-sm text-gray-500">
                Member since {new Date(userProfile?.user?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {userProfile?.completed_resources || 0}
            </div>
            <div className="text-gray-600">Resources Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {userProfile?.badges?.length || 0}
            </div>
            <div className="text-gray-600">Badges Earned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {getProgressPercentage(userProfile?.completed_resources || 0)}%
            </div>
            <div className="text-gray-600">Preparedness Level</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Badges Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 Achievement Badges</h2>
          
          {userProfile?.badges && userProfile.badges.length > 0 ? (
            <div className="space-y-4">
              {userProfile.badges.map((badge, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-lg border ${getBadgeColor(badge)}`}
                >
                  <div className="text-3xl">{getBadgeIcon(badge)}</div>
                  <div>
                    <h3 className="font-semibold">{badge}</h3>
                    <p className="text-sm opacity-75">
                      {badge === 'First Steps' && 'Completed your first emergency preparedness resource'}
                      {badge === 'Safety Aware' && 'Completed 3 emergency preparedness resources'}
                      {badge === 'Emergency Expert' && 'Completed 5+ emergency preparedness resources'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No badges earned yet</h3>
              <p className="text-gray-600 mb-4">
                Complete quiz assessments to earn your first badge!
              </p>
              <Link
                to="/resources"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Browse Resources
              </Link>
            </div>
          )}

          {/* Next Badge Progress */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Next Badge Progress</h4>
            <div className="space-y-3">
              {!userProfile?.badges?.includes('First Steps') && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>🌱 First Steps</span>
                    <span>{userProfile?.completed_resources}/1</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (userProfile?.completed_resources || 0) * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
              {!userProfile?.badges?.includes('Safety Aware') && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>🛡️ Safety Aware</span>
                    <span>{userProfile?.completed_resources}/3</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, ((userProfile?.completed_resources || 0) / 3) * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
              {!userProfile?.badges?.includes('Emergency Expert') && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>🏆 Emergency Expert</span>
                    <span>{userProfile?.completed_resources}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, ((userProfile?.completed_resources || 0) / 5) * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress History */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Quiz Results</h2>
          
          {userProfile?.progress && userProfile.progress.length > 0 ? (
            <div className="space-y-4">
              {userProfile.progress.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Resource #{item.resource_id}</h3>
                    <div className={`text-lg font-bold ${getScoreColor(item.quiz_score)}`}>
                      {Math.round(item.quiz_score)}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      Status: {item.quiz_score >= 70 ? 
                        <span className="text-green-600 font-medium">✅ Passed</span> : 
                        <span className="text-red-600 font-medium">❌ Failed</span>
                      }
                    </span>
                    <span>
                      Completed {new Date(item.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quiz attempts yet</h3>
              <p className="text-gray-600 mb-4">
                Take your first quiz to start tracking your progress!
              </p>
              <Link
                to="/resources"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
              >
                Start Learning
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
          🚀 Continue Your Emergency Preparedness Journey
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/resources"
            className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-gray-900 mb-2">Browse Resources</h3>
            <p className="text-sm text-gray-600">Explore emergency preparedness guides</p>
          </Link>
          <Link
            to="/emergency"
            className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">🚨</div>
            <h3 className="font-semibold text-gray-900 mb-2">Emergency Dashboard</h3>
            <p className="text-sm text-gray-600">Quick access to emergency tools</p>
          </Link>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-900 mb-2">Mobile App</h3>
            <p className="text-sm text-gray-600">Download our Android mesh network app</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
