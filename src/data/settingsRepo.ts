import { z } from 'zod';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { logger } from '@/lib/logger';

/**
 * Settings schema
 */
export const SettingsSchema = z.object({
    userId: z.string().min(1),
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.object({
        push: z.boolean().default(true),
        email: z.boolean().default(true),
        marketing: z.boolean().default(false),
    }),
    privacy: z.object({
        analytics: z.boolean().default(true),
        crashReporting: z.boolean().default(true),
    }),
    preferences: z.object({
        language: z.string().default('en'),
        timezone: z.string().optional(),
    }),
    updatedAt: z.date(),
});

export type Settings = z.infer<typeof SettingsSchema>;
export type SettingsUpdate = Partial<Omit<Settings, 'userId' | 'updatedAt'>>;

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: Omit<Settings, 'userId' | 'updatedAt'> = {
    theme: 'system',
    notifications: {
        push: true,
        email: true,
        marketing: false,
    },
    privacy: {
        analytics: true,
        crashReporting: true,
    },
    preferences: {
        language: 'en',
    },
};

/**
 * Firestore document shape
 */
interface SettingsDoc {
    theme: 'light' | 'dark' | 'system';
    notifications: {
        push: boolean;
        email: boolean;
        marketing: boolean;
    };
    privacy: {
        analytics: boolean;
        crashReporting: boolean;
    };
    preferences: {
        language: string;
        timezone?: string;
    };
    updatedAt: Timestamp;
}

/**
 * Convert Firestore document to domain Settings object
 */
function toSettings(userId: string, data: SettingsDoc): Settings {
    const settingsData = {
        userId,
        theme: data.theme,
        notifications: data.notifications,
        privacy: data.privacy,
        preferences: data.preferences,
        updatedAt: data.updatedAt.toDate(),
    };

    const result = SettingsSchema.safeParse(settingsData);

    if (!result.success) {
        logger.error('Settings validation failed', {
            userId,
            errors: result.error.errors.map((e) => e.message),
        });
        throw new Error(`Invalid settings data: ${result.error.message}`);
    }

    return result.data;
}

/**
 * Get settings for a user
 */
export async function getSettings(userId: string): Promise<Settings | null> {
    try {
        const docRef = doc(db, 'settings', userId);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
            return null;
        }

        return toSettings(userId, snapshot.data() as SettingsDoc);
    } catch (error) {
        logger.error('Failed to get settings', { userId, error });
        throw error;
    }
}

/**
 * Create default settings for a user
 */
export async function createSettings(userId: string): Promise<Settings> {
    try {
        const settingsData = {
            ...DEFAULT_SETTINGS,
            updatedAt: serverTimestamp(),
        };

        await setDoc(doc(db, 'settings', userId), settingsData);
        logger.info('Settings created', { userId });

        const settings = await getSettings(userId);
        if (!settings) {
            throw new Error('Failed to retrieve created settings');
        }

        return settings;
    } catch (error) {
        logger.error('Failed to create settings', { userId, error });
        throw error;
    }
}

/**
 * Update settings for a user
 */
export async function updateSettings(
    userId: string,
    updates: SettingsUpdate
): Promise<Settings> {
    try {
        const docRef = doc(db, 'settings', userId);

        // Flatten nested updates for Firestore
        const flatUpdates: Record<string, unknown> = { updatedAt: serverTimestamp() };

        if (updates.theme !== undefined) {
            flatUpdates.theme = updates.theme;
        }

        if (updates.notifications) {
            for (const [key, value] of Object.entries(updates.notifications)) {
                flatUpdates[`notifications.${key}`] = value;
            }
        }

        if (updates.privacy) {
            for (const [key, value] of Object.entries(updates.privacy)) {
                flatUpdates[`privacy.${key}`] = value;
            }
        }

        if (updates.preferences) {
            for (const [key, value] of Object.entries(updates.preferences)) {
                flatUpdates[`preferences.${key}`] = value;
            }
        }

        await updateDoc(docRef, flatUpdates);
        logger.info('Settings updated', { userId, updates: Object.keys(updates) });

        const settings = await getSettings(userId);
        if (!settings) {
            throw new Error('Failed to retrieve updated settings');
        }

        return settings;
    } catch (error) {
        logger.error('Failed to update settings', { userId, error });
        throw error;
    }
}

/**
 * Get or create settings for a user
 */
export async function ensureSettings(userId: string): Promise<Settings> {
    const existing = await getSettings(userId);
    if (existing) {
        return existing;
    }
    return createSettings(userId);
}

/**
 * Update theme setting
 */
export async function updateTheme(
    userId: string,
    theme: 'light' | 'dark' | 'system'
): Promise<Settings> {
    return updateSettings(userId, { theme });
}

/**
 * Update notification settings
 */
export async function updateNotifications(
    userId: string,
    notifications: Partial<Settings['notifications']>
): Promise<Settings> {
    return updateSettings(userId, { notifications });
}

/**
 * Update privacy settings
 */
export async function updatePrivacy(
    userId: string,
    privacy: Partial<Settings['privacy']>
): Promise<Settings> {
    return updateSettings(userId, { privacy });
}
