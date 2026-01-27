import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import * as api from '../services/googleSheetsAPI';
import type { User } from '../services/googleSheetsAPI';

// Types
interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
    isAuthenticated: boolean;
    canEdit: () => boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('cepea_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Failed to restore session:', error);
                localStorage.removeItem('cepea_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await api.authenticate(username, password);

            if (response.success && response.data) {
                setUser(response.data);
                localStorage.setItem('cepea_user', JSON.stringify(response.data));
            } else {
                throw new Error(response.error || 'Échec de l\'authentification');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('cepea_user');
    };

    const changePassword = async (oldPassword: string, newPassword: string) => {
        if (!user) {
            throw new Error('Utilisateur non connecté');
        }

        try {
            const response = await api.changePassword(user.username, oldPassword, newPassword);

            if (response.success) {
                // Update user to remove mustChangePassword flag
                const updatedUser = { ...user, mustChangePassword: false };
                setUser(updatedUser);
                localStorage.setItem('cepea_user', JSON.stringify(updatedUser));
            } else {
                throw new Error(response.error || 'Échec du changement de mot de passe');
            }
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    };

    const canEdit = () => {
        if (!user) return false;
        return ['president', 'secretary', 'treasurer'].includes(user.role);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                changePassword,
                isAuthenticated: !!user,
                canEdit,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
