import React, { useState, useEffect } from 'react';
import { resourcesAPI, adminAPI } from '../services/api';
import LoadingSpinner from './ui/LoadingSpinner';

const ResourceManager = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedResources, setSelectedResources] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Filtering and sorting state
  const [filters, setFilters] = useState({
    category: '',
    contentType: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await resourcesAPI.getAll();
      setResources(data.resources || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch resources');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingResource({
      title: '',
      description: '',
      content_url: '',
      content_type: 'article',
      category: 'general'
    });
    setIsCreating(true);
    setShowForm(true);
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setIsCreating(false);
    setShowForm(true);
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      return;
    }

    try {
      await adminAPI.deleteResource(resourceId);
      await fetchResources(); // Refresh the list
    } catch (err) {
      setError('Failed to delete resource');
      console.error('Error deleting resource:', err);
    }
  };

  const handleSave = async (resourceData) => {
    try {
      if (isCreating) {
        await adminAPI.createResource(resourceData);
      } else {
        await adminAPI.updateResource(editingResource.id, resourceData);
      }
      setShowForm(false);
      setEditingResource(null);
      await fetchResources(); // Refresh the list
    } catch (err) {
      setError(isCreating ? 'Failed to create resource' : 'Failed to update resource');
      console.error('Error saving resource:', err);
    }
  };

  // Enhanced filtering and sorting functions
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const handleSelectResource = (resourceId) => {
    setSelectedResources(prev => {
      if (prev.includes(resourceId)) {
        return prev.filter(id => id !== resourceId);
      } else {
        return [...prev, resourceId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedResources.length === filteredAndSortedResources.length) {
      setSelectedResources([]);
    } else {
      setSelectedResources(filteredAndSortedResources.map(r => r.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedResources.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedResources.length} selected resource(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      await Promise.all(selectedResources.map(id => adminAPI.deleteResource(id)));
      setSelectedResources([]);
      await fetchResources();
    } catch (err) {
      setError('Failed to delete selected resources');
      console.error('Error deleting resources:', err);
    }
  };

  // Filter and sort resources
  const filteredAndSortedResources = resources
    .filter(resource => {
      const matchesCategory = !filters.category || resource.category === filters.category;
      const matchesContentType = !filters.contentType || resource.content_type === filters.contentType;
      const matchesSearch = !filters.search || 
        resource.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        resource.description.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesCategory && matchesContentType && matchesSearch;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'content_type':
          aValue = a.content_type;
          bValue = b.content_type;
          break;
        case 'quiz_count':
          aValue = a.quiz_count || 0;
          bValue = b.quiz_count || 0;
          break;
        case 'created_at':
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const getCategoryIcon = (category) => {
    const iconMap = {
      earthquake: '🌍',
      fire: '🔥',
      flood: '🌊',
      hurricane: '🌪️',
      tornado: '🌪️',
      power_outage: '⚡',
      medical: '🏥',
      communication: '📻',
      supplies: '🧳',
      evacuation: '🚪',
      general: '📋'
    };
    return iconMap[category?.toLowerCase()] || '📋';
  };

  const getContentTypeIcon = (contentType) => {
    const iconMap = {
      article: '📖',
      video: '🎥',
      infographic: '🖼️',
      checklist: '✅'
    };
    return iconMap[contentType] || '📖';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resource Management</h2>
          <p className="text-gray-600">Manage educational resources and content</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <span className="mr-2">+</span>
          Create Resource
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Resource Form Modal */}
      {showForm && (
        <ResourceForm
          resource={editingResource}
          isCreating={isCreating}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingResource(null);
          }}
        />
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search resources..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex space-x-4">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              <option value="general">General Emergency</option>
              <option value="earthquake">Earthquake</option>
              <option value="fire">Fire Safety</option>
              <option value="flood">Flood</option>
              <option value="hurricane">Hurricane</option>
              <option value="tornado">Tornado</option>
              <option value="power_outage">Power Outage</option>
              <option value="medical">Medical Emergency</option>
              <option value="communication">Emergency Communication</option>
              <option value="supplies">Emergency Supplies</option>
              <option value="evacuation">Evacuation</option>
            </select>
            
            <select
              value={filters.contentType}
              onChange={(e) => handleFilterChange('contentType', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Content Types</option>
              <option value="article">Articles</option>
              <option value="video">Videos</option>
              <option value="infographic">Infographics</option>
              <option value="checklist">Checklists</option>
            </select>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Sort by:</span>
            <div className="flex space-x-2">
              {[
                { key: 'created_at', label: 'Date' },
                { key: 'title', label: 'Title' },
                { key: 'category', label: 'Category' },
                { key: 'quiz_count', label: 'Quizzes' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleSortChange(key)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    sortBy === key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {label}
                  {sortBy === key && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Bulk Actions */}
          {selectedResources.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedResources.length} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-50 text-red-700 rounded-md text-sm font-medium hover:bg-red-100"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>
        
        {/* Results Summary */}
        <div className="text-sm text-gray-600">
          Showing {filteredAndSortedResources.length} of {resources.length} resources
        </div>
      </div>

      {/* Resources Grid */}
      {filteredAndSortedResources.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-gray-500 text-lg">
            {resources.length === 0 
              ? 'No resources found. Create your first resource to get started.'
              : 'No resources match your current filters.'
            }
          </div>
          {filters.search || filters.category || filters.contentType ? (
            <button
              onClick={() => setFilters({ category: '', contentType: '', search: '' })}
              className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100"
            >
              Clear Filters
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedResources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCategoryIcon(resource.category)}</span>
                  <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded capitalize">
                    {resource.category?.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-lg">{getContentTypeIcon(resource.content_type)}</span>
                  <span className="text-xs text-gray-500">{resource.content_type}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {resource.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {resource.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Created: {new Date(resource.created_at).toLocaleDateString()}</span>
                <span>{resource.quiz_count} quiz{resource.quiz_count !== 1 ? 'zes' : ''}</span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(resource)}
                  className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm font-medium hover:bg-blue-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded text-sm font-medium hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Resource Form Component
const ResourceForm = ({ resource, isCreating, onSave, onCancel }) => {
  const [formData, setFormData] = useState(resource);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'general', label: 'General Emergency' },
    { value: 'earthquake', label: 'Earthquake' },
    { value: 'fire', label: 'Fire Safety' },
    { value: 'flood', label: 'Flood' },
    { value: 'hurricane', label: 'Hurricane' },
    { value: 'tornado', label: 'Tornado' },
    { value: 'power_outage', label: 'Power Outage' },
    { value: 'medical', label: 'Medical Emergency' },
    { value: 'communication', label: 'Emergency Communication' },
    { value: 'supplies', label: 'Emergency Supplies' },
    { value: 'evacuation', label: 'Evacuation' }
  ];

  const contentTypes = [
    { value: 'article', label: 'Article' },
    { value: 'video', label: 'Video' },
    { value: 'infographic', label: 'Infographic' },
    { value: 'checklist', label: 'Checklist' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.content_url && !isValidUrl(formData.content_url)) {
      newErrors.content_url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {isCreating ? 'Create New Resource' : 'Edit Resource'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter resource title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter resource description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.category ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content Type
              </label>
              <select
                name="content_type"
                value={formData.content_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {contentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content URL (optional)
            </label>
            <input
              type="url"
              name="content_url"
              value={formData.content_url}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.content_url ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="https://example.com/resource"
            />
            {errors.content_url && <p className="mt-1 text-sm text-red-600">{errors.content_url}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : (isCreating ? 'Create Resource' : 'Update Resource')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceManager;
