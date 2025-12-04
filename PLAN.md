# MultiplyPop - Architecture Plan

## Overview

MultiplyPop is a production-ready, MultiplyPop/lication environment built for web-first development with clean native exports for iOS and Android. The architecture prioritizes developer experience, type safety, scalability, and maintainability.

## AI Handoff Protocol

**AFTER EVERY AI DEVELOPMENT SESSION:**
1. **Generate or update:**
   - `SUMMARY.md`
   - `NEXT_STEPS.md`
   - `ARCH_NOTES.md`
   - `CHANGELOG.md`
   - `TASKS.md`
2. **Commit all changes to GitHub:**
   ```bash
   git add -A
   git commit -m "Session update: <summary>"
   git push
   ```
3. **No session is complete until GitHub is fully up to date.**

**BEFORE ANY AI STARTS A NEW SESSION:**
1. **Pull latest code from GitHub.**
2. **Read in this order:**
   - `PLAN.md`
   - `IMPLEMENTATION.md`
   - `CHANGELOG.md`
   - `TASKS.md`
   - `SUMMARY.md`
   - `NEXT_STEPS.md`
   - `ARCH_NOTES.md`
3. **Confirm:**
   - What changed
   - What is expected
   - What the next priorities are
   - What architecture must remain consistent
4. **Only then begin implementing new work.**

### Core Principles

1. **Web-First Development**: Build and iterate in the browser, deploy to native platforms via EAS
2. **Type Safety Everywhere**: TypeScript + Zod validation at runtime boundaries
3. **Clean Architecture**: Separation of concerns with clear layer boundaries
4. **Minimal Dependencies**: Google-aligned technologies with proven stability
5. **Extensibility**: Designed for future feature additions without architectural changes

---

## Technology Stack

### Runtime & Build

| Technology | Version | Purpose |
|------------|---------|---------|
| Expo SDK | 52.x (latest) | Universal React Native framework |
| Expo Router | 4.x | File-based routing with native navigation |
| React Native Web | 0.19.x | Web platform support |
| TypeScript | 5.x | Static type checking |
| Metro | Latest | React Native bundler |

### Design System

| Technology | Purpose |
|------------|---------|
| Tamagui | Universal styling with compile-time optimization |
| Design Tokens | Centralized spacing, colors, typography |
| Light/Dark Themes | System-responsive theming |

### State Management

| Technology | Purpose |
|------------|---------|
| Zustand | Lightweight, typed global state |
| Persist Middleware | Hydrated state on web/native |
| Selectors | Optimized re-renders |

### Backend Services (Firebase)

| Service | Purpose |
|---------|---------|
| Firebase Auth | User authentication (email, Google, Apple) |
| Firestore | NoSQL document database |
| Firebase Storage | File/media storage |
| Firebase Analytics | Event tracking and user analytics |
| Firebase Hosting | Web deployment |
| Emulator Suite | Local development environment |

### Validation & Testing

| Technology | Purpose |
|------------|---------|
| Zod | Runtime schema validation |
| Vitest | Fast, modern testing framework |

### Build & Deploy

| Technology | Purpose |
|------------|---------|
| EAS Build | Cloud-based native builds |
| EAS Submit | App store submission |
| Expo Updates | OTA updates for JS bundles |

---

## Technology Rationale

### Why Expo SDK 52?

- **Unified Development**: Single codebase for web, iOS, and Android
- **Web-First Workflow**: `npx expo start --web` enables browser-based development
- **EAS Integration**: Seamless cloud builds without local Xcode/Android Studio
- **OTA Updates**: Push JavaScript updates without app store review
- **Active Maintenance**: Strong community and Google/Meta backing

### Why Expo Router?

- **File-Based Routing**: Intuitive route structure matching file system
- **Native Navigation**: Uses React Navigation under the hood
- **Deep Linking**: Automatic URL handling for web and native
- **Layout Groups**: `(auth)` and `(dashboard)` pattern for route organization
- **Type-Safe Routes**: TypeScript integration for route params

### Why Tamagui?

