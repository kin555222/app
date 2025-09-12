import React, { useState } from 'react';
import { userAPI } from '../services/api';

const PasswordChange = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear message when user starts typing
        if (message.text) {
            setMessage({ type: '', text: '' });
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long';
        }
        if (!hasUpper) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!hasLower) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!hasDigit) {
            return 'Password must contain at least one digit';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setMessage({ type: 'error', text: 'All fields are required' });
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        const passwordError = validatePassword(formData.newPassword);
        if (passwordError) {
            setMessage({ type: 'error', text: passwordError });
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setMessage({ type: 'error', text: 'New password must be different from current password' });
            return;
        }

        setLoading(true);
        
        try {
            await userAPI.changePassword(formData.currentPassword, formData.newPassword);
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to change password';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const PasswordStrengthIndicator = ({ password }) => {
        if (!password) return null;

        const checks = [
            { label: 'At least 8 characters', test: password.length >= 8 },
            { label: 'Uppercase letter', test: /[A-Z]/.test(password) },
            { label: 'Lowercase letter', test: /[a-z]/.test(password) },
            { label: 'Number', test: /\d/.test(password) }
        ];

        const strength = checks.filter(check => check.test).length;
        const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'];

        return (
            <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className="text-xs font-medium text-gray-700">{strengthLabels[strength]}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${strengthColors[strength]}`}
                        style={{ width: `${(strength / 4) * 100}%` }}
                    ></div>
                </div>
                <div className="mt-1 space-y-0.5">
                    {checks.map((check, index) => (
                        <div key={index} className="flex items-center text-xs">
                            <span className={`mr-1 ${check.test ? 'text-green-500' : 'text-gray-400'}`}>
                                {check.test ? '✓' : '○'}
                            </span>
                            <span className={check.test ? 'text-green-700' : 'text-gray-500'}>
                                {check.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
                
                {message.text && (
                    <div className={`p-3 rounded-md mb-4 ${
                        message.type === 'success' 
                            ? 'bg-green-50 border border-green-200 text-green-700' 
                            : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? 'text' : 'password'}
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                                placeholder="Enter current password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.current ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? 'text' : 'password'}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                                placeholder="Enter new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.new ? '🙈' : '👁️'}
                            </button>
                        </div>
                        <PasswordStrengthIndicator password={formData.newPassword} />
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                                placeholder="Confirm new password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.confirm ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                            <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Changing Password...
                                </>
                            ) : (
                                'Change Password'
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-md">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Security Tips:</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Use a unique password you don't use elsewhere</li>
                        <li>• Consider using a password manager</li>
                        <li>• Don't share your password with anyone</li>
                        <li>• Change your password regularly</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PasswordChange;
