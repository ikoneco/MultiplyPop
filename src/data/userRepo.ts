import { z } from 'zod';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { logger } from '@/lib/logger';
import type { User } from '@/types/user';

/**
 * Zod schema for User validation
 */
export const UserSchema = z.object({
    id: z.string().min(1),
    email: z.string().email(),
    displayName: z.string().optional(),
    photoURL: z.string().url().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

/**
 * Firestore document shape
 */
interface UserDoc {
    email: string;
    displayName?: string;
    photoURL?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Convert Firestore document to domain User object
 */
function toUser(id: string, data: UserDoc): User {
    const userData = {
        id,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
    };

    const result = UserSchema.safeParse(userData);

    if (!result.success) {
        logger.error('User validation failed', {
            id,
            errors: result.error.errors.map((e) => e.message),
        });
        throw new Error(`Invalid user data: ${result.error.message}`);
    }

    return result.data;
}

/**
 * Get a user by ID
 */
export async function getUser(userId: string): Promise<User | null> {
    try {
        const docRef = doc(db, 'users', userId);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
            logger.debug('User not found', { userId });
            return null;
        }

        return toUser(snapshot.id, snapshot.data() as UserDoc);
    } catch (error) {
        logger.error('Failed to get user', { userId, error });
        throw error;
    }
}

/**
 * Create a new user
 */
export async function createUser(
    userId: string,
    email: string,
    displayName?: string,
    photoURL?: string
): Promise<User> {
    try {
        const now = serverTimestamp();
        const userData = {
            email,
            displayName,
            photoURL,
            createdAt: now,
            updatedAt: now,
        };

        await setDoc(doc(db, 'users', userId), userData);
        logger.info('User created', { userId, email });

        // Fetch back to get resolved timestamps
        const user = await getUser(userId);
        if (!user) {
            throw new Error('Failed to retrieve created user');
        }

        return user;
    } catch (error) {
        logger.error('Failed to create user', { userId, email, error });
        throw error;
    }
}

/**
 * Update an existing user
 */
export async function updateUser(
    userId: string,
    updates: Partial<Pick<User, 'displayName' | 'photoURL'>>
): Promise<User> {
    try {
        const docRef = doc(db, 'users', userId);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
        logger.info('User updated', { userId, updates });

        const user = await getUser(userId);
        if (!user) {
            throw new Error('Failed to retrieve updated user');
        }

        return user;
    } catch (error) {
        logger.error('Failed to update user', { userId, updates, error });
        throw error;
    }
}

/**
 * Delete a user
 */
export async function deleteUser(userId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, 'users', userId));
        logger.info('User deleted', { userId });
    } catch (error) {
        logger.error('Failed to delete user', { userId, error });
        throw error;
    }
}

/**
 * Check if a user exists
 */
export async function userExists(userId: string): Promise<boolean> {
    try {
        const docRef = doc(db, 'users', userId);
        const snapshot = await getDoc(docRef);
        return snapshot.exists();
    } catch (error) {
        logger.error('Failed to check user existence', { userId, error });
        throw error;
    }
}

/**
 * Create user if not exists (upsert on first login)
 */
export async function ensureUserExists(
    userId: string,
    email: string,
    displayName?: string,
    photoURL?: string
): Promise<User> {
    const exists = await userExists(userId);

    if (exists) {
        const user = await getUser(userId);
        if (!user) {
            throw new Error('User exists but could not be retrieved');
        }
        return user;
    }

    return createUser(userId, email, displayName, photoURL);
}
