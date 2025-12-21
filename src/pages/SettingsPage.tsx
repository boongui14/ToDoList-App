import React, { useState } from 'react';
import { Bell, Moon, User, Shield, Palette, Check, X, Download, Key, Trash2, Mail, Volume2, Calendar, Users, Sun, Type } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import type { ThemeColor, FontSize } from '../types';

// Toggle Switch Component
const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
        onClick={() => onChange(!enabled)}
        className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-primary' : 'bg-slate-200 hover:bg-slate-300'
            }`}
    >
        <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? 'right-1' : 'left-1'
                }`}
        />
    </button>
);

// Inline Edit Component
const InlineEdit: React.FC<{
    label: string;
    value: string;
    onSave: (value: string) => void;
}> = ({ label, value, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);

    const handleSave = () => {
        if (editValue.trim()) {
            onSave(editValue.trim());
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex-1 mr-4">
                    <p className="font-medium text-slate-700 mb-1">{label}</p>
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') handleCancel();
                        }}
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                        <Check size={18} />
                    </button>
                    <button
                        onClick={handleCancel}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
                <p className="font-medium text-slate-700">{label}</p>
                <p className="text-sm text-slate-500">{value}</p>
            </div>
            <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-primary hover:text-blue-600 font-medium"
            >
                Edit
            </button>
        </div>
    );
};

