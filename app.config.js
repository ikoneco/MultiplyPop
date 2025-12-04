module.exports = {
    name: 'MultiplyPop',
    slug: 'multiply-pop',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    scheme: 'multiplypop',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
        image: './assets/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#6366F1',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.multiplypop.app',
        config: {
            usesNonExemptEncryption: false,
        },
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#6366F1',
        },
        package: 'com.multiplypop.app',
        edgeToEdgeEnabled: true,
    },
    web: {
        bundler: 'metro',
        output: 'single',
        favicon: './assets/favicon.png',
    },
    plugins: [
        'expo-router',
        'expo-web-browser',
        [
            'expo-updates',
            {
                username: 'multiplypop',
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        router: {
            origin: false,
        },
        eas: {
            projectId: 'your-eas-project-id',
        },
    },
    updates: {
        url: 'https://u.expo.dev/your-eas-project-id',
    },
    runtimeVersion: {
        policy: 'appVersion',
    },
};
