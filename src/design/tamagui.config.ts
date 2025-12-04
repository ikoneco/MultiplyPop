import { createTamagui, createFont } from '@tamagui/core';
import { tokens } from './tokens';
import { lightTheme, darkTheme } from './themes';

// Create Inter-like font configuration
const interFont = createFont({
    family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    size: {
        1: 11,
        2: 12,
        3: 13,
        4: 14,
        5: 16,
        6: 18,
        7: 20,
        8: 24,
        9: 32,
        10: 40,
        11: 48,
        12: 56,
        true: 16,
    },
    lineHeight: {
        1: 14,
        2: 16,
        3: 18,
        4: 20,
        5: 24,
        6: 26,
        7: 28,
        8: 32,
        9: 40,
        10: 48,
        11: 56,
        12: 64,
        true: 24,
    },
    weight: {
        1: '400',
        2: '400',
        3: '400',
        4: '500',
        5: '500',
        6: '600',
        7: '600',
        8: '700',
        9: '800',
        true: '400',
    },
    letterSpacing: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: -0.2,
        7: -0.3,
        8: -0.4,
        9: -0.5,
        10: -0.6,
        11: -0.7,
        12: -0.8,
        true: 0,
    },
    face: {
        400: { normal: 'Inter' },
        500: { normal: 'Inter' },
        600: { normal: 'InterSemiBold' },
        700: { normal: 'InterBold' },
        800: { normal: 'InterBold' },
    },
});

const monoFont = createFont({
    family: '"SF Mono", "Fira Code", "Fira Mono", Menlo, Monaco, "Courier New", monospace',
    size: {
        1: 11,
        2: 12,
        3: 13,
        4: 14,
        5: 15,
        6: 16,
        true: 14,
    },
    lineHeight: {
        1: 16,
        2: 18,
        3: 20,
        4: 22,
        5: 24,
        6: 26,
        true: 22,
    },
    weight: {
        1: '400',
        2: '400',
        3: '400',
        4: '500',
        true: '400',
    },
    letterSpacing: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        true: 0,
    },
});

export const config = createTamagui({
    tokens,
    themes: {
        light: lightTheme,
        dark: darkTheme,
    },
    fonts: {
        heading: interFont,
        body: interFont,
        mono: monoFont,
    },
    defaultTheme: 'light',
    shouldAddPrefersColorThemes: true,
    themeClassNameOnRoot: true,

    // Shorthands for common style props
    shorthands: {
        // Spacing
        m: 'margin',
        mt: 'marginTop',
        mr: 'marginRight',
        mb: 'marginBottom',
        ml: 'marginLeft',
        mx: 'marginHorizontal',
        my: 'marginVertical',
        p: 'padding',
        pt: 'paddingTop',
        pr: 'paddingRight',
        pb: 'paddingBottom',
        pl: 'paddingLeft',
        px: 'paddingHorizontal',
        py: 'paddingVertical',

        // Sizing
        w: 'width',
        h: 'height',
        minW: 'minWidth',
        maxW: 'maxWidth',
        minH: 'minHeight',
        maxH: 'maxHeight',

        // Colors
        bg: 'backgroundColor',

        // Border
        br: 'borderRadius',
        bw: 'borderWidth',
        bc: 'borderColor',

        // Flex
        f: 'flex',
        ai: 'alignItems',
        jc: 'justifyContent',
        fw: 'flexWrap',
        fd: 'flexDirection',
        fb: 'flexBasis',
        fg: 'flexGrow',
        fs: 'flexShrink',
    } as const,

    // Media queries for responsive design
    media: {
        xs: { maxWidth: 480 },
        sm: { maxWidth: 640 },
        md: { maxWidth: 768 },
        lg: { maxWidth: 1024 },
        xl: { maxWidth: 1280 },
        xxl: { maxWidth: 1536 },
        gtXs: { minWidth: 481 },
        gtSm: { minWidth: 641 },
        gtMd: { minWidth: 769 },
        gtLg: { minWidth: 1025 },
        gtXl: { minWidth: 1281 },
        short: { maxHeight: 700 },
        tall: { minHeight: 701 },
        hoverNone: { hover: 'none' },
        pointerCoarse: { pointer: 'coarse' },
    },

    // Animation settings
    settings: {
        allowedStyleValues: 'somewhat-strict-web',
        autocompleteSpecificTokens: 'except-special',
    },
});

// Export the config type for type-safety
export type AppConfig = typeof config;

// Declare module augmentation for Tamagui
declare module 'tamagui' {
    interface TamaguiCustomConfig extends AppConfig { }
}
