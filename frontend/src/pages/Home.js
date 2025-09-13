import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StatsCard from '../components/ui/StatsCard';
import Badge from '../components/ui/Badge';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherAlert, setWeatherAlert] = useState(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock weather alert (in real app, this would come from API)
  useEffect(() => {
    // Simulate weather alert for demo
    const alerts = [
      { type: 'heat', message: 'Heat Wave Warning - Stay hydrated and avoid outdoor activities between 10 AM - 4 PM', level: 'warning' },
      { type: 'rain', message: 'Heavy Rainfall Expected - Avoid low-lying areas and waterlogged roads', level: 'info' },
      null // No alert
    ];
    setWeatherAlert(alerts[Math.floor(Math.random() * alerts.length)]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="text-center">
          {/* Weather Alert Banner */}
          {weatherAlert && (
            <div className={`mb-6 p-4 rounded-lg border ${
              weatherAlert.level === 'warning' 
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
                : 'bg-blue-50 border-blue-200 text-blue-800'
            } animate-slide-up`}>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">
                  {weatherAlert.type === 'heat' ? '🌡️' : '🌧️'}
                </span>
                <span className="font-medium text-sm">{weatherAlert.message}</span>
              </div>
            </div>
          )}

          <div className="mb-4">
            <Badge variant="primary" icon="🇮🇳" className="mb-4">
              Designed for India
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">🚨</span> 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vajra
            </span>
            <br />
            <span className="text-gray-700">for India</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Building resilient Indian communities through accessible technology. 
            <span className="font-semibold text-blue-600">Prepare, respond, and recover</span> 
             with our comprehensive emergency management system designed for Indian conditions.
          </p>
          
          {/* Current Time Display */}
          <div className="mb-8 text-sm text-gray-500">
            Current Time: {currentTime.toLocaleString('en-IN', { 
              timeZone: 'Asia/Kolkata',
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          
          {isAuthenticated ? (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 mb-12 max-w-3xl mx-auto shadow-lg animate-fade-in">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="text-3xl">👋</div>
                <h2 className="text-2xl font-bold text-green-800">
                  Welcome back, {user?.username}!
                </h2>
              </div>
              <p className="text-green-700 mb-6 text-lg">
                Continue your emergency preparedness journey and keep your community safe.
              </p>
              
              {/* Quick Stats */}
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <StatsCard
                  title="Courses Completed"
                  value="4"
                  icon="📚"
                  color="green"
                  size="small"
                />
                <StatsCard
                  title="Badges Earned"
                  value="7"
                  icon="🏆"
                  color="yellow"
                  size="small"
                />
                <StatsCard
                  title="Preparedness Score"
                  value="85%"
                  icon="📊"
                  color="blue"
                  size="small"
                  trend={{ direction: 'up', value: '+12%' }}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/profile"
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <span>📊</span>
                  <span>View Dashboard</span>
                </Link>
                <Link
                  to="/resources"
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <span>📚</span>
                  <span>Continue Learning</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="mb-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link
                  to="/signup"
                  className="btn-primary flex items-center justify-center space-x-2 text-lg px-10 py-4"
                >
                  <span>🚀</span>
                  <span>Get Started Free</span>
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary flex items-center justify-center space-x-2 text-lg px-10 py-4"
                >
                  <span>🔑</span>
                  <span>Sign In</span>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <span>✅</span>
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>🔒</span>
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📱</span>
                  <span>Works Offline</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>🇮🇳</span>
                  <span>Made for India</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 animate-fade-in">
          {/* Emergency Resources */}
          <Link
            to="/resources"
            className="card-interactive p-6 group"
          >
            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-200">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Emergency Resources</h3>
            <p className="text-gray-600 mb-4">
              Access comprehensive guides for different disaster scenarios, from earthquakes to power outages.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-blue-600 font-medium group-hover:text-blue-700">Explore Resources</div>
              <div className="transform group-hover:translate-x-2 transition-transform duration-200">→</div>
            </div>
          </Link>

          {/* Emergency Dashboard */}
          <Link
            to="/emergency"
            className="card-emergency p-6 group emergency-pulse"
          >
            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-200">🚨</div>
            <h3 className="text-xl font-bold text-red-800 mb-2 group-hover:text-red-900 transition-colors">Emergency Dashboard</h3>
            <p className="text-red-600 mb-4">
              Quick access to emergency contacts, evacuation routes, and critical information.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-red-700 font-medium group-hover:text-red-800">Emergency Access</div>
              <div className="transform group-hover:translate-x-2 transition-transform duration-200">→</div>
            </div>
          </Link>

          {/* Profile & Progress */}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="bg-green-50 border-green-200 rounded-xl shadow-md p-6 group card-hover"
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-200">👤</div>
              <h3 className="text-xl font-bold text-green-800 mb-2 group-hover:text-green-900 transition-colors">Your Profile</h3>
              <p className="text-green-600 mb-4">
                Track your preparedness progress, view completed quizzes, and earn badges.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-green-700 font-medium group-hover:text-green-800">View Profile</div>
                <div className="transform group-hover:translate-x-2 transition-transform duration-200">→</div>
              </div>
            </Link>
          ) : (
            <div className="bg-gray-50 rounded-xl shadow-md p-6 border border-gray-200 group">
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-200">👤</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Track Progress</h3>
              <p className="text-gray-600 mb-4">
                Create an account to track your learning progress and earn achievement badges.
              </p>
              <Link 
                to="/signup" 
                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                Sign Up
                <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
            </div>
          )}
        </div>

        {/* Key Features */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Vajra?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full p-3">
                <div className="text-2xl">🌐</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Comprehensive Web Platform
                </h3>
                <p className="text-gray-600">
                  Complete web-based disaster preparedness system accessible from any device, anywhere in India.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 rounded-full p-3">
                <div className="text-2xl">🤝</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Community-Driven
                </h3>
                <p className="text-gray-600">
                  Connect with neighbors, share resources, and coordinate emergency responses together.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-yellow-100 rounded-full p-3">
                <div className="text-2xl">⚡</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Progressive Web App
                </h3>
                <p className="text-gray-600">
                  Works offline and can be installed on any device, ensuring access to critical information anytime.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 rounded-full p-3">
                <div className="text-2xl">🎯</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Personalized Learning
                </h3>
                <p className="text-gray-600">
                  Interactive quizzes, progress tracking, and badges to make emergency preparedness engaging.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Numbers */}
        <div className="mt-16 bg-red-50 border border-red-200 rounded-xl p-8">
          <h3 className="text-xl font-bold text-red-800 mb-4 text-center">
            Important Emergency Numbers
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">112</div>
              <div className="text-red-700">National Emergency Number</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">101</div>
              <div className="text-red-700">Fire Department</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">102</div>
              <div className="text-red-700">Ambulance Services</div>
            </div>
          </div>
          <p className="text-sm text-red-600 mt-4 text-center">
            This app supplements, but does not replace, official emergency services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
