import { z } from 'zod';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    Timestamp,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { logger } from '@/lib/logger';

/**
 * Session state schema
 */
export const SessionSchema = z.object({
    id: z.string().min(1),
    userId: z.string().min(1),
    deviceId: z.string().optional(),
    platform: z.enum(['web', 'ios', 'android']),
    lastActive: z.date(),
    createdAt: z.date(),
    expiresAt: z.date().optional(),
    isActive: z.boolean(),
});

export type Session = z.infer<typeof SessionSchema>;

/**
 * Firestore document shape
 */
interface SessionDoc {
    userId: string;
    deviceId?: string;
    platform: 'web' | 'ios' | 'android';
    lastActive: Timestamp;
    createdAt: Timestamp;
    expiresAt?: Timestamp;
    isActive: boolean;
}

/**
 * Convert Firestore document to domain Session object
 */
function toSession(id: string, data: SessionDoc): Session {
    const sessionData = {
        id,
        userId: data.userId,
        deviceId: data.deviceId,
        platform: data.platform,
        lastActive: data.lastActive.toDate(),
        createdAt: data.createdAt.toDate(),
        expiresAt: data.expiresAt?.toDate(),
        isActive: data.isActive,
    };

    const result = SessionSchema.safeParse(sessionData);

    if (!result.success) {
        logger.error('Session validation failed', {
            id,
            errors: result.error.errors.map((e) => e.message),
        });
        throw new Error(`Invalid session data: ${result.error.message}`);
    }

    return result.data;
}

/**
 * Get a session by ID
 */
export async function getSession(sessionId: string): Promise<Session | null> {
    try {
        const docRef = doc(db, 'sessions', sessionId);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
            return null;
        }

        return toSession(snapshot.id, snapshot.data() as SessionDoc);
    } catch (error) {
        logger.error('Failed to get session', { sessionId, error });
        throw error;
    }
}

/**
 * Create a new session
 */
export async function createSession(
    userId: string,
    platform: 'web' | 'ios' | 'android',
    deviceId?: string
): Promise<Session> {
    try {
        const sessionRef = doc(collection(db, 'sessions'));
        const now = serverTimestamp();

        const sessionData = {
            userId,
            deviceId,
            platform,
            lastActive: now,
            createdAt: now,
            isActive: true,
        };

        await setDoc(sessionRef, sessionData);
        logger.info('Session created', { sessionId: sessionRef.id, userId, platform });

        // Fetch back to get resolved timestamps
        const session = await getSession(sessionRef.id);
        if (!session) {
            throw new Error('Failed to retrieve created session');
        }

        return session;
    } catch (error) {
        logger.error('Failed to create session', { userId, platform, error });
        throw error;
    }
}

/**
 * Update session last active time
 */
export async function touchSession(sessionId: string): Promise<void> {
    try {
        const docRef = doc(db, 'sessions', sessionId);
        await updateDoc(docRef, {
            lastActive: serverTimestamp(),
        });
        logger.debug('Session touched', { sessionId });
    } catch (error) {
        logger.error('Failed to touch session', { sessionId, error });
        throw error;
    }
}

/**
 * End a session
 */
export async function endSession(sessionId: string): Promise<void> {
    try {
        const docRef = doc(db, 'sessions', sessionId);
        await updateDoc(docRef, {
            isActive: false,
            lastActive: serverTimestamp(),
        });
        logger.info('Session ended', { sessionId });
    } catch (error) {
        logger.error('Failed to end session', { sessionId, error });
        throw error;
    }
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, 'sessions', sessionId));
        logger.info('Session deleted', { sessionId });
    } catch (error) {
        logger.error('Failed to delete session', { sessionId, error });
        throw error;
    }
}

/**
 * Get active sessions for a user
 */
export async function getUserActiveSessions(
    userId: string,
    maxResults = 10
): Promise<Session[]> {
    try {
        const sessionsRef = collection(db, 'sessions');
        const q = query(
            sessionsRef,
            where('userId', '==', userId),
            where('isActive', '==', true),
            orderBy('lastActive', 'desc'),
            limit(maxResults)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => toSession(doc.id, doc.data() as SessionDoc));
    } catch (error) {
        logger.error('Failed to get user sessions', { userId, error });
        throw error;
    }
}

/**
 * End all sessions for a user (logout everywhere)
 */
export async function endAllUserSessions(userId: string): Promise<void> {
    try {
        const sessions = await getUserActiveSessions(userId, 100);

        for (const session of sessions) {
            await endSession(session.id);
        }

        logger.info('All user sessions ended', { userId, count: sessions.length });
    } catch (error) {
        logger.error('Failed to end all user sessions', { userId, error });
        throw error;
    }
}
