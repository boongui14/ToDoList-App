import React from 'react';
import { Bell, Moon, User, Shield, Palette } from 'lucide-react';

export const SettingsPage: React.FC = () => {
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
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-slate-100">
                            <div>
                                <p className="font-medium text-slate-700">Name</p>
                                <p className="text-sm text-slate-500">John Doe</p>
                            </div>
                            <button className="text-sm text-primary hover:text-blue-600 font-medium">Edit</button>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium text-slate-700">Email</p>
                                <p className="text-sm text-slate-500">john@example.com</p>
                            </div>
                            <button className="text-sm text-primary hover:text-blue-600 font-medium">Edit</button>
                        </div>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Palette className="text-primary" size={24} />
                        <h2 className="text-lg font-semibold text-slate-900">Appearance</h2>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                            <Moon size={20} className="text-slate-500" />
                            <div>
                                <p className="font-medium text-slate-700">Dark Mode</p>
                                <p className="text-sm text-slate-500">Use dark theme</p>
                            </div>
                        </div>
                        <button className="w-12 h-6 bg-slate-200 rounded-full relative transition-colors hover:bg-slate-300">
                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform" />
                        </button>
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
                            <div>
                                <p className="font-medium text-slate-700">Due Date Reminders</p>
                                <p className="text-sm text-slate-500">Get notified before tasks are due</p>
                            </div>
                            <button className="w-12 h-6 bg-primary rounded-full relative transition-colors">
                                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                            </button>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium text-slate-700">Weekly Summary</p>
                                <p className="text-sm text-slate-500">Receive weekly productivity reports</p>
                            </div>
                            <button className="w-12 h-6 bg-slate-200 rounded-full relative transition-colors hover:bg-slate-300">
                                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Privacy Section */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="text-primary" size={24} />
                        <h2 className="text-lg font-semibold text-slate-900">Privacy & Security</h2>
                    </div>
                    <div className="space-y-4">
                        <button className="w-full text-left py-3 text-slate-700 hover:text-primary transition-colors border-b border-slate-100">
                            Change Password
                        </button>
                        <button className="w-full text-left py-3 text-slate-700 hover:text-primary transition-colors border-b border-slate-100">
                            Export Data
                        </button>
                        <button className="w-full text-left py-3 text-red-600 hover:text-red-700 transition-colors">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
