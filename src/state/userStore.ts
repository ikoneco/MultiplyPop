import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthUser } from '@/types/user';

/**
 * User Store State Interface
 */
interface UserState {
    // State
    user: AuthUser | null;
    isHydrated: boolean;

    // Actions
    setUser: (user: AuthUser | null) => void;
    clearUser: () => void;
    updateUser: (updates: Partial<AuthUser>) => void;
    setHydrated: (hydrated: boolean) => void;
}

/**
 * User Store with persistence
 */
export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            isHydrated: false,

            // Actions
            setUser: (user) => set({ user }),

            clearUser: () => set({ user: null }),

            updateUser: (updates) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({
                        user: {
                            ...currentUser,
                            ...updates,
                        },
                    });
                }
            },

            setHydrated: (hydrated) => set({ isHydrated: hydrated }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ user: state.user }), // Only persist user
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            },
        }
    )
);

/**
 * Selectors for optimized re-renders
 */
export const selectUser = (state: UserState) => state.user;
export const selectIsLoggedIn = (state: UserState) => state.user !== null;
export const selectUserEmail = (state: UserState) => state.user?.email;
export const selectUserId = (state: UserState) => state.user?.id;
export const selectIsHydrated = (state: UserState) => state.isHydrated;

/**
 * Hook to check if user is logged in (convenience)
 */
export function useIsLoggedIn(): boolean {
    return useUserStore(selectIsLoggedIn);
}

/**
 * Hook to get current user
 */
export function useCurrentUser(): AuthUser | null {
    return useUserStore(selectUser);
}

/**
 * Hook to check hydration status
 */
export function useIsHydrated(): boolean {
    return useUserStore(selectIsHydrated);
}
