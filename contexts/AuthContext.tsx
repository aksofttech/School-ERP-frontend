import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { User, LoginCredentials } from '@/utils/types';
import { authService } from '@/services/auth.service';
import { isValidRole } from '@/utils/role-config';
import { STORAGE_KEYS } from '@/utils/constants';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    authenticated: boolean;
    login: (credentials: LoginCredentials, rememberMe?: boolean) => Promise<User>;
    logout: () => Promise<void>;
    isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    // Initialize auth state
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initAuth = async () => {
            const localToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            const sessionToken = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            const token = localToken || sessionToken;

            if (!token) {
                setLoading(false);
                setAuthenticated(false);
                return;
            }

            try {
                const localUserStr = localStorage.getItem(STORAGE_KEYS.USER);
                const sessionUserStr = sessionStorage.getItem(STORAGE_KEYS.USER);
                const storedUserStr = localUserStr || sessionUserStr;

                if (storedUserStr) {
                    const storedUser = JSON.parse(storedUserStr);
                    if (storedUser && storedUser.id && isValidRole(storedUser.role)) {
                        setUser(storedUser);
                        setAuthenticated(true);
                        setLoading(false);
                        return;
                    }
                }
            } catch (e) {
                console.warn('[AuthContext] Cache parse error', e);
            }

            try {
                const fetchedUser = await authService.getProfile();
                if (fetchedUser && fetchedUser.id && isValidRole(fetchedUser.role)) {
                    const storage = localToken ? localStorage : sessionStorage;
                    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(fetchedUser));
                    setUser(fetchedUser);
                    setAuthenticated(true);
                } else {
                    throw new Error('Invalid user');
                }
            } catch (error) {
                console.error('[AuthContext] Init error:', error);
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);
                sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                sessionStorage.removeItem(STORAGE_KEYS.USER);
                setUser(null);
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = useCallback(
        async (credentials: LoginCredentials, rememberMe: boolean = false): Promise<User> => {
            const response = await authService.login(credentials);

            if (!response || !response.access_token) {
                throw new Error('Invalid response from server');
            }

            if (!response.user || !isValidRole(response.user.role)) {
                throw new Error('Invalid user data received from server');
            }

            // Clear existing data first
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            sessionStorage.removeItem(STORAGE_KEYS.USER);

            const storage = rememberMe ? localStorage : sessionStorage;

            // Save token and user to appropriate storage
            storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
            storage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

            // Update state
            setUser(response.user);
            setAuthenticated(true);

            return response.user;
        },
        []
    );

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear all storage
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            sessionStorage.removeItem(STORAGE_KEYS.USER);

            setUser(null);
            setAuthenticated(false);
            router.push('/auth/login');
        }
    }, [router]);

    const isAuthenticatedCheck = useCallback((): boolean => {
        return authenticated && user !== null;
    }, [authenticated, user]);

    return (
        <AuthContext.Provider value={{ user, loading, authenticated, login, logout, isAuthenticated: isAuthenticatedCheck }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