// Avatar Picker Component
const avatarOptions = ['👤', '👨', '👩', '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '🧑‍🎨', '👨‍🔬', '👩‍🔬', '🦸', '🧙'];

const AvatarPicker: React.FC<{ selected: string; onSelect: (avatar: string) => void }> = ({ selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-4xl p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
                {selected}
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 p-3 bg-white rounded-xl shadow-lg border border-slate-100 grid grid-cols-6 gap-2 z-10">
                    {avatarOptions.map((avatar) => (
                        <button
                            key={avatar}
                            onClick={() => {
                                onSelect(avatar);
                                setIsOpen(false);
                            }}
                            className={`text-2xl p-2 rounded-lg hover:bg-slate-100 transition-colors ${selected === avatar ? 'bg-primary/10 ring-2 ring-primary' : ''
                                }`}
                        >
                            {avatar}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Theme Color Picker
const themeColors: { value: ThemeColor; color: string; label: string }[] = [
    { value: 'blue', color: '#3B82F6', label: 'Blue' },
    { value: 'purple', color: '#8B5CF6', label: 'Purple' },
    { value: 'green', color: '#10B981', label: 'Green' },
    { value: 'orange', color: '#F97316', label: 'Orange' },
    { value: 'pink', color: '#EC4899', label: 'Pink' },
];

// Font Size Options
const fontSizes: { value: FontSize; label: string }[] = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
];

// Change Password Modal
const ChangePasswordModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
    const { changePassword } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 4) {
            setError('New password must be at least 4 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (changePassword(currentPassword, newPassword)) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            onSuccess();
            onClose();
        } else {
            setError('Current password is incorrect');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Change Password</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            required
                        />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors"
                        >
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Confirmation Modal
const ConfirmModal: React.FC<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    danger?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}> = ({ isOpen, title, message, confirmText, danger, onConfirm, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600 mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-4 py-2.5 rounded-xl transition-colors ${danger
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-primary text-white hover:bg-blue-600'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Toast Notification
const Toast: React.FC<{ message: string; show: boolean }> = ({ message, show }) => {
    if (!show) return null;

    return (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-up z-50">
            <Check size={18} className="text-green-400" />
            {message}
        </div>
    );
};

export const SettingsPage: React.FC = () => {
    const { settings, updateProfile, updateAppearance, updateNotifications } = useSettings();
    const { isAdmin } = useAuth();
    const { tasks } = useTasks();

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '' });

    const showToast = (message: string) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    const handleExportData = () => {
        const exportData = {
            exportedAt: new Date().toISOString(),
            profile: settings.profile,
            tasks: tasks,
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `todolist-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Data exported successfully');
    };

    const handleDeleteAccount = () => {
        // Clear all localStorage data
        localStorage.clear();
        // Reload the page to reset
        window.location.reload();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your preferences</p>
            </div>

            <div className="space-y-4">
                {/* Profile Section */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <User className="text-primary" size={24} />
                        <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-4 py-3 border-b border-slate-100">
                            <AvatarPicker
                                selected={settings.profile.avatar}
                                onSelect={(avatar) => updateProfile({ avatar })}
                            />
                            <div>
                                <p className="font-medium text-slate-700">Avatar</p>
                                <p className="text-sm text-slate-500">Click to change</p>
                            </div>
                        </div>
                        <InlineEdit
                            label="Name"
                            value={settings.profile.name}
                            onSave={(name) => {
                                updateProfile({ name });
                                showToast('Name updated');
                            }}
                        />
                        <InlineEdit
                            label="Email"
                            value={settings.profile.email}
                            onSave={(email) => {
                                updateProfile({ email });
                                showToast('Email updated');
                            }}
                        />
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Palette className="text-primary" size={24} />
                        <h2 className="text-lg font-semibold text-slate-900">Appearance</h2>
                    </div>
                    <div className="space-y-4">
                        {/* Dark Mode Toggle */}
                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                {settings.appearance.darkMode ? (
                                    <Moon size={20} className="text-slate-500" />
                                ) : (
                                    <Sun size={20} className="text-slate-500" />
                                )}
                                <div>
                                    <p className="font-medium text-slate-700">Dark Mode</p>
                                    <p className="text-sm text-slate-500">Use dark theme</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.appearance.darkMode}
                                onChange={(enabled) => {
                                    updateAppearance({ darkMode: enabled });
                                    showToast(enabled ? 'Dark mode enabled' : 'Dark mode disabled');
                                }}
                            />
                        </div>

                        {/* Theme Color */}
                        <div className="py-3 border-b border-slate-100">
                            <div className="flex items-center gap-3 mb-3">
                                <Palette size={20} className="text-slate-500" />
                                <div>
                                    <p className="font-medium text-slate-700">Theme Color</p>
                                    <p className="text-sm text-slate-500">Choose your preferred accent color</p>
                                </div>
                            </div>
                            <div className="flex gap-3 ml-8">
                                {themeColors.map((theme) => (
                                    <button
                                        key={theme.value}
                                        onClick={() => {
                                            updateAppearance({ themeColor: theme.value });
                                            showToast(`Theme color changed to ${theme.label}`);
                                        }}
                                        className={`w-10 h-10 rounded-full transition-all ${settings.appearance.themeColor === theme.value
                                            ? 'ring-2 ring-offset-2 ring-slate-400 scale-110'
                                            : 'hover:scale-105'
                                            }`}
                                        style={{ backgroundColor: theme.color }}
                                        title={theme.label}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Font Size */}
                        <div className="py-3">
                            <div className="flex items-center gap-3 mb-3">
                                <Type size={20} className="text-slate-500" />
                                <div>
                                    <p className="font-medium text-slate-700">Font Size</p>
                                    <p className="text-sm text-slate-500">Adjust text size</p>
                                </div>
                            </div>
                            <div className="flex gap-2 ml-8">
                                {fontSizes.map((size) => (
                                    <button
                                        key={size.value}
                                        onClick={() => {
                                            updateAppearance({ fontSize: size.value });
                                            showToast(`Font size changed to ${size.label}`);
                                        }}
                                        className={`px-4 py-2 rounded-lg transition-all ${settings.appearance.fontSize === size.value
                                            ? 'bg-primary text-white'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        {size.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Bell className="text-primary" size={24} />
                        <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <Calendar size={20} className="text-slate-500" />
                                <div>
                                    <p className="font-medium text-slate-700">Due Date Reminders</p>
                                    <p className="text-sm text-slate-500">Get notified before tasks are due</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.notifications.dueDateReminders}
                                onChange={(enabled) => updateNotifications({ dueDateReminders: enabled })}
                            />
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <Mail size={20} className="text-slate-500" />
                                <div>
                                    <p className="font-medium text-slate-700">Weekly Summary</p>
                                    <p className="text-sm text-slate-500">Receive weekly productivity reports</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.notifications.weeklySummary}
                                onChange={(enabled) => updateNotifications({ weeklySummary: enabled })}
                            />
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <Mail size={20} className="text-slate-500" />
                                <div>
                                    <p className="font-medium text-slate-700">Email Notifications</p>
                                    <p className="text-sm text-slate-500">Receive updates via email</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.notifications.emailNotifications}
                                onChange={(enabled) => updateNotifications({ emailNotifications: enabled })}
                            />
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <Users size={20} className="text-slate-500" />
                                <div>
                                    <p className="font-medium text-slate-700">Task Assignment Alerts</p>
                                    <p className="text-sm text-slate-500">Get notified when assigned to tasks</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.notifications.taskAssignmentAlerts}
                                onChange={(enabled) => updateNotifications({ taskAssignmentAlerts: enabled })}
                            />
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <Volume2 size={20} className="text-slate-500" />
                                <div>
                                    <p className="font-medium text-slate-700">Push Notifications</p>
                                    <p className="text-sm text-slate-500">Enable browser push notifications</p>
                                </div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.notifications.pushNotifications}
                                onChange={(enabled) => updateNotifications({ pushNotifications: enabled })}
                            />
                        </div>
                    </div>
                </div>

                {/* Privacy Section */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="text-primary" size={24} />
                        <h2 className="text-lg font-semibold text-slate-900">Privacy & Security</h2>
                        {!isAdmin && (
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">Admin Only</span>
                        )}
                    </div>
                    <div className="space-y-2">
                        <button
                            onClick={() => isAdmin && setShowPasswordModal(true)}
                            disabled={!isAdmin}
                            className={`w-full flex items-center gap-3 text-left py-3 transition-colors border-b border-slate-100 ${isAdmin
                                ? 'text-slate-700 hover:text-primary'
                                : 'text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            <Key size={20} />
                            Change Password
                        </button>

                        <button
                            onClick={() => isAdmin && handleExportData()}
                            disabled={!isAdmin}
                            className={`w-full flex items-center gap-3 text-left py-3 transition-colors border-b border-slate-100 ${isAdmin
                                ? 'text-slate-700 hover:text-primary'
                                : 'text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            <Download size={20} />
                            Export Data
                        </button>

                        <button
                            onClick={() => isAdmin && setShowDeleteModal(true)}
                            disabled={!isAdmin}
                            className={`w-full flex items-center gap-3 text-left py-3 transition-colors ${isAdmin
                                ? 'text-red-600 hover:text-red-700'
                                : 'text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            <Trash2 size={20} />
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSuccess={() => showToast('Password updated successfully')}
            />

            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete Account"
                message="Are you sure you want to delete your account? This will clear all your data and cannot be undone."
                confirmText="Delete Account"
                danger
                onConfirm={handleDeleteAccount}
                onClose={() => setShowDeleteModal(false)}
            />

            {/* Toast */}
            <Toast message={toast.message} show={toast.show} />
        </div>
    );
};
