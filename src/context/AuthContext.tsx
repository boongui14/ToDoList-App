import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface AuthContextType {
    isAdmin: boolean;
    login: (password: string) => boolean;
    logout: () => void;
    changePassword: (currentPassword: string, newPassword: string) => boolean;
}

const DEFAULT_ADMIN_PASSWORD = 'admin123';
const AUTH_STORAGE_KEY = 'todolist_admin_auth';
const PASSWORD_STORAGE_KEY = 'todolist_admin_password';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState<boolean>(() => {
        // Check localStorage for persisted auth state
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        return stored === 'true';
    });

    // Get the current password (from localStorage or default)
    const getPassword = useCallback(() => {
        return localStorage.getItem(PASSWORD_STORAGE_KEY) || DEFAULT_ADMIN_PASSWORD;
    }, []);

    // Persist auth state to localStorage
    useEffect(() => {
        localStorage.setItem(AUTH_STORAGE_KEY, String(isAdmin));
    }, [isAdmin]);

    const login = useCallback((password: string): boolean => {
        if (password === getPassword()) {
            setIsAdmin(true);
            return true;
        }
        return false;
    }, [getPassword]);

    const logout = useCallback(() => {
        setIsAdmin(false);
    }, []);

    const changePassword = useCallback((currentPassword: string, newPassword: string): boolean => {
        if (currentPassword === getPassword() && newPassword.length >= 4) {
            localStorage.setItem(PASSWORD_STORAGE_KEY, newPassword);
            return true;
        }
        return false;
    }, [getPassword]);

    return (
        <AuthContext.Provider value={{ isAdmin, login, logout, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
};

