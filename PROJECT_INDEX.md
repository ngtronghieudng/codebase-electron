# Project Index: codebase-electron

Generated: 2025-11-30
Token Efficiency: ~3K tokens vs ~58K full read (94% reduction)

## 📁 Project Structure

```
codebase-electron/
├── src/
│   ├── main/                    # Electron Main Process
│   │   ├── main.ts              # App lifecycle, window creation
│   │   ├── preload.ts           # IPC bridge (context isolation)
│   │   └── ipc-handlers.ts      # IPC channel handlers
│   ├── renderer/                # React Renderer Process
│   │   ├── renderer.tsx         # React entry point
│   │   ├── App.tsx              # Root component + providers
│   │   ├── AppRoutes.tsx        # Auto-discovered routing
│   │   ├── apis/                # Axios API clients
│   │   ├── components/shared/   # Base* and The* components
│   │   ├── contexts/            # React contexts
│   │   ├── hooks/               # Custom hooks (auth/, shared/)
│   │   ├── layouts/             # Page layouts
│   │   ├── libs/                # Library configs (axios, i18next)
│   │   ├── mocks/               # Mock data
│   │   ├── pages/               # Page components
│   │   ├── routes/              # Route definitions (*.route.tsx)
│   │   ├── schemas/             # Yup validation schemas
│   │   └── stores/              # Zustand state stores
│   └── shared/                  # Cross-process shared code
│       ├── definitions/         # Types, interfaces, constants, enums
│       └── utils/               # Utility functions
├── locales/                     # i18n translations (en, ja, vi)
├── docs/                        # Documentation
└── scripts/                     # Build/utility scripts
```

## 🚀 Entry Points

| Process | Entry | Description |
|---------|-------|-------------|
| **Main** | `src/main/main.ts` | Electron app lifecycle, BrowserWindow creation |
| **Preload** | `src/main/preload.ts` | IPC bridge with context isolation |
| **Renderer** | `src/renderer/renderer.tsx` | React application mount point |

## 📦 Core Modules

### Main Process (`src/main/`)

| Module | Exports | Purpose |
|--------|---------|---------|
| `main.ts` | `createWindow` | Window management, app lifecycle events |
| `ipc-handlers.ts` | `setupIpcHandlers`, `removeIpcHandlers` | App, window, file, store IPC handlers |
| `preload.ts` | `electronHandler`, `ALLOWED_INVOKE_CHANNELS` | Secure IPC bridge |

### Renderer Core (`src/renderer/`)

| Module | Exports | Purpose |
|--------|---------|---------|
| `App.tsx` | `App`, `queryClient` | Root with ErrorBoundary, providers |
| `AppRoutes.tsx` | `AppRoutes`, `ProtectedRoute` | Auto-route discovery, auth guards |

### State Management (`src/renderer/stores/`)

| Store | Key Exports | Purpose |
|-------|-------------|---------|
| `auth.store.ts` | `useAuthStore` | Token, user info, auth state |
| `loading.store.ts` | `useLoadingStore` | Global loading state |

### API Layer (`src/renderer/apis/`)

| API | Endpoints | Purpose |
|-----|-----------|---------|
| `auth.api.ts` | login, register, profile, refresh | Authentication flows |
| `shared.api.ts` | Generic API helpers | Shared API utilities |

### Axios Configuration (`src/renderer/libs/axios/`)

| Module | Purpose |
|--------|---------|
| `configs.ts` | Axios instance with interceptors (auto token, snake_case ↔ camelCase) |
| `utils.ts` | Request/response transformation utilities |

## 🧩 Component Library

### Base Components (Ant Design Wrappers)
`BaseAutocomplete` `BaseButton` `BaseCheckbox` `BaseCheckboxGroup` `BaseDatePicker` `BaseDropdown` `BaseFormItem` `BaseImage` `BaseInput` `BaseInputNumber` `BaseMenu` `BaseModal` `BasePagination` `BasePopover` `BaseSelect` `BaseSwitch` `BaseTable` `BaseTimePicker`

### Global Components
`TheBreadcrumb` `TheLoading` `TheSidebar` `TheTopbar`

### Layouts
`DefaultLayout` `ErrorLayout` `GuestLayout`

## 🪝 Custom Hooks

