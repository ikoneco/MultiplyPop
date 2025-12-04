import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/tests/setup.ts'],
        include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/**',
                'src/tests/**',
                '**/*.d.ts',
            ],
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@components': resolve(__dirname, './src/components'),
            '@design': resolve(__dirname, './src/design'),
            '@data': resolve(__dirname, './src/data'),
            '@features': resolve(__dirname, './src/features'),
            '@hooks': resolve(__dirname, './src/hooks'),
            '@lib': resolve(__dirname, './src/lib'),
            '@state': resolve(__dirname, './src/state'),
            '@types': resolve(__dirname, './src/types'),
        },
    },
});
