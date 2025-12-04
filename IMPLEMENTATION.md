# MultiplyPop - Implementation Guide

## Quick Start

```bash
# Navigate to project
cd MultiplyPop

# Install dependencies
npm install

# Start development server (web)
npx expo start --web

# Start Firebase emulators (separate terminal)
npm run emulators
```

---

## AI Handoff Protocol & GitHub Rules

### AI Handoff Protocol

**AFTER EVERY SESSION:**
1. Update `SUMMARY.md`, `NEXT_STEPS.md`, `ARCH_NOTES.md`, `CHANGELOG.md`, `TASKS.md`.
2. Commit and push: `git commit -m "Session update: <summary>" && git push`.

**BEFORE EVERY SESSION:**
1. Pull latest code.
2. Read `PLAN.md`, `IMPLEMENTATION.md`, `CHANGELOG.md`, `TASKS.md`, `SUMMARY.md`, `NEXT_STEPS.md`, `ARCH_NOTES.md`.
3. Confirm context and architecture.

### GitHub Workflow Rules

1. **Single Source of Truth**: GitHub is the master record.
2. **End with Push**: Every session must end with a push.
3. **Start with Pull**: Every session must begin with a pull and file review.
4. **Intentional Updates**: `PLAN.md` and `IMPLEMENTATION.md` are only updated intentionally.
5. **Preserve Architecture**: Rules in `ARCH_NOTES.md` are inviolable.
6. **No Parallel Work**: Sync through GitHub before starting.

**Branching:**
- `main`: Stable, architecture-aligned work.
- `feature/*`: Short-lived branches. Merge only after validation.

---

