import { useEffect, useState, useCallback } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useUserStore } from '@/state/userStore';
import { ensureUserExists } from '@/data/userRepo';
import { ensureSettings } from '@/data/settingsRepo';
import { events, identifyUser, clearUserIdentity } from '@/lib/analytics';
import { logger } from '@/lib/logger';
import type { AuthUser, AuthMethod } from '@/types/user';

/**
 * Convert Firebase user to app AuthUser
 */
function toAuthUser(firebaseUser: FirebaseUser): AuthUser {
    return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
    };
}

/**
 * Authentication hook
 */
export function useAuth() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, setUser, clearUser, isHydrated } = useUserStore();

    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    const authUser = toAuthUser(firebaseUser);
                    setUser(authUser);

                    // Ensure user exists in Firestore
                    await ensureUserExists(
                        authUser.id,
                        authUser.email,
                        authUser.displayName,
                        authUser.photoURL
                    );

                    // Ensure settings exist
                    await ensureSettings(authUser.id);

                    // Track user in analytics
                    identifyUser(authUser.id);

                    logger.info('User signed in', { userId: authUser.id });
                } else {
                    clearUser();
                    clearUserIdentity();
                    logger.info('User signed out');
                }
            } catch (err) {
                logger.error('Auth state change error', { error: err });
            } finally {
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, [setUser, clearUser]);

    /**
     * Sign in with email and password
     */
    const signInWithEmail = useCallback(
        async (email: string, password: string): Promise<void> => {
            setError(null);
            setIsLoading(true);

            try {
                await signInWithEmailAndPassword(auth, email, password);
                events.signIn('email');
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Sign in failed';
                setError(message);
                logger.error('Email sign in failed', { error: err });
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    /**
     * Sign up with email and password
     */
    const signUpWithEmail = useCallback(
        async (email: string, password: string): Promise<void> => {
            setError(null);
            setIsLoading(true);

            try {
                await createUserWithEmailAndPassword(auth, email, password);
                events.signUp('email');
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Sign up failed';
                setError(message);
                logger.error('Email sign up failed', { error: err });
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    /**
     * Sign in with Google
     */
    const signInWithGoogle = useCallback(async (): Promise<void> => {
        setError(null);
        setIsLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            await signInWithPopup(auth, provider);
            events.signIn('google');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Google sign in failed';
            setError(message);
            logger.error('Google sign in failed', { error: err });
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Sign out
     */
    const signOut = useCallback(async (): Promise<void> => {
        setError(null);

        try {
            await firebaseSignOut(auth);
            events.signOut();
            clearUser();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Sign out failed';
            setError(message);
            logger.error('Sign out failed', { error: err });
            throw err;
        }
    }, [clearUser]);

    /**
     * Send password reset email
     */
    const resetPassword = useCallback(async (email: string): Promise<void> => {
        setError(null);

        try {
            await sendPasswordResetEmail(auth, email);
            logger.info('Password reset email sent', { email });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Password reset failed';
            setError(message);
            logger.error('Password reset failed', { error: err });
            throw err;
        }
    }, []);

    /**
     * Clear error
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        // State
        user,
        isLoading: isLoading || !isHydrated,
        isAuthenticated: user !== null,
        error,

        // Actions
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        resetPassword,
        clearError,
    };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
