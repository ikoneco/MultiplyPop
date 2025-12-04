import { beforeEach, vi } from 'vitest';

// Define __DEV__ global for React Native compatibility
(globalThis as any).__DEV__ = true;

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
    default: {
        getItem: vi.fn(() => Promise.resolve(null)),
        setItem: vi.fn(() => Promise.resolve()),
        removeItem: vi.fn(() => Promise.resolve()),
        clear: vi.fn(() => Promise.resolve()),
        getAllKeys: vi.fn(() => Promise.resolve([])),
        multiGet: vi.fn(() => Promise.resolve([])),
        multiSet: vi.fn(() => Promise.resolve()),
        multiRemove: vi.fn(() => Promise.resolve()),
    },
}));

// Mock Firebase modules
vi.mock('@/lib/firebase', () => ({
    firebaseApp: {},
    auth: {
        currentUser: null,
        onAuthStateChanged: vi.fn((callback) => {
            callback(null);
            return () => { };
        }),
    },
    db: {},
    storage: {},
    analytics: null,
}));

// Mock React Native modules
vi.mock('react-native', () => ({
    Platform: {
        OS: 'web',
        select: (obj: Record<string, unknown>) => obj.web || obj.default,
    },
    Dimensions: {
        get: () => ({ width: 375, height: 812 }),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    },
}));

// Mock expo-router
vi.mock('expo-router', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
    }),
    useSegments: () => [],
    usePathname: () => '/',
    Link: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock react-native-safe-area-context
vi.mock('react-native-safe-area-context', () => ({
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Reset mocks between tests
beforeEach(() => {
    vi.clearAllMocks();
});

// Suppress console errors in tests (optional)
beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => { });
    vi.spyOn(console, 'warn').mockImplementation(() => { });
});
