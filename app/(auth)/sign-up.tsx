import React, { useState } from 'react';
import { Link } from 'expo-router';
import { YStack, XStack, Text, Input, H1 } from 'tamagui';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { useAuth } from '@/hooks/useAuth';

export default function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);
    const { signUpWithEmail, signInWithGoogle, isLoading, error, clearError } = useAuth();

    const handleEmailSignUp = async () => {
        if (!email || !password || !confirmPassword) return;

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        setLocalError(null);

        try {
            await signUpWithEmail(email, password);
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

    const displayError = localError || error;

    return (
        <Layout centered>
            <YStack width="100%" maxWidth={400} padding="$4" gap="$4">
                <YStack alignItems="center" marginBottom="$4">
                    <H1 color="$color">Create Account</H1>
                    <Text color="$colorMuted">Join us today</Text>
                </YStack>

                <Card variant="elevated">
                    <CardContent gap="$4">
                        {displayError && (
                            <YStack
                                backgroundColor="$errorBackground"
                                padding="$3"
                                borderRadius="$2"
                            >
                                <Text color="$error" fontSize={14}>
                                    {displayError}
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
                                    setLocalError(null);
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
                                    setLocalError(null);
                                }}
                                placeholder="Create a password"
                                secureTextEntry
                                autoComplete="new-password"
                            />
                        </YStack>

                        <YStack gap="$2">
                            <Text fontWeight="500">Confirm Password</Text>
                            <Input
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    clearError();
                                    setLocalError(null);
                                }}
                                placeholder="Confirm your password"
                                secureTextEntry
                                autoComplete="new-password"
                            />
                        </YStack>

                        <Button
                            fullWidth
                            onPress={handleEmailSignUp}
                            loading={isLoading}
                            disabled={!email || !password || !confirmPassword}
                        >
                            Create Account
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
                    <Text color="$colorMuted">Already have an account?</Text>
                    <Link href="/(auth)/sign-in" asChild>
                        <Text color="$primary" fontWeight="600" cursor="pointer">
                            Sign In
                        </Text>
                    </Link>
                </XStack>
            </YStack>
        </Layout>
    );
}
