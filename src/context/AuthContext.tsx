import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface AuthContextType {
    isAdmin: boolean;
    login: (password: string) => boolean;
    logout: () => void;
}

const ADMIN_PASSWORD = 'admin123';
const AUTH_STORAGE_KEY = 'todolist_admin_auth';

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

    // Persist auth state to localStorage
    useEffect(() => {
        localStorage.setItem(AUTH_STORAGE_KEY, String(isAdmin));
    }, [isAdmin]);

    const login = useCallback((password: string): boolean => {
        if (password === ADMIN_PASSWORD) {
            setIsAdmin(true);
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setIsAdmin(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
