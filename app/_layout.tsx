import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { TamaguiProvider, Theme } from 'tamagui';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { config } from '@/design/tamagui.config';
import { useAuth } from '@/hooks/useAuth';
import { trackScreenView } from '@/lib/analytics';

/**
 * Auth guard component that handles routing based on auth state
 */
function AuthGate({ children }: { children: React.ReactNode }) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inDashboardGroup = segments[0] === '(dashboard)';

        if (!isAuthenticated && !inAuthGroup) {
            // Redirect to sign-in if not authenticated
            router.replace('/(auth)/sign-in');
        } else if (isAuthenticated && inAuthGroup) {
            // Redirect to dashboard if authenticated
            router.replace('/(dashboard)');
        }
    }, [user, isLoading, isAuthenticated, segments, router]);

    // Track screen views
    useEffect(() => {
        const currentPath = '/' + segments.join('/');
        trackScreenView(currentPath);
    }, [segments]);

    return <>{children}</>;
}

/**
 * Root layout component
 */
export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <TamaguiProvider config={config}>
            <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
                <SafeAreaProvider>
                    <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                    <AuthGate>
                        <Slot />
                    </AuthGate>
                </SafeAreaProvider>
            </Theme>
        </TamaguiProvider>
    );
}
