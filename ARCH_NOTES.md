# Architectural Notes & Rules

## Core Principles
1. **Web-First Development**: Build and iterate in the browser, deploy to native platforms via EAS.
2. **Type Safety Everywhere**: TypeScript + Zod validation at runtime boundaries.
3. **Clean Architecture**: Separation of concerns with clear layer boundaries (Presentation, Design, State, Data Access, Infrastructure).
4. **Single Source of Truth**: GitHub is the master record. All AIs must sync with it.

## Constraints
- Do not introduce new heavy dependencies without updating `PLAN.md`.
- Maintain the folder structure defined in `PLAN.md`.
- All data access must go through Repositories.
- All state management must use Zustand.

## Assumptions
- Developers have access to Firebase and EAS credentials.
- Development happens primarily in VS Code or AI-integrated IDEs.
