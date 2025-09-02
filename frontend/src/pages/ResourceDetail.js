import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { resourcesAPI } from '../services/api';

const ResourceDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [resource, setResource] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchResourceDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await resourcesAPI.getById(id);
      setResource(response.resource);
      setQuizzes(response.quizzes || []);
      setError('');
    } catch (error) {
      console.error('Error fetching resource details:', error);
      setError('Failed to load resource details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchResourceDetail();
  }, [fetchResourceDetail]);

  const getCategoryIcon = (category) => {
    const iconMap = {
      'earthquake': '🌍',
      'fire': '🔥',
      'flood': '🌊',
      'hurricane': '🌪️',
      'tornado': '🌪️',
      'power_outage': '⚡',
      'medical': '🏥',
      'communication': '📻',
      'supplies': '🧳',
      'evacuation': '🚪',
      'general': '📋'
    };
    return iconMap[category?.toLowerCase()] || '📋';
  };

  const getContentTypeIcon = (contentType) => {
    const iconMap = {
      'article': '📖',
      'video': '🎥',
      'infographic': '🖼️',
      'checklist': '✅'
    };
    return iconMap[contentType] || '📖';
  };

  const handleStartQuiz = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/quiz/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Resource Not Found</h2>
          <p className="text-gray-600 mb-8">
            {error || 'The resource you are looking for could not be found.'}
          </p>
          <Link
            to="/resources"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link to="/resources" className="text-blue-600 hover:text-blue-700">
          ← Back to Resources
        </Link>
      </nav>

      {/* Resource Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{getCategoryIcon(resource.category)}</span>
            <div>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                {resource.category.replace('_', ' ')}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getContentTypeIcon(resource.content_type)}</span>
            <span className="text-sm text-gray-500">{resource.content_type}</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {resource.title}
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          {resource.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Created on {new Date(resource.created_at).toLocaleDateString()}
          </span>
          <span>
            {quizzes.length} quiz question{quizzes.length !== 1 ? 's' : ''} available
          </span>
        </div>
      </div>

      {/* Resource Content */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          📖 Resource Content
        </h2>
        
        {resource.content_url ? (
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              This resource includes external content. Click the link below to access the full material:
            </p>
            <a
              href={resource.content_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              <span className="mr-2">{getContentTypeIcon(resource.content_type)}</span>
              Open Resource
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="text-gray-600">
              Content for this resource is currently being prepared. Please check back later for detailed information about {resource.category.replace('_', ' ')} preparedness.
            </p>
          </div>
        )}

        {/* Sample Content Based on Category */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Key Points to Remember
          </h3>
          <div className="space-y-3">
            {resource.category === 'earthquake' && (
              <>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Drop, Cover, and Hold On during shaking</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Stay away from windows, mirrors, and heavy objects</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Have an emergency kit ready with supplies for 72 hours</span>
                </div>
              </>
            )}
            {resource.category === 'fire' && (
              <>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Plan and practice escape routes from your home</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Install smoke detectors and check batteries regularly</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Keep fire extinguishers accessible and learn how to use them</span>
                </div>
              </>
            )}
            <div className="flex items-start space-x-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Stay informed through official emergency alerts and communications</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Practice your emergency plan regularly with all family members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Section */}
      {quizzes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2">
                🧠 Test Your Knowledge
              </h2>
              <p className="text-blue-700">
                Complete the quiz to reinforce your learning and earn progress toward your emergency preparedness badges.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-lg p-6">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Quiz Available: {quizzes.length} Questions
              </h3>
              <p className="text-gray-600 text-sm">
                Test your understanding of this emergency preparedness topic
              </p>
            </div>
            <button
              onClick={handleStartQuiz}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              {isAuthenticated ? 'Start Quiz' : 'Login to Take Quiz'}
            </button>
          </div>

          {!isAuthenticated && (
            <div className="mt-4 text-center text-sm text-blue-600">
              <Link to="/signup" className="hover:underline">
                Create a free account
              </Link>
              {' '}to track your progress and earn badges
            </div>
          )}
        </div>
      )}

      {/* Related Resources */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          📋 Continue Learning
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/resources"
            className="bg-white text-gray-800 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors text-center border"
          >
            Browse All Resources
          </Link>
          <Link
            to="/emergency"
            className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors text-center"
          >
            Emergency Dashboard
          </Link>
          {isAuthenticated && (
            <Link
              to="/profile"
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors text-center"
            >
              View Your Progress
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