- **Universal Styling**: Single API for web, iOS, and Android
- **Compile-Time Optimization**: Extracts static styles at build time
- **Design Tokens**: First-class support for design system tokens
- **React Native Web Compatible**: Works seamlessly in browser
- **Tree-Shaking**: Only includes used components/styles

### Why Zustand over Redux?

- **Minimal Boilerplate**: No actions, reducers, or providers
- **TypeScript Native**: Excellent type inference
- **Small Bundle**: ~3KB vs Redux's ~7KB
- **Persist Middleware**: Built-in storage integration
- **No Context Overhead**: Direct store subscription

### Why Firebase?

- **Google Alignment**: Long-term support and integration with GCP
- **Unified Suite**: Auth, database, storage, analytics in one SDK
- **Emulator Suite**: Full local development without cloud costs
- **Security Rules**: Declarative security at database level
- **Scalability**: Automatic scaling for production loads

### Why Zod?

- **Runtime Validation**: Catches data errors at system boundaries
- **TypeScript Integration**: Infers types from schemas
- **Composable**: Build complex schemas from primitives
- **Error Messages**: Developer-friendly validation errors

---

## File Tree Structure

```
multiply-pop/
├── app/                          # Expo Router file-based routes
│   ├── _layout.tsx               # Root layout (Tamagui provider, auth listener)
│   ├── index.tsx                 # Entry point (redirects based on auth)
│   ├── (auth)/                   # Unauthenticated route group
│   │   ├── _layout.tsx           # Auth layout (prevents authenticated access)
│   │   ├── sign-in.tsx           # Sign in screen
│   │   └── sign-up.tsx           # Sign up screen
│   └── (dashboard)/              # Authenticated route group
│       ├── _layout.tsx           # Dashboard layout (requires auth)
│       ├── index.tsx             # Dashboard home
│       ├── profile.tsx           # User profile
│       └── settings.tsx          # App settings
│
├── src/                          # Application source code
│   ├── components/               # Reusable UI components
│   │   ├── Button.tsx            # Styled button component
│   │   ├── Card.tsx              # Card container component
│   │   └── Layout.tsx            # Page layout wrapper
│   │
│   ├── design/                   # Design system configuration
│   │   ├── tokens.ts             # Design tokens (spacing, colors, etc.)
│   │   ├── themes.ts             # Light and dark theme definitions
│   │   └── tamagui.config.ts     # Tamagui configuration
│   │
│   ├── data/                     # Data access layer (repositories)
│   │   ├── userRepo.ts           # User document CRUD operations
│   │   ├── sessionRepo.ts        # Session management
│   │   └── settingsRepo.ts       # User settings CRUD
│   │
│   ├── features/                 # Feature modules (future expansion)
│   │   └── .gitkeep
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts            # Authentication state hook
│   │   └── useFirebase.ts        # Firebase instance hook
│   │
│   ├── lib/                      # Core libraries and services
│   │   ├── firebase.ts           # Firebase initialization
│   │   ├── analytics.ts          # Analytics wrapper
│   │   └── logger.ts             # Logging utility
│   │
│   ├── state/                    # Zustand state stores
│   │   └── userStore.ts          # User state management
│   │
│   ├── tests/                    # Test files
│   │   ├── userRepo.test.ts      # Repository tests
│   │   └── userStore.test.ts     # Store tests
│   │
│   └── types/                    # TypeScript type definitions
│       ├── user.ts               # User-related types
│       └── env.d.ts              # Environment variable types
│
├── assets/                       # Static assets
│   ├── icon.png                  # App icon (placeholder)
│   ├── splash.png                # Splash screen (placeholder)
│   └── adaptive-icon.png         # Android adaptive icon (placeholder)
│
├── .env.development              # Development environment variables
├── .env.production               # Production environment variables
├── app.config.js                 # Expo dynamic configuration
├── babel.config.js               # Babel configuration (Tamagui)
├── metro.config.js               # Metro bundler configuration
├── tamagui.config.ts             # Tamagui config export
├── eas.json                      # EAS build profiles
├── firebase.json                 # Firebase configuration
├── firestore.rules               # Firestore security rules
├── firestore.indexes.json        # Firestore composite indexes
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vitest.config.ts              # Vitest test configuration
├── PLAN.md                       # This architecture document
└── IMPLEMENTATION.md             # Implementation guide
```

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRESENTATION                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  app/ (Expo Router)                                         ││
│  │  - Route definitions and navigation                         ││
│  │  - Screen components                                        ││
│  │  - Layout wrappers                                          ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  src/components/                                            ││
│  │  - Reusable UI primitives (Button, Card, Layout)            ││
│  │  - Composed from Tamagui + custom styling                   ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                           DESIGN                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  src/design/                                                ││
│  │  - tokens.ts (spacing, colors, typography, radii)           ││
│  │  - themes.ts (light, dark theme variants)                   ││
│  │  - tamagui.config.ts (Tamagui setup)                        ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                           STATE                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  src/state/                                                 ││
│  │  - Zustand stores (userStore)                               ││
│  │  - Persist middleware for hydration                         ││
│  │  - Typed actions and selectors                              ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  src/hooks/                                                 ││
│  │  - useAuth (Firebase Auth + Zustand sync)                   ││
│  │  - Custom business logic hooks                              ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                        DATA ACCESS                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  src/data/ (Repositories)                                   ││
│  │  - userRepo.ts (User CRUD)                                  ││
│  │  - sessionRepo.ts (Session management)                      ││
│  │  - settingsRepo.ts (Settings CRUD)                          ││
│  │  - Zod validation at boundaries                             ││
│  │  - Firestore abstraction                                    ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                        INFRASTRUCTURE                            │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  src/lib/                                                   ││
│  │  - firebase.ts (Firebase SDK initialization)                ││
│  │  - analytics.ts (Event tracking abstraction)                ││
│  │  - logger.ts (Structured logging)                           ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