---

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Firebase Setup](#firebase-setup)
4. [Authentication](#authentication)
5. [Data Layer](#data-layer)
6. [Tamagui Configuration](#tamagui-configuration)
7. [Testing](#testing)
8. [Firebase Emulator Suite](#firebase-emulator-suite)
9. [EAS Build](#eas-build)
10. [Web Deployment](#web-deployment)
11. [Common Commands Cheat Sheet](#common-commands-cheat-sheet)
12. [Troubleshooting](#troubleshooting)

---

## Installation

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- Git
- Firebase CLI: `npm install -g firebase-tools`
- EAS CLI: `npm install -g eas-cli`

### Step 1: Clone or Initialize

```bash
# If starting fresh
cd /path/to/your/projects
npx create-expo-app@latest MultiplyPop --template tabs
cd MultiplyPop

# Or clone existing
git clone <repository-url>
cd MultiplyPop
```

### Step 2: Install Dependencies

```bash
# Core Expo packages
npx expo install expo-router expo-linking expo-constants expo-status-bar

# React Native Web
npx expo install react-native-web react-dom @expo/metro-runtime

# Tamagui
npm install @tamagui/core @tamagui/config tamagui
npx expo install @tamagui/babel-plugin

# Firebase
npm install firebase

# State Management
npm install zustand

# Validation
npm install zod

# Testing
npm install -D vitest @testing-library/react jsdom

# Async Storage (for Zustand persistence)
npx expo install @react-native-async-storage/async-storage

# Safe Area Context
npx expo install react-native-safe-area-context

# Gesture Handler (required by Expo Router)
npx expo install react-native-gesture-handler

# Screens (required by Expo Router)
npx expo install react-native-screens

# Reanimated (for animations)
npx expo install react-native-reanimated

# Auth Session (for OAuth)
npx expo install expo-auth-session expo-crypto expo-web-browser
```

### Step 3: Verify Installation

```bash
# Check Expo doctor
npx expo-doctor

# Start dev server
npx expo start --web
```

---

## Configuration

### Environment Variables

Create `.env.development`:

```bash
# Firebase Configuration (Development)
EXPO_PUBLIC_FIREBASE_API_KEY=your-dev-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-dev.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-dev
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-dev.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXX

# Emulator Settings
EXPO_PUBLIC_USE_EMULATORS=true
```

Create `.env.production`:

```bash
# Firebase Configuration (Production)
EXPO_PUBLIC_FIREBASE_API_KEY=your-prod-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-prod.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-prod
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-prod.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=987654321
EXPO_PUBLIC_FIREBASE_APP_ID=1:987654321:web:xyz789
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-YYYYYYY

# Emulator Settings
EXPO_PUBLIC_USE_EMULATORS=false
```

### TypeScript Configuration

Ensure `tsconfig.json` includes:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@design/*": ["./src/design/*"],
      "@data/*": ["./src/data/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@lib/*": ["./src/lib/*"],
      "@state/*": ["./src/state/*"],
      "@types/*": ["./src/types/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

### Babel Configuration

`babel.config.js`:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
          logTimings: true,
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
```

### Metro Configuration

`metro.config.js`:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add Tamagui support
config.resolver.sourceExts.push('mjs');

module.exports = config;
```

---

## Firebase Setup

### Step 1: Create Firebase Projects

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create two projects:
   - `multiply-pop-dev` (development)
   - `multiply-pop-prod` (production)

### Step 2: Enable Services

For each project:

1. **Authentication**
   - Go to Authentication → Sign-in method
   - Enable Email/Password
   - Enable Google Sign-In
   - Add authorized domains

2. **Firestore**
   - Go to Firestore Database
   - Create database in production mode
   - Start in your preferred region

3. **Storage**
   - Go to Storage
   - Get started
   - Choose security rules

4. **Analytics**
   - Analytics is enabled by default

### Step 3: Get Configuration

1. Go to Project Settings → General
2. Scroll to "Your apps"
3. Add a Web app
4. Copy the firebaseConfig object
5. Add values to your `.env` files

### Step 4: Initialize Firebase CLI

```bash
# Login to Firebase
firebase login

# Initialize in project directory
firebase init

# Select:
# - Firestore
# - Hosting
# - Storage
# - Emulators (optional but recommended)
```

---

## Authentication

### How Auth Gating Works

```
┌─────────────────────────────────────────────────────────────┐
│                     app/_layout.tsx                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  1. Initialize Firebase                                 ││
│  │  2. Set up onAuthStateChanged listener                  ││
│  │  3. Sync Firebase user → Zustand store                  ││
│  │  4. Provide Tamagui theme                               ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      app/index.tsx                           │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Check auth state via useAuth()                         ││
│  │  - If loading: show splash                              ││
│  │  - If authenticated: redirect to /(dashboard)           ││
│  │  - If not authenticated: redirect to /(auth)/sign-in    ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│   (auth)/_layout.tsx    │   │ (dashboard)/_layout.tsx │
│   - Checks if logged in │   │ - Checks if logged in   │
│   - If yes: redirect    │   │ - If no: redirect       │
│     to dashboard        │   │   to sign-in            │
└─────────────────────────┘   └─────────────────────────┘
```

### useAuth Hook

```typescript
// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@lib/firebase';
import { useUserStore } from '@state/userStore';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser, clearUser, isHydrated } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
        });
      } else {
        clearUser();
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    isLoading: isLoading || !isHydrated,
    isAuthenticated: user !== null,
  };
}
```

---

## Data Layer

### Repository Pattern

Each repository:
1. Defines Zod schema for validation
2. Provides CRUD operations
3. Converts Firestore docs to typed objects
4. Hides Firestore implementation details

### Example: userRepo.ts

```typescript
// src/data/userRepo.ts
import { z } from 'zod';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@lib/firebase';
import { logger } from '@lib/logger';

// Schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Firestore document shape
interface UserDoc {
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Convert Firestore doc to domain object
function toUser(id: string, data: UserDoc): User {
  const result = UserSchema.safeParse({
    id,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  });

  if (!result.success) {
    logger.error('User validation failed', { id, errors: result.error });
    throw new Error('Invalid user data');
  }

  return result.data;
}

// CRUD Operations
export async function getUser(userId: string): Promise<User | null> {
  const docRef = doc(db, 'users', userId);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) {
    return null;
  }

  return toUser(snapshot.id, snapshot.data() as UserDoc);
}

export async function createUser(userId: string, email: string): Promise<User> {
  const now = serverTimestamp();
  const userData = {
    email,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, 'users', userId), userData);
  
  // Fetch back to get resolved timestamps
  const user = await getUser(userId);
  if (!user) throw new Error('Failed to create user');
  
  return user;
}

export async function updateUser(
  userId: string, 
  updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<User> {
  const docRef = doc(db, 'users', userId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  const user = await getUser(userId);
  if (!user) throw new Error('Failed to update user');
  
  return user;
}

export async function deleteUser(userId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId));
}
```

---

## Tamagui Configuration

### How Tamagui is Configured

1. **tokens.ts**: Define design tokens (colors, spacing, etc.)
2. **themes.ts**: Create light/dark themes using tokens
3. **tamagui.config.ts**: Combine into Tamagui config
4. **babel.config.js**: Add Tamagui babel plugin
5. **app/_layout.tsx**: Wrap app in TamaguiProvider

### Token Structure

```typescript
// src/design/tokens.ts
import { createTokens } from 'tamagui';

export const tokens = createTokens({
  color: {
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    primaryLight: '#818CF8',
    background: '#FFFFFF',
    backgroundDark: '#0F172A',
    surface: '#F8FAFC',
    surfaceDark: '#1E293B',
    text: '#0F172A',
    textDark: '#F8FAFC',
    textMuted: '#64748B',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
  },
  size: {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 56,
  },
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
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
```

### Theme Configuration

```typescript
// src/design/themes.ts
import { createTheme } from 'tamagui';
import { tokens } from './tokens';

export const lightTheme = createTheme({
  background: tokens.color.background,
  backgroundStrong: tokens.color.surface,
  color: tokens.color.text,
  colorMuted: tokens.color.textMuted,
  primary: tokens.color.primary,
  primaryDark: tokens.color.primaryDark,
  primaryLight: tokens.color.primaryLight,
  success: tokens.color.success,
  warning: tokens.color.warning,
  error: tokens.color.error,
  info: tokens.color.info,
});

export const darkTheme = createTheme({
  background: tokens.color.backgroundDark,
  backgroundStrong: tokens.color.surfaceDark,
  color: tokens.color.textDark,
  colorMuted: tokens.color.textMuted,
  primary: tokens.color.primary,
  primaryDark: tokens.color.primaryDark,
  primaryLight: tokens.color.primaryLight,
  success: tokens.color.success,
  warning: tokens.color.warning,
  error: tokens.color.error,
  info: tokens.color.info,
});
```

---

## Testing

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
  },
});
```

### Test Setup

```typescript
// src/tests/setup.ts
import { beforeEach, vi } from 'vitest';

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific file
npm test -- userRepo.test.ts
```

---

## Firebase Emulator Suite

### Configuration

`firebase.json`:

```json
{
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "storage": {
      "port": 9199
    },
    "hosting": {
      "port": 5000
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### Starting Emulators

```bash
# Start all emulators
npm run emulators

# Or directly
firebase emulators:start

# Start with data import
firebase emulators:start --import=./emulator-data

# Export data on exit
firebase emulators:start --export-on-exit=./emulator-data
```

### Emulator URLs

| Service | URL |
|---------|-----|
| Auth Emulator | http://localhost:9099 |
| Firestore Emulator | http://localhost:8080 |
| Storage Emulator | http://localhost:9199 |
| Hosting Emulator | http://localhost:5000 |
| Emulator UI | http://localhost:4000 |

---

## EAS Build

### Configuration

`eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      },
      "env": {
        "EXPO_PUBLIC_USE_EMULATORS": "true"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "env": {
        "EXPO_PUBLIC_USE_EMULATORS": "false"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_USE_EMULATORS": "false"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Building for iOS

```bash
# Login to EAS
eas login

# Configure project (first time)
eas build:configure

# Build for iOS simulator (development)
eas build --platform ios --profile development

# Build for iOS device (preview)
eas build --platform ios --profile preview

# Build for App Store (production)
eas build --platform ios --profile production
```

### Building for Android

```bash
# Build for Android emulator (development)
eas build --platform android --profile development

# Build APK (preview)
eas build --platform android --profile preview

# Build AAB for Play Store (production)
eas build --platform android --profile production
```

### Submitting to Stores

```bash
# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

---

## Web Deployment

### Deploy to Firebase Hosting

```bash
# Build web assets
npx expo export --platform web

# Preview locally
firebase serve --only hosting

# Deploy to dev environment
firebase deploy --only hosting --project multiplypop

# Deploy to production
firebase deploy --only hosting --project multiplypop
```

### Deploy Firestore Rules

```bash
# Deploy rules only
firebase deploy --only firestore:rules

# Deploy indexes only
firebase deploy --only firestore:indexes

# Deploy both
firebase deploy --only firestore
```

---

## Common Commands Cheat Sheet

### Development

```bash
# Start dev server (web)
npx expo start --web

# Start dev server (all platforms)
npx expo start

# Start with clear cache
npx expo start --clear

# Start Firebase emulators
npm run emulators
# Or: firebase emulators:start
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Building

```bash
# Build for web
npx expo export --platform web

# Build iOS development
eas build --platform ios --profile development

# Build Android development
eas build --platform android --profile development

# Build production (both platforms)
eas build --platform all --profile production
```

### Deployment

```bash
# Deploy web to Firebase
firebase deploy --only hosting

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy everything
firebase deploy
```

### Linting & Formatting

```bash
# Run TypeScript check
npx tsc --noEmit

# Run linter
npm run lint

# Fix lint issues
npm run lint:fix
```

### Expo Doctor

```bash
# Check project health
npx expo-doctor

# Upgrade Expo SDK
npx expo install --fix
```

---

## Troubleshooting

### Common Issues

#### 1. Tamagui Not Compiling

**Symptom**: Styles not applying, blank screen

**Solution**:
```bash
# Clear Metro cache
npx expo start --clear

# Rebuild node_modules
rm -rf node_modules
npm install
```

#### 2. Firebase Emulator Connection Failed

**Symptom**: "Could not connect to emulator"

**Solution**:
1. Ensure emulators are running: `firebase emulators:start`
2. Check `.env.development` has `EXPO_PUBLIC_USE_EMULATORS=true`
3. Verify ports aren't blocked by firewall

#### 3. Auth State Not Persisting

**Symptom**: User logged out on refresh

**Solution**:
1. Verify AsyncStorage is installed
2. Check Zustand persist configuration
3. Verify `isHydrated` is being set correctly

#### 4. Web Build Fails

**Symptom**: `npx expo export --platform web` errors

**Solution**:
```bash
# Update dependencies
npx expo install --fix

# Clear cache and rebuild
rm -rf .expo dist
npx expo export --platform web
```

#### 5. TypeScript Path Aliases Not Working

**Symptom**: Import errors for `@lib/`, `@components/`, etc.

**Solution**:
1. Verify `tsconfig.json` has correct paths
2. Add to `babel.config.js`:
```javascript
plugins: [
  ['module-resolver', {
    alias: {
      '@': './src',
      '@components': './src/components',
      // ... etc
    }
  }]
]
```
3. Install: `npm install -D babel-plugin-module-resolver`

### Getting Help

1. **Expo Docs**: https://docs.expo.dev
2. **Tamagui Docs**: https://tamagui.dev
3. **Firebase Docs**: https://firebase.google.com/docs
4. **Zustand Docs**: https://github.com/pmndrs/zustand
5. **Zod Docs**: https://zod.dev

### Debug Mode

Enable verbose logging:

```bash
# Expo verbose mode
DEBUG=expo:* npx expo start

# Firebase debug mode
firebase emulators:start --debug
```

---

## Next Steps

After completing the initial setup:

1. **Configure Firebase Projects**: Create dev and prod projects in Firebase Console
2. **Add Real Icons**: Replace placeholder icons in `/assets`
3. **Customize Themes**: Adjust tokens and themes to match your brand
4. **Add Features**: Use the expansion guidelines in PLAN.md
5. **Set Up CI/CD**: Configure GitHub Actions for automated builds
6. **Monitor Performance**: Set up Firebase Performance Monitoring
