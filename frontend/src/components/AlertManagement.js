import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import LoadingSpinner, { SkeletonLoader } from './ui/LoadingSpinner';

const AlertManagement = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllAlerts();
      setAlerts(data.alerts || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch alerts');
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (alertData) => {
    try {
      await adminAPI.createAlert(alertData);
      setShowCreateForm(false);
      await fetchAlerts(); // Refresh the list
    } catch (err) {
      setError(`Failed to create alert: ${err.response?.data?.error || err.message}`);
      console.error('Error creating alert:', err);
    }
  };

  const handleDismissAlert = async (alertId) => {
    if (!window.confirm('Are you sure you want to dismiss this alert? This action cannot be undone.')) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [alertId]: true }));
    
    try {
      await adminAPI.dismissAlert(alertId);
      
      // Update the alert in the local state
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, is_active: false }
          : alert
      ));
      
    } catch (err) {
      setError(`Failed to dismiss alert: ${err.response?.data?.error || err.message}`);
      console.error('Error dismissing alert:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [alertId]: false }));
    }
  };

  const getSeverityBadge = (severity) => {
    const severityClasses = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };

    const severityIcons = {
      low: 'ℹ️',
      medium: '⚠️',
      high: '🔸',
      critical: '🚨'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityClasses[severity] || severityClasses.medium}`}>
        <span className="mr-1">{severityIcons[severity] || '⚠️'}</span>
        {severity?.charAt(0).toUpperCase() + severity?.slice(1) || 'Unknown'}
      </span>
    );
  };

  const getAlertTypeBadge = (alertType) => {
    const typeClasses = {
      weather: 'bg-blue-50 text-blue-700',
      emergency: 'bg-red-50 text-red-700',
      community: 'bg-green-50 text-green-700',
      government: 'bg-purple-50 text-purple-700'
    };

    const typeIcons = {
      weather: '🌤️',
      emergency: '🚨',
      community: '🏘️',
      government: '🏛️'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${typeClasses[alertType] || typeClasses.emergency}`}>
        <span className="mr-1">{typeIcons[alertType] || '📢'}</span>
        {alertType?.charAt(0).toUpperCase() + alertType?.slice(1) || 'General'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLocationString = (alert) => {
    const parts = [];
    if (alert.locality) parts.push(alert.locality);
    if (alert.city) parts.push(alert.city);
    if (alert.state) parts.push(alert.state);
    return parts.length > 0 ? parts.join(', ') : 'Global';
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Alert Management</h2>
            <p className="text-gray-600">Manage emergency alerts and notifications</p>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <SkeletonLoader key={index} lines={3} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alert Management</h2>
          <p className="text-gray-600">Manage emergency alerts and notifications</p>
          <p className="text-sm text-gray-500 mt-1">
            {alerts.filter(a => a.is_active).length} active alerts
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          <span className="mr-2">🚨</span>
          Create Alert
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Create Alert Form Modal */}
      {showCreateForm && (
        <AlertForm
          onSave={handleCreateAlert}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-gray-500 text-lg">
            No alerts found. Create your first alert to get started.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                !alert.is_active 
                  ? 'border-gray-300 opacity-60' 
                  : alert.severity === 'critical' 
                    ? 'border-red-500' 
                    : alert.severity === 'high' 
                      ? 'border-orange-500' 
                      : alert.severity === 'medium' 
                        ? 'border-yellow-500' 
                        : 'border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Alert Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    {getSeverityBadge(alert.severity)}
                    {getAlertTypeBadge(alert.alert_type)}
                    {!alert.is_active && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Dismissed
                      </span>
                    )}
                  </div>

                  {/* Alert Title and Message */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {alert.title}
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {alert.message}
                  </p>

                  {/* Alert Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">📍 Location:</span>
                      <div>{getLocationString(alert)}</div>
                    </div>
                    <div>
                      <span className="font-medium">📅 Issued:</span>
                      <div>{formatDate(alert.issued_at)}</div>
                    </div>
                    <div>
                      <span className="font-medium">⏰ Expires:</span>
                      <div>
                        {alert.expires_at 
                          ? formatDate(alert.expires_at)
                          : 'No expiry'
                        }
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                    {alert.category && (
                      <span>Category: {alert.category}</span>
                    )}
                    {alert.source && (
                      <span>Source: {alert.source}</span>
                    )}
                    {alert.community_id && (
                      <span>Community Alert</span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                {alert.is_active && (
                  <div className="ml-6">
                    <button
                      onClick={() => handleDismissAlert(alert.id)}
                      disabled={actionLoading[alert.id]}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading[alert.id] ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1"></div>
                      ) : (
                        <span className="mr-1">❌</span>
                      )}
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Alert Form Component
const AlertForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    alert_type: 'emergency',
    severity: 'medium',
    category: '',
    state: '',
    city: '',
    locality: '',
    expires_at: '',
    source: 'admin'
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const alertTypes = [
    { value: 'weather', label: '🌤️ Weather Alert' },
    { value: 'emergency', label: '🚨 Emergency Alert' },
    { value: 'community', label: '🏘️ Community Alert' },
    { value: 'government', label: '🏛️ Government Alert' }
  ];

  const severityLevels = [
    { value: 'low', label: 'ℹ️ Low' },
    { value: 'medium', label: '⚠️ Medium' },
    { value: 'high', label: '🔸 High' },
    { value: 'critical', label: '🚨 Critical' }
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

    if (!formData.message?.trim()) {
      newErrors.message = 'Message is required';
    }

    if (!formData.alert_type) {
      newErrors.alert_type = 'Alert type is required';
    }

    if (!formData.severity) {
      newErrors.severity = 'Severity is required';
    }

    if (formData.expires_at && new Date(formData.expires_at) <= new Date()) {
      newErrors.expires_at = 'Expiry date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      // Clean up the data
      const alertData = { ...formData };
      if (!alertData.expires_at) {
        delete alertData.expires_at;
      }
      if (!alertData.category?.trim()) {
        delete alertData.category;
      }
      if (!alertData.state?.trim()) {
        delete alertData.state;
      }
      if (!alertData.city?.trim()) {
        delete alertData.city;
      }
      if (!alertData.locality?.trim()) {
        delete alertData.locality;
      }

      await onSave(alertData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🚨</span>
          Create New Alert
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
              placeholder="Emergency Alert: Heavy Rainfall Expected"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md ${errors.message ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Detailed alert message with instructions and safety information..."
            />
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alert Type *
              </label>
              <select
                name="alert_type"
                value={formData.alert_type}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.alert_type ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              >
                {alertTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.alert_type && <p className="mt-1 text-sm text-red-600">{errors.alert_type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity *
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.severity ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              >
                {severityLevels.map(severity => (
                  <option key={severity.value} value={severity.value}>
                    {severity.label}
                  </option>
                ))}
              </select>
              {errors.severity && <p className="mt-1 text-sm text-red-600">{errors.severity}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Maharashtra"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mumbai"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Locality
              </label>
              <input
                type="text"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Specific area"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category (Optional)
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="flood, earthquake, cyclone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expires At (Optional)
              </label>
              <input
                type="datetime-local"
                name="expires_at"
                value={formData.expires_at}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.expires_at ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.expires_at && <p className="mt-1 text-sm text-red-600">{errors.expires_at}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="IMD, NDMA, admin"
            />
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlertManagement;