1. **Presentation Layer**: Routes, screens, and reusable components
2. **Design Layer**: Visual tokens, themes, and Tamagui configuration
3. **State Layer**: Global state management and business logic hooks
4. **Data Access Layer**: Repository pattern abstracting Firestore
5. **Infrastructure Layer**: Firebase SDK, analytics, and logging

### Dependency Rules

- **Presentation** → State, Design, Components
- **State** → Data Access, Types
- **Data Access** → Infrastructure, Types
- **Infrastructure** → External SDKs only
- **Types** → No dependencies (pure type definitions)

---

## Firebase Environment Model

### Strategy: Separate Projects for Dev and Prod

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT ENVIRONMENT                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Firebase Emulator Suite (Local)                          │  │
│  │  - Auth Emulator      → localhost:9099                    │  │
│  │  - Firestore Emulator → localhost:8080                    │  │
│  │  - Storage Emulator   → localhost:9199                    │  │
│  │  - Hosting Emulator   → localhost:5000                    │  │
│  │  - UI                 → localhost:4000                    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              OR                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Firebase Dev Project (Cloud)                             │  │
│  │  - multiply-pop-dev                                       │  │
│  │  - Isolated test data                                     │  │
│  │  - Separate quotas and billing                            │  │
│  └───────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                    PRODUCTION ENVIRONMENT                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Firebase Prod Project (Cloud)                            │  │
│  │  - multiply-pop-prod                                      │  │
│  │  - Real user data                                         │  │
│  │  - Production quotas and billing                          │  │
│  │  - Enhanced security rules                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Environment Variable Loading

```typescript
// src/lib/firebase.ts
const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Connect to emulators in development
if (__DEV__ && process.env.EXPO_PUBLIC_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}
```

---

## Security Model

### Authentication Strategy

1. **Email/Password**: Standard Firebase Auth
2. **Google Sign-In**: Expo AuthSession for OAuth flow
3. **Apple Sign-In**: Expo Apple Authentication (iOS)
4. **Session Management**: Firebase Auth state persistence

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Deny all by default
    match /{document=**} {
      allow read, write: if false;
    }

    // Users collection: read/write own document only
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Validate user document structure
      allow create: if request.auth.uid == userId &&
        request.resource.data.keys().hasAll(['email', 'createdAt']) &&
        request.resource.data.email is string;
    }

    // Sessions collection: tied to user
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }

    // Settings collection: user-specific
    match /settings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Client-Side Validation

