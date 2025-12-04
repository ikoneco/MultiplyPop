import { createTokens } from 'tamagui';

export const tokens = createTokens({
    color: {
        // Brand Colors
        primary: '#6366F1',
        primaryDark: '#4F46E5',
        primaryLight: '#818CF8',
        primaryMuted: '#C7D2FE',

        // Background Colors
        background: '#FFFFFF',
        backgroundDark: '#0F172A',
        surface: '#F8FAFC',
        surfaceDark: '#1E293B',
        surfaceHover: '#F1F5F9',
        surfaceHoverDark: '#334155',

        // Text Colors
        text: '#0F172A',
        textDark: '#F8FAFC',
        textMuted: '#64748B',
        textMutedDark: '#94A3B8',

        // Border Colors
        border: '#E2E8F0',
        borderDark: '#334155',
        borderFocus: '#6366F1',

        // Status Colors
        success: '#22C55E',
        successLight: '#DCFCE7',
        warning: '#F59E0B',
        warningLight: '#FEF3C7',
        error: '#EF4444',
        errorLight: '#FEE2E2',
        info: '#3B82F6',
        infoLight: '#DBEAFE',

        // Transparent
        transparent: 'transparent',
    },

    space: {
        0: 0,
        0.5: 2,
        1: 4,
        1.5: 6,
        2: 8,
        2.5: 10,
        3: 12,
        3.5: 14,
        4: 16,
        5: 20,
        6: 24,
        7: 28,
        8: 32,
        9: 36,
        10: 40,
        11: 44,
        12: 48,
        14: 56,
        16: 64,
        20: 80,
        24: 96,
        28: 112,
        32: 128,
        true: 16, // Default spacing
    },

    size: {
        0: 0,
        0.25: 2,
        0.5: 4,
        0.75: 8,
        1: 20,
        1.5: 24,
        2: 28,
        3: 32,
        4: 36,
        5: 40,
        6: 48,
        7: 56,
        8: 64,
        9: 72,
        10: 80,
        11: 96,
        12: 128,
        true: 40, // Default size
    },

    radius: {
        0: 0,
        1: 2,
        2: 4,
        3: 6,
        4: 8,
        5: 10,
        6: 12,
        7: 14,
        8: 16,
        9: 18,
        10: 20,
        11: 24,
        12: 28,
        true: 8, // Default radius
    },

    zIndex: {
        0: 0,
        1: 100,
        2: 200,
        3: 300,
        4: 400,
        5: 500,
    },
});

export type AppTokens = typeof tokens;
