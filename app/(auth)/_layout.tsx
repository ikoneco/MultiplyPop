import React, { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

/**
 * Auth layout - only accessible when NOT authenticated
 */
export default function AuthLayout() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            // Redirect to dashboard if already authenticated
            router.replace('/(dashboard)');
        }
    }, [isAuthenticated, isLoading, router]);

    // Don't render children if user is authenticated
    if (isAuthenticated) {
        return null;
    }

    return <Slot />;
}