### Auth Hooks (`hooks/auth/`)
- `use-auth-mutations.ts` - Login, register, logout mutations
- `use-auth-queries.ts` - Profile, session queries

### Shared Hooks (`hooks/shared/`)
- `use-electron-api.ts` - Type-safe IPC invoke wrapper
- `use-handle-catch-error.ts` - Centralized error handling
- `use-confirm-modal.ts` - Confirmation dialogs
- `use-pagination.ts` - Table pagination logic
- `use-theme.ts` / `use-theme-color.ts` - Theme management
- `use-language.ts` / `use-localized-value.ts` - i18n utilities
- `use-breakpoints.ts` - Responsive breakpoint detection
- `use-window-scroll.ts` - Scroll position tracking

## 🛤️ Routes (Auto-Discovered)

| Route File | Path | Auth |
|------------|------|------|
| `home.route.tsx` | `/` | Yes |
| `auth.route.tsx` | `/auth/*` | No |
| `codebase.route.tsx` | `/codebase` | Yes |
| `forbidden.route.tsx` | `/403` | No |
| `not-found.route.tsx` | `/404` | No |

## 📋 Shared Definitions (`src/shared/definitions/`)

### Constants
`BREAKPOINTS` `COOKIE_KEYS` `ERROR_CODES` `NODE_ENVS` `QUERY_KEYS` `REGEXES` `STORAGE_KEYS`

### Types/Interfaces
- `auth.type.ts` / `auth.interface.ts` - Authentication types
- `shared.type.ts` / `shared.interface.ts` - Common types
- `ipc.type.ts` - IPC channel types

### Utilities (`src/shared/utils/`)
`amount.util` `convert.util` `format.util` `logger.util` `notification.util` `shared.util`

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `forge.config.ts` | Electron Forge packaging/distribution |
| `vite.main.config.ts` | Vite config for main process |
| `vite.preload.config.ts` | Vite config for preload script |
| `vite.renderer.config.ts` | Vite config for renderer (React) |
| `tsconfig.json` | TypeScript configuration |
| `eslint.config.mjs` | ESLint with perfectionist, i18next plugins |
| `commitlint.config.mjs` | Commit message validation |
| `prettier.config.mjs` | Code formatting |
| `tailwind.config.ts` | Tailwind CSS v4 configuration |

## 🌐 i18n Languages

- English (`locales/en.json`)
- Japanese (`locales/ja.json`)
- Vietnamese (`locales/vi.json`)

## 📝 Quick Commands

```bash
pnpm start          # Development mode
pnpm check-all      # Format + Lint + Type-check (parallel)
pnpm package        # Package for distribution
pnpm make           # Create installers
```

## 🔗 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| electron | 35.x | Desktop framework |
| react | 18.x | UI library |
| antd | 5.23.x | Component library |
| zustand | 5.x | State management |
| @tanstack/react-query | 5.x | Server state |
| react-router | 7.x | Routing |
| axios | 1.x | HTTP client |
| i18next | 24.x | Internationalization |
| tailwindcss | 4.x | Utility CSS |
| yup | 1.x | Validation |

## 🏗️ Architecture Patterns

### Three-Process Model
```
Main Process ←──IPC──→ Preload Bridge ←──contextBridge──→ Renderer Process
     │                      │                                    │
  Node.js              Sandboxed               React + TanStack Query
  Electron APIs        Channel whitelist       Zustand stores
```

### Data Flow
```
Component → useQuery/useMutation → API (axios) → Backend
    ↓                                    ↓
Zustand Store ←── Response Interceptor ←─┘
(auth, loading)    (camelCase conversion)
```

### Route Discovery
```
routes/*.route.tsx → Vite glob import → AppRoutes → ProtectedRoute wrapper
                                              ↓
                                    Auth check (useAuthStore)
```

## ⚠️ Critical Patterns

1. **Package Manager**: pnpm only (enforced by preinstall hook)
2. **No `any` types**: ESLint error on explicit any
3. **Console**: Only `console.error` and `console.info` allowed
4. **Commits**: Must follow `[TICKET-XXX]: Message` format
5. **Branches**: Must match `feature|bugfix|hotfix|release/*` or `master`
6. **Router**: HashRouter required for Electron file:// protocol
7. **IPC Security**: Channel whitelist in preload.ts
