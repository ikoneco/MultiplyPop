import { logEvent, setCurrentScreen, setUserId, setUserProperties } from 'firebase/analytics';
import { analytics } from './firebase';
import { logger } from './logger';

/**
 * Screen view tracking
 */
export function trackScreenView(screenName: string, screenClass?: string): void {
    try {
        if (analytics) {
            setCurrentScreen(analytics, screenName);
            logEvent(analytics, 'screen_view', {
                screen_name: screenName,
                screen_class: screenClass || screenName,
            });
        }
        logger.debug('Screen view tracked', { screenName, screenClass });
    } catch (error) {
        logger.error('Failed to track screen view', { screenName, error });
    }
}

/**
 * Generic event tracking
 */
export function trackEvent(
    eventName: string,
    params?: Record<string, string | number | boolean>
): void {
    try {
        if (analytics) {
            logEvent(analytics, eventName, params);
        }
        logger.debug('Event tracked', { eventName, params });
    } catch (error) {
        logger.error('Failed to track event', { eventName, error });
    }
}

/**
 * Error tracking
 */
export function trackError(
    errorMessage: string,
    context?: Record<string, string | number | boolean>
): void {
    const params = {
        error_message: errorMessage.slice(0, 100), // Limit length
        ...context,
    };

    try {
        if (analytics) {
            logEvent(analytics, 'error', params);
        }
        logger.error('Error tracked', params);
    } catch (error) {
        logger.error('Failed to track error', { errorMessage, error });
    }
}

/**
 * User identification
 */
export function identifyUser(userId: string): void {
    try {
        if (analytics) {
            setUserId(analytics, userId);
        }
        logger.info('User identified', { userId });
    } catch (error) {
        logger.error('Failed to identify user', { userId, error });
    }
}

/**
 * Clear user identification (on logout)
 */
export function clearUserIdentity(): void {
    try {
        if (analytics) {
            setUserId(analytics, null);
        }
        logger.info('User identity cleared');
    } catch (error) {
        logger.error('Failed to clear user identity', { error });
    }
}

/**
 * Set user properties
 */
export function setUserProps(properties: Record<string, string>): void {
    try {
        if (analytics) {
            setUserProperties(analytics, properties);
        }
        logger.debug('User properties set', { properties });
    } catch (error) {
        logger.error('Failed to set user properties', { error });
    }
}

// Pre-defined event helpers
export const events = {
    signIn: (method: 'email' | 'google' | 'apple') =>
        trackEvent('sign_in', { method }),

    signUp: (method: 'email' | 'google' | 'apple') =>
        trackEvent('sign_up', { method }),

    signOut: () => trackEvent('sign_out'),

    featureUsed: (featureName: string) =>
        trackEvent('feature_used', { feature_name: featureName }),

    buttonClicked: (buttonName: string, screen: string) =>
        trackEvent('button_clicked', { button_name: buttonName, screen }),

    formSubmitted: (formName: string, success: boolean) =>
        trackEvent('form_submitted', { form_name: formName, success }),
};
