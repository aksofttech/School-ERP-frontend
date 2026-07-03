import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { User, LoginCredentials } from '@/utils/types';
import { authService } from '@/services/auth.service';
import { isValidRole } from '@/utils/role-config';

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

    // Initialize auth state by hitting /auth/profile.
    // The HTTP-Only cookie is automatically sent by the browser, so no token
    // reading from localStorage is needed. If the profile call succeeds the user
    // is authenticated; if it returns 401, they are not.
    useEffect(() => {
        const initAuth = async () => {
            // Try to load a cached user object first for instant UI hydration
            try {
                const cachedStr =
                    (typeof window !== 'undefined' && localStorage.getItem('user')) ||
                    (typeof window !== 'undefined' && sessionStorage.getItem('user'));

                if (cachedStr) {
                    const cachedUser = JSON.parse(cachedStr);
                    if (cachedUser?.id && isValidRole(cachedUser.role)) {
                        setUser(cachedUser);
                        setAuthenticated(true);
                    }
                }
            } catch {
                // ignore parse errors
            }

            // Always verify with the server. The HTTP-Only cookie is sent automatically.
            try {
                const fetchedUser = await authService.getProfile();
                if (fetchedUser?.id && isValidRole(fetchedUser.role)) {
                    localStorage.setItem('user', JSON.stringify(fetchedUser));
                    setUser(fetchedUser);
                    setAuthenticated(true);
                } else {
                    throw new Error('Invalid user data from server');
                }
            } catch {
                // Cookie missing or expired — clear any stale cache and mark as unauthenticated
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    sessionStorage.removeItem('user');
                }
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
            // Backend validates credentials, returns user, and sets the HTTP-Only cookie
            const response = await authService.login(credentials);

            if (!response?.user) {
                throw new Error('Invalid response from server');
            }

            if (!isValidRole(response.user.role)) {
                throw new Error('Invalid user data received from server');
            }

            // Cache the user profile locally for fast hydration on next load
            const storage = rememberMe ? localStorage : sessionStorage;

            // Clear any stale data from other storage first
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');

            storage.setItem('user', JSON.stringify(response.user));

            setUser(response.user);
            setAuthenticated(true);

            return response.user;
        },
        []
    );

    const logout = useCallback(async () => {
        try {
            // Calls backend POST /auth/logout which clears the HTTP-Only cookie
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear locally cached user profile
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                sessionStorage.removeItem('user');
            }
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
