import { styled, GetProps } from 'tamagui';
import { Button as TamaguiButton, Spinner } from 'tamagui';
import React from 'react';

/**
 * Styled Button component with variants
 */
const StyledButton = styled(TamaguiButton, {
    name: 'Button',
    fontFamily: '$body',
    fontWeight: '600',
    borderRadius: '$4',
    pressStyle: {
        opacity: 0.8,
        scale: 0.98,
    },
    animation: 'quick',

    variants: {
        variant: {
            primary: {
                backgroundColor: '$primary',
                color: 'white',
                hoverStyle: {
                    backgroundColor: '$primaryHover',
                },
            },
            secondary: {
                backgroundColor: '$backgroundStrong',
                color: '$color',
                borderWidth: 1,
                borderColor: '$borderColor',
                hoverStyle: {
                    backgroundColor: '$backgroundHover',
                    borderColor: '$borderColorHover',
                },
            },
            ghost: {
                backgroundColor: 'transparent',
                color: '$primary',
                hoverStyle: {
                    backgroundColor: '$backgroundHover',
                },
            },
            danger: {
                backgroundColor: '$error',
                color: 'white',
                hoverStyle: {
                    opacity: 0.9,
                },
            },
        },
        size: {
            sm: {
                height: 36,
                paddingHorizontal: '$3',
                fontSize: 14,
            },
            md: {
                height: 44,
                paddingHorizontal: '$4',
                fontSize: 16,
            },
            lg: {
                height: 52,
                paddingHorizontal: '$5',
                fontSize: 18,
            },
        },
        fullWidth: {
            true: {
                width: '100%',
            },
        },
        disabled: {
            true: {
                opacity: 0.5,
                pointerEvents: 'none',
            },
        },
    } as const,

    defaultVariants: {
        variant: 'primary',
        size: 'md',
    },
});

type StyledButtonProps = GetProps<typeof StyledButton>;

interface ButtonProps extends Omit<StyledButtonProps, 'disabled'> {
    loading?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
}

/**
 * Button component with loading state
 */
export function Button({
    loading = false,
    disabled = false,
    children,
    ...props
}: ButtonProps) {
    return (
        <StyledButton
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Spinner
                    size="small"
                    color={props.variant === 'secondary' || props.variant === 'ghost' ? '$primary' : 'white'}
                />
            ) : (
                children
            )}
        </StyledButton>
    );
}

export type { ButtonProps };
