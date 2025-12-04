import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserSchema } from '@/data/userRepo';

// Mock Firestore
const mockGetDoc = vi.fn();
const mockSetDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockDeleteDoc = vi.fn();
const mockDoc = vi.fn();

vi.mock('firebase/firestore', () => ({
    doc: (...args: unknown[]) => mockDoc(...args),
    getDoc: (...args: unknown[]) => mockGetDoc(...args),
    setDoc: (...args: unknown[]) => mockSetDoc(...args),
    updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
    deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
    serverTimestamp: () => ({ _serverTimestamp: true }),
    Timestamp: {
        fromDate: (date: Date) => ({ toDate: () => date }),
        now: () => ({ toDate: () => new Date() }),
    },
}));

describe('UserRepo', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('UserSchema', () => {
        it('should validate a valid user object', () => {
            const validUser = {
                id: 'user-123',
                email: 'test@example.com',
                displayName: 'Test User',
                photoURL: 'https://example.com/photo.jpg',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = UserSchema.safeParse(validUser);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.email).toBe('test@example.com');
            }
        });

        it('should validate a user without optional fields', () => {
            const minimalUser = {
                id: 'user-123',
                email: 'test@example.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = UserSchema.safeParse(minimalUser);
            expect(result.success).toBe(true);
        });

        it('should reject invalid email', () => {
            const invalidUser = {
                id: 'user-123',
                email: 'not-an-email',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = UserSchema.safeParse(invalidUser);
            expect(result.success).toBe(false);
        });

        it('should reject empty id', () => {
            const invalidUser = {
                id: '',
                email: 'test@example.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = UserSchema.safeParse(invalidUser);
            expect(result.success).toBe(false);
        });

        it('should reject invalid photoURL', () => {
            const invalidUser = {
                id: 'user-123',
                email: 'test@example.com',
                photoURL: 'not-a-url',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = UserSchema.safeParse(invalidUser);
            expect(result.success).toBe(false);
        });

        it('should reject missing required fields', () => {
            const invalidUser = {
                id: 'user-123',
                // Missing email, createdAt, updatedAt
            };

            const result = UserSchema.safeParse(invalidUser);
            expect(result.success).toBe(false);
        });
    });
});
