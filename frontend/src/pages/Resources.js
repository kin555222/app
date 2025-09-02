import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { resourcesAPI } from '../services/api';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const params = selectedCategory ? { category: selectedCategory } : {};
      const response = await resourcesAPI.getAll(params);
      setResources(response.resources || []);
      setError('');
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to load resources. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);


  // Filter resources based on search term
  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique categories
  const categories = [...new Set(resources.map(resource => resource.category))];

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
    return iconMap[category.toLowerCase()] || '📋';
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen animate-fade-in">
        <div className="loading-spinner mb-4"></div>
        <div className="text-lg text-gray-600 mb-2">Loading Emergency Resources</div>
        <div className="text-sm text-gray-500">Please wait while we fetch the latest safety information...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          📚 Emergency Resources
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Comprehensive guides and information to help you prepare for and respond to various emergency situations.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Resources
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by title, description, or category..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              id="category"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {getCategoryIcon(category)} {category.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Resources Found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory 
              ? 'Try adjusting your search or filter criteria.' 
              : 'No resources are currently available. Please check back later.'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Link
              key={resource.id}
              to={`/resources/${resource.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="p-6">
                {/* Header with icons */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getCategoryIcon(resource.category)}</span>
                    <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {resource.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">{getContentTypeIcon(resource.content_type)}</span>
                    {resource.quiz_count > 0 && (
                      <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        {resource.quiz_count} quiz{resource.quiz_count !== 1 ? 'es' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title and Description */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {resource.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Created {new Date(resource.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-blue-600 font-medium">
                    Learn More →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {filteredResources.length > 0 && (
        <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-blue-800 mb-4">
            Ready to Test Your Knowledge?
          </h3>
          <p className="text-blue-600 mb-6">
            Complete the quizzes in each resource to earn badges and track your emergency preparedness progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/profile"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Your Progress
            </Link>
            <Link
              to="/emergency"
              className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
            >
              Emergency Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