All data entering or leaving Firestore passes through Zod schemas:

```typescript
// src/data/userRepo.ts
const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export async function getUser(userId: string): Promise<User | null> {
  const doc = await getDoc(doc(db, 'users', userId));
  if (!doc.exists()) return null;
  
  const result = UserSchema.safeParse({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  });
  
  if (!result.success) {
    logger.error('User validation failed', result.error);
    throw new Error('Invalid user data');
  }
  
  return result.data;
}
```

---

## Routing Strategy

### Route Groups

```
app/
├── _layout.tsx          # Root: Tamagui Provider, Auth Listener
├── index.tsx            # Entry: Redirect based on auth state
├── (auth)/              # Unauthenticated users only
│   ├── _layout.tsx      # Redirect TO dashboard if authenticated
│   ├── sign-in.tsx
│   └── sign-up.tsx
└── (dashboard)/         # Authenticated users only
    ├── _layout.tsx      # Redirect TO sign-in if unauthenticated
    ├── index.tsx
    ├── profile.tsx
    └── settings.tsx
```

### Auth Guard Implementation

```typescript
// app/(dashboard)/_layout.tsx
export default function DashboardLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // Redirect to sign-in if not authenticated
      router.replace('/sign-in');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null; // Will redirect
  }

  return <Slot />;
}
```

### Protected Route Flow

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User      │     │   Root Layout   │     │   Auth Check    │
│   Visits    │────▶│   _layout.tsx   │────▶│   useAuth()     │
│   /         │     │                 │     │                 │
└─────────────┘     └─────────────────┘     └────────┬────────┘
                                                      │
                              ┌───────────────────────┴───────────────────────┐
                              │                                               │
                    ┌─────────▼─────────┐                         ┌───────────▼──────────┐
                    │   Not Logged In   │                         │     Logged In        │
                    │   Redirect to     │                         │     Redirect to      │
                    │   /(auth)/sign-in │                         │     /(dashboard)/    │
                    └───────────────────┘                         └──────────────────────┘
