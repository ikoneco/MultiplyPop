import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUserStore, selectUser, selectIsLoggedIn, selectUserEmail } from '@/state/userStore';
import type { AuthUser } from '@/types/user';

describe('userStore', () => {
    beforeEach(() => {
        // Reset store state before each test
        useUserStore.setState({ user: null, isHydrated: false });
    });

    describe('initial state', () => {
        it('should have null user initially', () => {
            const state = useUserStore.getState();
            expect(state.user).toBeNull();
        });

        it('should not be hydrated initially', () => {
            const state = useUserStore.getState();
            expect(state.isHydrated).toBe(false);
        });
    });

    describe('setUser action', () => {
        it('should set user correctly', () => {
            const mockUser: AuthUser = {
                id: 'user-123',
                email: 'test@example.com',
                displayName: 'Test User',
                photoURL: 'https://example.com/photo.jpg',
            };

            useUserStore.getState().setUser(mockUser);

            const state = useUserStore.getState();
            expect(state.user).toEqual(mockUser);
        });

        it('should set user to null', () => {
            // First set a user
            const mockUser: AuthUser = {
                id: 'user-123',
                email: 'test@example.com',
            };
            useUserStore.getState().setUser(mockUser);

            // Then set to null
            useUserStore.getState().setUser(null);

            const state = useUserStore.getState();
            expect(state.user).toBeNull();
        });
    });

    describe('clearUser action', () => {
        it('should clear user', () => {
            // First set a user
            const mockUser: AuthUser = {
                id: 'user-123',
                email: 'test@example.com',
            };
            useUserStore.getState().setUser(mockUser);

            // Then clear
            useUserStore.getState().clearUser();

            const state = useUserStore.getState();
            expect(state.user).toBeNull();
        });
    });

    describe('updateUser action', () => {
        it('should update user properties', () => {
            // First set a user
            const mockUser: AuthUser = {
                id: 'user-123',
                email: 'test@example.com',
                displayName: 'Old Name',
            };
            useUserStore.getState().setUser(mockUser);

            // Update display name
            useUserStore.getState().updateUser({ displayName: 'New Name' });

            const state = useUserStore.getState();
            expect(state.user?.displayName).toBe('New Name');
            expect(state.user?.email).toBe('test@example.com'); // unchanged
        });

        it('should do nothing if no user is set', () => {
            useUserStore.getState().updateUser({ displayName: 'New Name' });

            const state = useUserStore.getState();
            expect(state.user).toBeNull();
        });
    });

    describe('setHydrated action', () => {
        it('should set hydrated to true', () => {
            useUserStore.getState().setHydrated(true);

            const state = useUserStore.getState();
            expect(state.isHydrated).toBe(true);
        });

        it('should set hydrated to false', () => {
            useUserStore.getState().setHydrated(true);
            useUserStore.getState().setHydrated(false);

            const state = useUserStore.getState();
            expect(state.isHydrated).toBe(false);
        });
    });

    describe('selectors', () => {
        it('selectUser should return user', () => {
            const mockUser: AuthUser = {
                id: 'user-123',
                email: 'test@example.com',
            };
            useUserStore.setState({ user: mockUser });

            const state = useUserStore.getState();
            expect(selectUser(state)).toEqual(mockUser);
        });

        it('selectIsLoggedIn should return true when user exists', () => {
            const mockUser: AuthUser = {
                id: 'user-123',
                email: 'test@example.com',
            };
            useUserStore.setState({ user: mockUser });

            const state = useUserStore.getState();
            expect(selectIsLoggedIn(state)).toBe(true);
        });

        it('selectIsLoggedIn should return false when user is null', () => {
            useUserStore.setState({ user: null });

            const state = useUserStore.getState();
            expect(selectIsLoggedIn(state)).toBe(false);
        });

        it('selectUserEmail should return email', () => {
            const mockUser: AuthUser = {
                id: 'user-123',
                email: 'test@example.com',
            };
            useUserStore.setState({ user: mockUser });

            const state = useUserStore.getState();
            expect(selectUserEmail(state)).toBe('test@example.com');
        });

        it('selectUserEmail should return undefined when user is null', () => {
            useUserStore.setState({ user: null });

            const state = useUserStore.getState();
            expect(selectUserEmail(state)).toBeUndefined();
        });
    });
});
