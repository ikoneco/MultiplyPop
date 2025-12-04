import React from 'react';
import { styled, GetProps, YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Base layout container
 */
const StyledLayout = styled(YStack, {
    name: 'Layout',
    flex: 1,
    backgroundColor: '$background',

    variants: {
        centered: {
            true: {
                alignItems: 'center',
                justifyContent: 'center',
            },
        },
        padded: {
            true: {
                padding: '$4',
            },
            false: {
                padding: 0,
            },
        },
        scrollable: {
            true: {
                overflow: 'scroll',
            },
        },
    } as const,

    defaultVariants: {
        padded: true,
    },
});

type StyledLayoutProps = GetProps<typeof StyledLayout>;

interface LayoutProps extends Omit<StyledLayoutProps, 'padded'> {
    children: React.ReactNode;
    padded?: boolean;
    safeArea?: boolean | 'top' | 'bottom' | 'horizontal';
}

/**
 * Layout component for page wrappers with optional safe area handling
 */
export function Layout({
    children,
    padded = true,
    safeArea = false,
    ...props
}: LayoutProps) {
    const insets = useSafeAreaInsets();

    const safeAreaStyle = React.useMemo(() => {
        if (!safeArea) return {};

        if (safeArea === true) {
            return {
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            };
        }

        if (safeArea === 'top') {
            return { paddingTop: insets.top };
        }

        if (safeArea === 'bottom') {
            return { paddingBottom: insets.bottom };
        }

        if (safeArea === 'horizontal') {
            return {
                paddingLeft: insets.left,
                paddingRight: insets.right,
            };
        }

        return {};
    }, [safeArea, insets]);

    return (
        <StyledLayout padded={padded} style={safeAreaStyle} {...props}>
            {children}
        </StyledLayout>
    );
}

/**
 * Container for limiting content width
 */
export const Container = styled(YStack, {
    name: 'Container',
    width: '100%',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    paddingHorizontal: '$4',
});

/**
 * Centered content wrapper
 */
export const CenteredContent = styled(YStack, {
    name: 'CenteredContent',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '$4',
});

/**
 * Full screen overlay
 */
export const Overlay = styled(YStack, {
    name: 'Overlay',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
});

export type { LayoutProps };
