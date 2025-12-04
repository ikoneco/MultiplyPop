import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
    getAuth,
    connectAuthEmulator,
    Auth,
    initializeAuth,
    getReactNativePersistence,
} from 'firebase/auth';
import {
    getFirestore,
    connectFirestoreEmulator,
    Firestore,
} from 'firebase/firestore';
import {
    getStorage,
    connectStorageEmulator,
    FirebaseStorage,
} from 'firebase/storage';
import {
    getAnalytics,
    isSupported,
    Analytics,
} from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { logger } from './logger';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if we should use emulators
const useEmulators = process.env.EXPO_PUBLIC_USE_EMULATORS === 'true';

// Initialize Firebase app (singleton pattern)
let firebaseApp: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

function initializeFirebase(): void {
    // Check if already initialized
    if (getApps().length > 0) {
        firebaseApp = getApps()[0];
        auth = getAuth(firebaseApp);
        db = getFirestore(firebaseApp);
        storage = getStorage(firebaseApp);
        return;
    }

    // Validate configuration
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        logger.warn('Firebase configuration is incomplete. Using placeholder values.');
    }

    // Initialize Firebase app
    firebaseApp = initializeApp(firebaseConfig);

    // Initialize Auth with persistence
    if (Platform.OS === 'web') {
        auth = getAuth(firebaseApp);
    } else {
        auth = initializeAuth(firebaseApp, {
            persistence: getReactNativePersistence(AsyncStorage),
        });
    }

    // Initialize Firestore
    db = getFirestore(firebaseApp);

    // Initialize Storage
    storage = getStorage(firebaseApp);

    // Connect to emulators in development
    if (useEmulators && __DEV__) {
        try {
            connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
            connectFirestoreEmulator(db, 'localhost', 8080);
            connectStorageEmulator(storage, 'localhost', 9199);
            logger.info('Connected to Firebase Emulator Suite');
        } catch (error) {
            logger.error('Failed to connect to emulators', { error });
        }
    }

    // Initialize Analytics (web only, async)
    initializeAnalytics();

    logger.info('Firebase initialized', {
        projectId: firebaseConfig.projectId,
        useEmulators,
    });
}

async function initializeAnalytics(): Promise<void> {
    try {
        const supported = await isSupported();
        if (supported) {
            analytics = getAnalytics(firebaseApp);
            logger.info('Firebase Analytics initialized');
        }
    } catch (error) {
        logger.warn('Firebase Analytics not supported', { error });
    }
}

// Initialize on module load
initializeFirebase();

// Export initialized instances
export { firebaseApp, auth, db, storage, analytics };

// Export types for convenience
export type { FirebaseApp, Auth, Firestore, FirebaseStorage, Analytics };
