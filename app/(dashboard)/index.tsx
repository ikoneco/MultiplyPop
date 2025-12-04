import React from 'react';
import { Link } from 'expo-router';
import { YStack, XStack, Text, H1, H2 } from 'tamagui';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/Card';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardScreen() {
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch {
            // Error handled in hook
        }
    };

    return (
        <Layout safeArea padded>
            <YStack flex={1} gap="$4">
                {/* Header */}
                <XStack justifyContent="space-between" alignItems="center">
                    <YStack>
                        <Text color="$colorMuted">Welcome back,</Text>
                        <H1 color="$color">{user?.displayName || user?.email}</H1>
                    </YStack>
                    <Button variant="ghost" size="sm" onPress={handleSignOut}>
                        Sign Out
                    </Button>
                </XStack>

                {/* Quick Stats */}
                <XStack gap="$4" flexWrap="wrap">
                    <Card variant="elevated" flex={1} minWidth={150}>
                        <CardContent alignItems="center">
                            <Text fontSize={32} fontWeight="700" color="$primary">
                                0
                            </Text>
                            <Text color="$colorMuted">Projects</Text>
                        </CardContent>
                    </Card>

                    <Card variant="elevated" flex={1} minWidth={150}>
                        <CardContent alignItems="center">
                            <Text fontSize={32} fontWeight="700" color="$success">
                                0
                            </Text>
                            <Text color="$colorMuted">Completed</Text>
                        </CardContent>
                    </Card>

                    <Card variant="elevated" flex={1} minWidth={150}>
                        <CardContent alignItems="center">
                            <Text fontSize={32} fontWeight="700" color="$warning">
                                0
                            </Text>
                            <Text color="$colorMuted">In Progress</Text>
                        </CardContent>
                    </Card>
                </XStack>

                {/* Getting Started Card */}
                <Card variant="filled">
                    <CardHeader>
                        <H2 fontSize={18} color="$color">
                            Getting Started
                        </H2>
                    </CardHeader>
                    <CardContent gap="$3">
                        <Text color="$colorMuted">
                            Welcome to MultiplyPop! This is your dashboard where you can
                            manage your projects and settings.
                        </Text>
                        <YStack gap="$2">
                            <XStack alignItems="center" gap="$2">
                                <YStack
                                    width={24}
                                    height={24}
                                    borderRadius="$full"
                                    backgroundColor="$primaryMuted"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Text fontSize={12} fontWeight="700" color="$primary">
                                        1
                                    </Text>
                                </YStack>
                                <Text color="$color">Configure your Firebase project</Text>
                            </XStack>
                            <XStack alignItems="center" gap="$2">
                                <YStack
                                    width={24}
                                    height={24}
                                    borderRadius="$full"
                                    backgroundColor="$primaryMuted"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Text fontSize={12} fontWeight="700" color="$primary">
                                        2
                                    </Text>
                                </YStack>
                                <Text color="$color">Update your profile settings</Text>
                            </XStack>
                            <XStack alignItems="center" gap="$2">
                                <YStack
                                    width={24}
                                    height={24}
                                    borderRadius="$full"
                                    backgroundColor="$primaryMuted"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Text fontSize={12} fontWeight="700" color="$primary">
                                        3
                                    </Text>
                                </YStack>
                                <Text color="$color">Start building your features</Text>
                            </XStack>
                        </YStack>
                    </CardContent>
                    <CardFooter>
                        <Link href="/(dashboard)/profile" asChild>
                            <Button size="sm">Edit Profile</Button>
                        </Link>
                        <Link href="/(dashboard)/settings" asChild>
                            <Button variant="secondary" size="sm">
                                Settings
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>

                {/* Navigation Links */}
                <XStack gap="$4" marginTop="$4">
                    <Link href="/(dashboard)/profile" asChild>
                        <Card interactive flex={1}>
                            <CardContent alignItems="center" gap="$2">
                                <Text fontSize={24}>👤</Text>
                                <Text fontWeight="600" color="$color">
                                    Profile
                                </Text>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/(dashboard)/settings" asChild>
                        <Card interactive flex={1}>
                            <CardContent alignItems="center" gap="$2">
                                <Text fontSize={24}>⚙️</Text>
                                <Text fontWeight="600" color="$color">
                                    Settings
                                </Text>
                            </CardContent>
                        </Card>
                    </Link>
                </XStack>
            </YStack>
        </Layout>
    );
}
