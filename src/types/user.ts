// User types for the application

export interface User {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthUser {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
}

export type AuthMethod = 'email' | 'google' | 'apple';
