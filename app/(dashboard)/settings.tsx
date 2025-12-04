import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { YStack, XStack, Text, H1, Switch } from 'tamagui';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader } from '@/components/Card';
import { useAuth } from '@/hooks/useAuth';
import { ensureSettings, updateTheme, updateNotifications, updatePrivacy, type Settings } from '@/data/settingsRepo';
import { logger } from '@/lib/logger';

export default function SettingsScreen() {
    const { user, signOut } = useAuth();
    const [settings, setSettings] = useState<Settings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadSettings() {
            if (!user) return;

            try {
                const userSettings = await ensureSettings(user.id);
                setSettings(userSettings);
            } catch (error) {
                logger.error('Failed to load settings', { error });
            } finally {
                setIsLoading(false);
            }
        }

        loadSettings();
    }, [user]);

    const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
        if (!user || !settings) return;

        try {
            const updated = await updateTheme(user.id, theme);
            setSettings(updated);
        } catch (error) {
            logger.error('Failed to update theme', { error });
        }
    };

    const handleNotificationToggle = async (key: keyof Settings['notifications'], value: boolean) => {
        if (!user || !settings) return;

        try {
            const updated = await updateNotifications(user.id, { [key]: value });
            setSettings(updated);
        } catch (error) {
            logger.error('Failed to update notifications', { error });
        }
    };

    const handlePrivacyToggle = async (key: keyof Settings['privacy'], value: boolean) => {
        if (!user || !settings) return;

        try {
            const updated = await updatePrivacy(user.id, { [key]: value });
            setSettings(updated);
        } catch (error) {
            logger.error('Failed to update privacy settings', { error });
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch {
            // Error handled in hook
        }
    };

    if (isLoading) {
        return (
            <Layout centered>
                <Text color="$colorMuted">Loading settings...</Text>
            </Layout>
        );
    }

    return (
        <Layout safeArea padded>
            <YStack flex={1} gap="$4">
                {/* Header */}
                <XStack alignItems="center" gap="$4">
                    <Link href="/(dashboard)" asChild>
                        <Button variant="ghost" size="sm">
                            ← Back
                        </Button>
                    </Link>
                    <H1 color="$color" flex={1}>
                        Settings
                    </H1>
                </XStack>

                {/* Theme Settings */}
                <Card>
                    <CardHeader>
                        <Text fontSize={16} fontWeight="600" color="$color">
                            Appearance
                        </Text>
                    </CardHeader>
                    <CardContent gap="$3">
                        <XStack justifyContent="space-between" alignItems="center">
                            <Text color="$color">Theme</Text>
                            <XStack gap="$2">
                                {(['light', 'dark', 'system'] as const).map((theme) => (
                                    <Button
                                        key={theme}
                                        size="sm"
                                        variant={settings?.theme === theme ? 'primary' : 'secondary'}
                                        onPress={() => handleThemeChange(theme)}
                                    >
                                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                    </Button>
                                ))}
                            </XStack>
                        </XStack>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <Text fontSize={16} fontWeight="600" color="$color">
                            Notifications
                        </Text>
                    </CardHeader>
                    <CardContent gap="$3">
                        <XStack justifyContent="space-between" alignItems="center">
                            <YStack>
                                <Text color="$color">Push Notifications</Text>
                                <Text fontSize={12} color="$colorMuted">
                                    Receive push notifications on your device
                                </Text>
                            </YStack>
                            <Switch
                                checked={settings?.notifications.push ?? true}
                                onCheckedChange={(value) => handleNotificationToggle('push', value)}
                            />
                        </XStack>

                        <XStack justifyContent="space-between" alignItems="center">
                            <YStack>
                                <Text color="$color">Email Notifications</Text>
                                <Text fontSize={12} color="$colorMuted">
                                    Receive email updates about your account
                                </Text>
                            </YStack>
                            <Switch
                                checked={settings?.notifications.email ?? true}
                                onCheckedChange={(value) => handleNotificationToggle('email', value)}
                            />
                        </XStack>

                        <XStack justifyContent="space-between" alignItems="center">
                            <YStack>
                                <Text color="$color">Marketing Emails</Text>
                                <Text fontSize={12} color="$colorMuted">
                                    Receive news and promotional content
                                </Text>
                            </YStack>
                            <Switch
                                checked={settings?.notifications.marketing ?? false}
                                onCheckedChange={(value) => handleNotificationToggle('marketing', value)}
                            />
                        </XStack>
                    </CardContent>
                </Card>

                {/* Privacy Settings */}
                <Card>
                    <CardHeader>
                        <Text fontSize={16} fontWeight="600" color="$color">
                            Privacy
                        </Text>
                    </CardHeader>
                    <CardContent gap="$3">
                        <XStack justifyContent="space-between" alignItems="center">
                            <YStack>
                                <Text color="$color">Analytics</Text>
                                <Text fontSize={12} color="$colorMuted">
                                    Help improve the app with anonymous usage data
                                </Text>
                            </YStack>
                            <Switch
                                checked={settings?.privacy.analytics ?? true}
                                onCheckedChange={(value) => handlePrivacyToggle('analytics', value)}
                            />
                        </XStack>

                        <XStack justifyContent="space-between" alignItems="center">
                            <YStack>
                                <Text color="$color">Crash Reporting</Text>
                                <Text fontSize={12} color="$colorMuted">
                                    Send crash reports to help fix bugs
                                </Text>
                            </YStack>
                            <Switch
                                checked={settings?.privacy.crashReporting ?? true}
                                onCheckedChange={(value) => handlePrivacyToggle('crashReporting', value)}
                            />
                        </XStack>
                    </CardContent>
                </Card>

                {/* Account Actions */}
                <Card>
                    <CardHeader>
                        <Text fontSize={16} fontWeight="600" color="$color">
                            Account
                        </Text>
                    </CardHeader>
                    <CardContent gap="$3">
                        <Button variant="secondary" fullWidth onPress={handleSignOut}>
                            Sign Out
                        </Button>
                        <Button variant="danger" fullWidth disabled>
                            Delete Account
                        </Button>
                        <Text fontSize={12} color="$colorMuted" textAlign="center">
                            Account deletion is not yet available
                        </Text>
                    </CardContent>
                </Card>
            </YStack>
        </Layout>
    );
}
