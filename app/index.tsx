import React from 'react';
import { Redirect } from 'expo-router';
import { YStack, Spinner, Text } from 'tamagui';
import { useAuth } from '@/hooks/useAuth';

/**
 * Entry point - redirects based on auth state
 */
export default function Index() {
    const { isLoading, isAuthenticated } = useAuth();

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

    if (isAuthenticated) {
        return <Redirect href="/(dashboard)" />;
    }

    return <Redirect href="/(auth)/sign-in" />;
}
