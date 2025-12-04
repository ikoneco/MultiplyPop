import { styled, GetProps } from 'tamagui';
import { YStack } from 'tamagui';
import React from 'react';

/**
 * Styled Card component
 */
const StyledCard = styled(YStack, {
    name: 'Card',
    backgroundColor: '$background',
    borderRadius: '$4',
    padding: '$4',
    borderWidth: 1,
    borderColor: '$borderColor',

    variants: {
        variant: {
            default: {},
            elevated: {
                shadowColor: '$shadowColor',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 8,
                elevation: 4,
                borderWidth: 0,
            },
            outlined: {
                borderWidth: 1,
                borderColor: '$borderColor',
            },
            filled: {
                backgroundColor: '$backgroundStrong',
                borderWidth: 0,
            },
        },
        size: {
            sm: {
                padding: '$3',
            },
            md: {
                padding: '$4',
            },
            lg: {
                padding: '$5',
            },
        },
        interactive: {
            true: {
                cursor: 'pointer',
                animation: 'quick',
                pressStyle: {
                    scale: 0.98,
                    opacity: 0.9,
                },
                hoverStyle: {
                    backgroundColor: '$backgroundHover',
                },
            },
        },
        fullWidth: {
            true: {
                width: '100%',
            },
        },
    } as const,

    defaultVariants: {
        variant: 'default',
        size: 'md',
    },
});

type StyledCardProps = GetProps<typeof StyledCard>;

interface CardProps extends StyledCardProps {
    children: React.ReactNode;
}

/**
 * Card component for content containers
 */
export function Card({ children, ...props }: CardProps) {
    return <StyledCard {...props}>{children}</StyledCard>;
}

/**
 * Card Header component
 */
export const CardHeader = styled(YStack, {
    name: 'CardHeader',
    paddingBottom: '$3',
    borderBottomWidth: 1,
    borderBottomColor: '$borderColor',
    marginBottom: '$3',
});

/**
 * Card Content component
 */
export const CardContent = styled(YStack, {
    name: 'CardContent',
    gap: '$2',
});

/**
 * Card Footer component
 */
export const CardFooter = styled(YStack, {
    name: 'CardFooter',
    paddingTop: '$3',
    borderTopWidth: 1,
    borderTopColor: '$borderColor',
    marginTop: '$3',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: '$2',
});

export type { CardProps };
