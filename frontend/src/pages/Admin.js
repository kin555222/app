import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import QuizEditor from '../components/QuizEditor';
import ResourceManager from '../components/ResourceManager';
import UserManagement from '../components/UserManagement';
import AlertManagement from '../components/AlertManagement';
import CommunityManagement from '../components/CommunityManagement';
import PasswordChange from '../components/PasswordChange';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await adminAPI.getAnalytics();
            setAnalytics(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch analytics data');
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'dashboard', name: 'Dashboard', icon: '📊' },
        { id: 'resources', name: 'Resources', icon: '📚' },
        { id: 'quizzes', name: 'Quizzes', icon: '🧠' },
        { id: 'users', name: 'Users', icon: '👥' },
        { id: 'communities', name: 'Communities', icon: '🏘️' },
        { id: 'alerts', name: 'Alerts', icon: '🚨' },
        { id: 'settings', name: 'Settings', icon: '⚙️' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardOverview analytics={analytics} loading={loading} error={error} />;
            case 'resources':
                return <ResourceManager />;
            case 'quizzes':
                return <QuizEditor />;
            case 'users':
                return <UserManagement />;
            case 'communities':
                return <CommunityManagement />;
            case 'alerts':
                return <AlertManagement />;
            case 'settings':
                return <AdminSettings />;
            default:
                return <DashboardOverview analytics={analytics} loading={loading} error={error} />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Manage your disaster preparedness platform</p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-96">
                {renderContent()}
            </div>
        </div>
    );
};

// Dashboard Overview Component
const DashboardOverview = ({ analytics, loading, error }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
            </div>
        );
    }

    if (!analytics) return null;

    const { overview, popular_resources, category_distribution } = analytics;

    return (
        <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={overview.total_users}
                    icon="👥"
                    color="blue"
                    subtitle={`${overview.recent_users} this month`}
                />
                <StatCard
                    title="Resources"
                    value={overview.total_resources}
                    icon="📚"
                    color="green"
                />
                <StatCard
                    title="Quizzes"
                    value={overview.total_quizzes}
                    icon="🧠"
                    color="purple"
                    subtitle={`${overview.quiz_completions} completed`}
                />
                <StatCard
                    title="Communities"
                    value={overview.total_communities}
                    icon="🏘️"
                    color="orange"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Popular Resources */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Resources</h3>
                    <div className="space-y-3">
                        {popular_resources.length === 0 ? (
                            <p className="text-gray-500">No completion data available</p>
                        ) : (
                            popular_resources.map((resource, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700 truncate">{resource.title}</span>
                                    <span className="text-sm font-medium text-blue-600">
                                        {resource.completions} completions
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Categories</h3>
                    <div className="space-y-3">
                        {category_distribution.map((category, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <span className="text-sm text-gray-700 capitalize">{category.category}</span>
                                <span className="text-sm font-medium text-green-600">
                                    {category.count} resources
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickActionButton
                        title="Create Resource"
                        description="Add new educational content"
                        icon="📝"
                        onClick={() => {/* Navigate to resource creation */}}
                    />
                    <QuickActionButton
                        title="Create Quiz"
                        description="Add quiz questions"
                        icon="❓"
                        onClick={() => {/* Navigate to quiz creation */}}
                    />
                    <QuickActionButton
                        title="Send Alert"
                        description="Create emergency alert"
                        icon="🚨"
                        onClick={() => {/* Navigate to alert creation */}}
                    />
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, subtitle }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600'
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    <span className="text-2xl">{icon}</span>
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <p className="text-2xl font-semibold text-gray-900">{value || 0}</p>
                    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                </div>
            </div>
        </div>
    );
};

// Quick Action Button Component
const QuickActionButton = ({ title, description, icon, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow text-left"
        >
            <div className="flex items-center space-x-3">
                <span className="text-2xl">{icon}</span>
                <div>
                    <h4 className="font-medium text-gray-900">{title}</h4>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
        </button>
    );
};

// Admin Settings Component
const AdminSettings = () => {
    const [activeSettingsTab, setActiveSettingsTab] = useState('password');

    const settingsTabs = [
        { id: 'password', name: 'Change Password', icon: '🔐' },
        // Add more settings tabs in the future
        // { id: 'profile', name: 'Profile', icon: '👤' },
        // { id: 'notifications', name: 'Notifications', icon: '🔔' },
    ];

    const renderSettingsContent = () => {
        switch (activeSettingsTab) {
            case 'password':
                return <PasswordChange />;
            default:
                return <PasswordChange />;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Settings</h2>
                <p className="text-gray-600">Manage your account and security settings</p>
            </div>

            {/* Settings Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Settings">
                    {settingsTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSettingsTab(tab.id)}
                            className={`${
                                activeSettingsTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Settings Content */}
            <div className="py-6">
                {renderSettingsContent()}
            </div>
        </div>
    );
};

export default Admin;
