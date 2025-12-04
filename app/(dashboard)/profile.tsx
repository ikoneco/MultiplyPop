import React, { useState } from 'react';
import { Link } from 'expo-router';
import { YStack, XStack, Text, H1, Input, Avatar } from 'tamagui';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/Card';
import { useAuth } from '@/hooks/useAuth';
import { updateUser } from '@/data/userRepo';
import { logger } from '@/lib/logger';

export default function ProfileScreen() {
    const { user } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSave = async () => {
        if (!user) return;

        setIsSaving(true);
        setMessage(null);

        try {
            await updateUser(user.id, { displayName: displayName || undefined });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } catch (error) {
            logger.error('Failed to update profile', { error });
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setDisplayName(user?.displayName || '');
        setIsEditing(false);
        setMessage(null);
    };

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
                        Profile
                    </H1>
                </XStack>

                {/* Profile Card */}
                <Card variant="elevated">
                    <CardHeader>
                        <XStack alignItems="center" gap="$4">
                            <Avatar circular size="$8">
                                <Avatar.Image
                                    source={{ uri: user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || 'U')}&background=6366F1&color=fff` }}
                                />
                                <Avatar.Fallback backgroundColor="$primary">
                                    <Text color="white" fontSize={24} fontWeight="700">
                                        {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                                    </Text>
                                </Avatar.Fallback>
                            </Avatar>
                            <YStack flex={1}>
                                <Text fontSize={18} fontWeight="600" color="$color">
                                    {user?.displayName || 'No name set'}
                                </Text>
                                <Text color="$colorMuted">{user?.email}</Text>
                            </YStack>
                        </XStack>
                    </CardHeader>

                    <CardContent gap="$4">
                        {message && (
                            <YStack
                                backgroundColor={message.type === 'success' ? '$successBackground' : '$errorBackground'}
                                padding="$3"
                                borderRadius="$2"
                            >
                                <Text
                                    color={message.type === 'success' ? '$success' : '$error'}
                                    fontSize={14}
                                >
                                    {message.text}
                                </Text>
                            </YStack>
                        )}

                        <YStack gap="$2">
                            <Text fontWeight="500" color="$color">
                                Display Name
                            </Text>
                            {isEditing ? (
                                <Input
                                    value={displayName}
                                    onChangeText={setDisplayName}
                                    placeholder="Enter your name"
                                    autoFocus
                                />
                            ) : (
                                <Text color="$colorMuted" padding="$3" backgroundColor="$backgroundStrong" borderRadius="$2">
                                    {user?.displayName || 'Not set'}
                                </Text>
                            )}
                        </YStack>

                        <YStack gap="$2">
                            <Text fontWeight="500" color="$color">
                                Email
                            </Text>
                            <Text color="$colorMuted" padding="$3" backgroundColor="$backgroundStrong" borderRadius="$2">
                                {user?.email}
                            </Text>
                            <Text fontSize={12} color="$colorMuted">
                                Email cannot be changed here
                            </Text>
                        </YStack>

                        <YStack gap="$2">
                            <Text fontWeight="500" color="$color">
                                User ID
                            </Text>
                            <Text color="$colorMuted" padding="$3" backgroundColor="$backgroundStrong" borderRadius="$2" fontSize={12}>
                                {user?.id}
                            </Text>
                        </YStack>
                    </CardContent>

                    <CardFooter>
                        {isEditing ? (
                            <>
                                <Button variant="secondary" size="sm" onPress={handleCancel} disabled={isSaving}>
                                    Cancel
                                </Button>
                                <Button size="sm" onPress={handleSave} loading={isSaving}>
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button size="sm" onPress={() => setIsEditing(true)}>
                                Edit Profile
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                {/* Account Info */}
                <Card>
                    <CardHeader>
                        <Text fontSize={16} fontWeight="600" color="$color">
                            Account Information
                        </Text>
                    </CardHeader>
                    <CardContent gap="$3">
                        <XStack justifyContent="space-between">
                            <Text color="$colorMuted">Account Type</Text>
                            <Text color="$color">Free</Text>
                        </XStack>
                        <XStack justifyContent="space-between">
                            <Text color="$colorMuted">Member Since</Text>
                            <Text color="$color">Today</Text>
                        </XStack>
                    </CardContent>
                </Card>
            </YStack>
        </Layout>
    );
}