```

---

## Design System Structure

### Token Hierarchy

```typescript
// src/design/tokens.ts
export const tokens = createTokens({
  color: {
    // Brand Colors
    primary: '#6366F1',      // Indigo
    primaryDark: '#4F46E5',
    primaryLight: '#818CF8',
    
    // Semantic Colors
    background: '#FFFFFF',
    backgroundDark: '#0F172A',
    surface: '#F8FAFC',
    surfaceDark: '#1E293B',
    
    // Text Colors
    text: '#0F172A',
    textDark: '#F8FAFC',
    textMuted: '#64748B',
    
    // Status Colors
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
    // Component sizes
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

### Theme Structure

```typescript
// src/design/themes.ts
export const lightTheme = createTheme({
  background: tokens.color.background,
  backgroundStrong: tokens.color.surface,
  color: tokens.color.text,
  colorMuted: tokens.color.textMuted,
  primary: tokens.color.primary,
  // ... full theme definition
});

export const darkTheme = createTheme({
  background: tokens.color.backgroundDark,
  backgroundStrong: tokens.color.surfaceDark,
  color: tokens.color.textDark,
  colorMuted: tokens.color.textMuted,
  primary: tokens.color.primary,
  // ... full theme definition
});
```

### Component Library

```
src/components/
├── Button.tsx        # Primary action button with variants
├── Card.tsx          # Content container with padding/shadow
├── Layout.tsx        # Page wrapper with safe area handling
├── Input.tsx         # Text input with validation states (future)
├── Avatar.tsx        # User avatar with fallback (future)
└── Modal.tsx         # Overlay modal component (future)
```

---

## State Management Strategy

### Zustand Store Pattern

```typescript
// src/state/userStore.ts
interface UserState {
  user: User | null;
  isHydrated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,
      
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// Selectors for optimized re-renders
export const selectUser = (state: UserState) => state.user;
export const selectIsLoggedIn = (state: UserState) => state.user !== null;
export const selectUserEmail = (state: UserState) => state.user?.email;
```

### Store Organization

- **One store per domain**: `userStore`, `settingsStore`, `uiStore`
- **Actions inside store**: Keep mutations close to state
- **Selectors outside store**: Enable memoization and testing
- **Persist selectively**: Only persist what needs to survive restart

---

## Analytics & Event Model

### Event Categories

```typescript
// src/lib/analytics.ts
type AnalyticsEvent = 
  | { name: 'screen_view'; params: { screen_name: string } }
  | { name: 'sign_in'; params: { method: 'email' | 'google' | 'apple' } }
  | { name: 'sign_up'; params: { method: 'email' | 'google' | 'apple' } }
  | { name: 'sign_out'; params?: undefined }
  | { name: 'error'; params: { error_message: string; context: string } };

export function trackEvent<T extends AnalyticsEvent>(
  name: T['name'], 
  params?: T['params']
) {
  logEvent(analytics, name, params);
}
```

### Screen Tracking

```typescript
// Automatic in Expo Router layouts
useEffect(() => {
  const unsubscribe = router.events?.subscribe((event) => {
    if (event.type === 'routeChange') {
      trackScreenView(event.pathname);
    }
  });
  return unsubscribe;
}, []);
```

---

## Expansion Guidelines

### Adding a New Feature

1. **Create feature folder**: `src/features/[feature-name]/`
2. **Define types**: `src/types/[feature-name].ts`
3. **Create repository**: `src/data/[feature-name]Repo.ts`
4. **Add store slice**: `src/state/[feature-name]Store.ts`
5. **Build components**: `src/features/[feature-name]/components/`
6. **Add routes**: `app/[feature-name]/`
7. **Write tests**: `src/tests/[feature-name].test.ts`

### Adding a New Screen

1. Create file in appropriate route group: `app/(dashboard)/new-screen.tsx`
2. Export default React component
3. Add navigation from existing screens if needed

### Adding a New Component

1. Create in `src/components/`: `NewComponent.tsx`
2. Use Tamagui primitives as base
3. Accept theme tokens for styling
4. Export from components index

### Adding a New Store

1. Create in `src/state/`: `newStore.ts`
2. Follow existing pattern with types, actions, selectors
3. Configure persistence if needed
4. Export store and selectors

---

## Architectural Tradeoffs & Assumptions

### Tradeoffs Made

| Decision | Tradeoff | Rationale |
|----------|----------|-----------|
| Zustand over Redux | Less ecosystem, simpler | Solo dev doesn't need Redux DevTools ecosystem |
| Firebase over Supabase | Vendor lock-in | Better Expo integration, Google alignment |
| Tamagui over NativeWind | Learning curve | Compile-time optimization, universal styling |
| Repository pattern | More abstraction | Future-proofs database changes |
| Zod over io-ts | Less type inference | Better DX and error messages |

### Assumptions

1. **Solo Developer**: Optimized for single dev workflow, not team collaboration
2. **Web-First**: Primary development will happen in browser
3. **Firebase Available**: User will create Firebase projects
4. **EAS Access**: User has Expo account for EAS builds
5. **Modern Browsers**: Web targets evergreen browsers only

### Scaling Considerations

- **State**: Zustand scales well; add stores per feature domain
- **Routes**: Expo Router handles large route trees efficiently
- **Firebase**: Firestore scales automatically; optimize with indexes
- **Components**: Tamagui tree-shakes unused styles
- **Bundle Size**: Monitor with `npx expo export --platform web`

---

## Verification Plan

### Automated Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- userRepo.test.ts
```

### Manual Verification

1. **Web Development**: `npx expo start --web` launches successfully
2. **Tamagui Rendering**: Components render with correct styles
3. **Firebase Connection**: Auth and Firestore operations work
4. **Emulator Suite**: Local emulators connect properly
5. **Routing**: Auth guards redirect correctly
6. **State Persistence**: Zustand rehydrates on refresh

### Build Verification

```bash
# Verify TypeScript
npx tsc --noEmit

# Verify linting
npm run lint

# Verify web export
npx expo export --platform web
```
