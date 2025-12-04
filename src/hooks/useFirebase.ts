import { useCallback } from 'react';
import { auth, db, storage, analytics } from '@/lib/firebase';

/**
 * Hook to access Firebase instances
 */
export function useFirebase() {
    return {
        auth,
        db,
        storage,
        analytics,
    };
}

/**
 * Hook to get the current Firebase user directly
 */
export function useFirebaseUser() {
    return auth.currentUser;
}
