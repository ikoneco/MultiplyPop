module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                '@tamagui/babel-plugin',
                {
                    components: ['tamagui'],
                    config: './tamagui.config.ts',
                    logTimings: true,
                    disableExtraction: process.env.NODE_ENV === 'development',
                },
            ],
            [
                'module-resolver',
                {
                    alias: {
                        '@': './src',
                        '@components': './src/components',
                        '@design': './src/design',
                        '@data': './src/data',
                        '@features': './src/features',
                        '@hooks': './src/hooks',
                        '@lib': './src/lib',
                        '@state': './src/state',
                        '@types': './src/types',
                    },
                },
            ],
            'react-native-reanimated/plugin',
        ],
    };
};
