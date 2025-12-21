import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { UserSettings, UserProfile, AppearanceSettings, NotificationSettings } from '../types';

interface SettingsContextType {
    settings: UserSettings;
    updateProfile: (profile: Partial<UserProfile>) => void;
    updateAppearance: (appearance: Partial<AppearanceSettings>) => void;
    updateNotifications: (notifications: Partial<NotificationSettings>) => void;
    resetSettings: () => void;
}

const SETTINGS_STORAGE_KEY = 'todolist_user_settings';

const defaultSettings: UserSettings = {
    profile: {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '👤',
    },
    appearance: {
        darkMode: false,
        themeColor: 'blue',
        fontSize: 'medium',
    },
    notifications: {
        dueDateReminders: true,
        weeklySummary: false,
        emailNotifications: true,
        taskAssignmentAlerts: true,
        pushNotifications: false,
    },
};

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
    const [settings, setSettings] = useState<UserSettings>(() => {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
            try {
                return { ...defaultSettings, ...JSON.parse(stored) };
            } catch {
                return defaultSettings;
            }
        }
        return defaultSettings;
    });

    // Persist settings to localStorage
    useEffect(() => {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    const updateProfile = useCallback((profile: Partial<UserProfile>) => {
        setSettings(prev => ({
            ...prev,
            profile: { ...prev.profile, ...profile },
        }));
    }, []);

    const updateAppearance = useCallback((appearance: Partial<AppearanceSettings>) => {
        setSettings(prev => ({
            ...prev,
            appearance: { ...prev.appearance, ...appearance },
        }));
    }, []);

    const updateNotifications = useCallback((notifications: Partial<NotificationSettings>) => {
        setSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, ...notifications },
        }));
    }, []);

    const resetSettings = useCallback(() => {
        setSettings(defaultSettings);
    }, []);

    return (
        <SettingsContext.Provider value={{
            settings,
            updateProfile,
            updateAppearance,
            updateNotifications,
            resetSettings,
        }}>
            {children}
        </SettingsContext.Provider>
    );
};
