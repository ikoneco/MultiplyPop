import { createTheme } from '@tamagui/core';
import { tokens } from './tokens';

// Light Theme
export const lightTheme = createTheme({
    // Backgrounds
    background: tokens.color.background,
    backgroundHover: tokens.color.surfaceHover,
    backgroundPress: tokens.color.surface,
    backgroundFocus: tokens.color.surface,
    backgroundStrong: tokens.color.surface,
    backgroundTransparent: tokens.color.transparent,

    // Text Colors
    color: tokens.color.text,
    colorHover: tokens.color.text,
    colorPress: tokens.color.textMuted,
    colorFocus: tokens.color.text,
    colorTransparent: tokens.color.transparent,

    // Placeholders
    placeholderColor: tokens.color.textMuted,

    // Borders
    borderColor: tokens.color.border,
    borderColorHover: tokens.color.borderFocus,
    borderColorFocus: tokens.color.borderFocus,
    borderColorPress: tokens.color.border,

    // Primary
    primary: tokens.color.primary,
    primaryHover: tokens.color.primaryDark,
    primaryPress: tokens.color.primaryDark,
    primaryFocus: tokens.color.primary,

    // Secondary
    secondary: tokens.color.textMuted,
    secondaryHover: tokens.color.text,
    secondaryPress: tokens.color.text,
    secondaryFocus: tokens.color.textMuted,

    // Semantic Colors
    success: tokens.color.success,
    successBackground: tokens.color.successLight,
    warning: tokens.color.warning,
    warningBackground: tokens.color.warningLight,
    error: tokens.color.error,
    errorBackground: tokens.color.errorLight,
    info: tokens.color.info,
    infoBackground: tokens.color.infoLight,

    // Shadows (using color values)
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowColorHover: 'rgba(0, 0, 0, 0.15)',
});

// Dark Theme
export const darkTheme = createTheme({
    // Backgrounds
    background: tokens.color.backgroundDark,
    backgroundHover: tokens.color.surfaceHoverDark,
    backgroundPress: tokens.color.surfaceDark,
    backgroundFocus: tokens.color.surfaceDark,
    backgroundStrong: tokens.color.surfaceDark,
    backgroundTransparent: tokens.color.transparent,

    // Text Colors
    color: tokens.color.textDark,
    colorHover: tokens.color.textDark,
    colorPress: tokens.color.textMutedDark,
    colorFocus: tokens.color.textDark,
    colorTransparent: tokens.color.transparent,

    // Placeholders
    placeholderColor: tokens.color.textMutedDark,

    // Borders
    borderColor: tokens.color.borderDark,
    borderColorHover: tokens.color.borderFocus,
    borderColorFocus: tokens.color.borderFocus,
    borderColorPress: tokens.color.borderDark,

    // Primary
    primary: tokens.color.primaryLight,
    primaryHover: tokens.color.primary,
    primaryPress: tokens.color.primary,
    primaryFocus: tokens.color.primaryLight,

    // Secondary
    secondary: tokens.color.textMutedDark,
    secondaryHover: tokens.color.textDark,
    secondaryPress: tokens.color.textDark,
    secondaryFocus: tokens.color.textMutedDark,

    // Semantic Colors
    success: tokens.color.success,
    successBackground: tokens.color.successLight,
    warning: tokens.color.warning,
    warningBackground: tokens.color.warningLight,
    error: tokens.color.error,
    errorBackground: tokens.color.errorLight,
    info: tokens.color.info,
    infoBackground: tokens.color.infoLight,

    // Shadows (using color values)
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowColorHover: 'rgba(0, 0, 0, 0.4)',
});

export type Theme = typeof lightTheme;
