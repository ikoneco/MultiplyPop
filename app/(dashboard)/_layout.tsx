import React, { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import { YStack, Spinner, Text } from 'tamagui';
import { useAuth } from '@/hooks/useAuth';

/**
 * Dashboard layout - only accessible when authenticated
 */
export default function DashboardLayout() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Redirect to sign-in if not authenticated
            router.replace('/(auth)/sign-in');
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading while checking auth
    if (isLoading) {
        return (
            <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
                <Spinner size="large" color="$primary" />
                <Text marginTop="$4" color="$colorMuted">
                    Loading...
                </Text>
            </YStack>
        );
    }

    // Don't render children if user is not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return <Slot />;
}
