import React, { useState } from 'react';
import { Link } from 'expo-router';
import { YStack, XStack, Text, Input, H1 } from 'tamagui';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { useAuth } from '@/hooks/useAuth';

export default function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signInWithEmail, signInWithGoogle, isLoading, error, clearError } = useAuth();

    const handleEmailSignIn = async () => {
        if (!email || !password) return;
        try {
            await signInWithEmail(email, password);
        } catch {
            // Error is handled in hook
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch {
            // Error is handled in hook
        }
    };

    return (
        <Layout centered>
            <YStack width="100%" maxWidth={400} padding="$4" gap="$4">
                <YStack alignItems="center" marginBottom="$4">
                    <H1 color="$color">Welcome Back</H1>
                    <Text color="$colorMuted">Sign in to continue</Text>
                </YStack>

                <Card variant="elevated">
                    <CardContent gap="$4">
                        {error && (
                            <YStack
                                backgroundColor="$errorBackground"
                                padding="$3"
                                borderRadius="$2"
                            >
                                <Text color="$error" fontSize={14}>
                                    {error}
                                </Text>
                            </YStack>
                        )}

                        <YStack gap="$2">
                            <Text fontWeight="500">Email</Text>
                            <Input
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    clearError();
                                }}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                            />
                        </YStack>

                        <YStack gap="$2">
                            <Text fontWeight="500">Password</Text>
                            <Input
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    clearError();
                                }}
                                placeholder="Enter your password"
                                secureTextEntry
                                autoComplete="password"
                            />
                        </YStack>

                        <Button
                            fullWidth
                            onPress={handleEmailSignIn}
                            loading={isLoading}
                            disabled={!email || !password}
                        >
                            Sign In
                        </Button>

                        <XStack alignItems="center" gap="$3">
                            <YStack flex={1} height={1} backgroundColor="$borderColor" />
                            <Text color="$colorMuted" fontSize={12}>
                                OR
                            </Text>
                            <YStack flex={1} height={1} backgroundColor="$borderColor" />
                        </XStack>

                        <Button
                            variant="secondary"
                            fullWidth
                            onPress={handleGoogleSignIn}
                            loading={isLoading}
                        >
                            Continue with Google
                        </Button>
                    </CardContent>
                </Card>

                <XStack justifyContent="center" gap="$2">
                    <Text color="$colorMuted">Don't have an account?</Text>
                    <Link href="/(auth)/sign-up" asChild>
                        <Text color="$primary" fontWeight="600" cursor="pointer">
                            Sign Up
                        </Text>
                    </Link>
                </XStack>
            </YStack>
        </Layout>
    );
}
