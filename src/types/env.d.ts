// Environment variable type declarations

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // Firebase Configuration
            EXPO_PUBLIC_FIREBASE_API_KEY: string;
            EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
            EXPO_PUBLIC_FIREBASE_PROJECT_ID: string;
            EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
            EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
            EXPO_PUBLIC_FIREBASE_APP_ID: string;
            EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID?: string;

            // Feature Flags
            EXPO_PUBLIC_USE_EMULATORS: string;

            // Node environment
            NODE_ENV: 'development' | 'production' | 'test';
        }
    }
}

export { };
