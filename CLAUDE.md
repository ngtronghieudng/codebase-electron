# Codebase Documentation

## Project Overview

This is an Electron application built with modern web technologies, featuring a robust architecture that separates the main process from the renderer process. The application uses React for the UI, with TypeScript for type safety, and follows best practices for state management and component organization.

## Tech Stack

- **Core Framework**: Electron v35.4.0
- **UI Framework**: React v18.3.1
- **State Management**:
  - Zustand for global state
  - React Query for server state
- **Styling**:
  - Tailwind CSS
  - SCSS Modules
  - Ant Design v5.23.0
- **Type Safety**: TypeScript
- **Package Manager**: pnpm
- **Build Tools**: Vite
- **Internationalization**: i18next

## Project Structure

### Main Process (`src/main/`)

- `main.ts`: Entry point for Electron main process
- `preload.ts`: Bridge between main and renderer processes

### Renderer Process (`src/renderer/`)

#### Core Components

- `App.tsx`: Root component with providers setup
- `AppRoutes.tsx`: Route configuration with authentication guards

#### Feature Organization

1. **Components**

   - `shared/`: Reusable UI components

   **Base Components** (Ant Design wrappers):

   - `BaseAutocomplete.tsx`: Autocomplete input component
   - `BaseButton.tsx`: Button component with default styling
   - `BaseCheckbox.tsx`: Checkbox component
   - `BaseCheckboxGroup.tsx`: Checkbox group component
   - `BaseDatePicker.tsx`: Date picker component
   - `BaseDropdown.tsx`: Dropdown menu component
   - `BaseFormItem.tsx`: Form item wrapper
   - `BaseInput.tsx`: Input field component
   - `BaseInputNumber.tsx`: Number input component
   - `BaseModal.tsx`: Modal dialog component
   - `BasePagination.tsx`: Pagination component
   - `BaseSelect.tsx`: Select dropdown component
   - `BaseSwitch.tsx`: Toggle switch component
   - `BaseTable.tsx`: Table component
   - `BaseTimePicker.tsx`: Time picker component

   **Layout Components**:

   - `TheSidebar.tsx`: Application sidebar navigation
   - `TheTopbar.tsx`: Top navigation bar
   - `TheBreadcrumb.tsx`: Breadcrumb navigation
   - `TheLoading.tsx`: Loading indicator component

2. **Pages**

   - `auth/`: Authentication pages (Login, Register)
   - `CodebasePage.tsx`: Main application pages
   - `HomePage.tsx`: Landing page

3. **State Management**

   - `stores/`: Zustand stores with devtools middleware
     - `auth.store.ts`: Authentication state
     - `loading.store.ts`: Global loading state

4. **API Integration**

   - `apis/`: API service modules with Axios
   - `libs/axios/`: Axios configuration

5. **Hooks**
   - `shared/`: Custom React hooks for theme, breakpoints, error handling
     - `use-breakpoints.ts`: Responsive breakpoint utilities
     - `use-handle-catch-error.ts`: Error handling utilities
     - `use-language.ts`: Language management
     - `use-pagination.ts`: Pagination logic
     - `use-theme-color.ts`: Theme color management
     - `use-theme.ts`: Theme switching
     - `use-window-scroll.ts`: Window scroll tracking

### Shared Resources (`src/shared/`)

#### Definitions

1. **Constants** (`definitions/constants/`)

   - `route-apis.const.ts`: API endpoint definitions
   - `route-pages.const.ts`: Page route definitions
   - `shared.const.ts`: Common constants including:
     - `ERROR_CODES`: Application error codes
     - `NODE_ENVS`: Environment definitions
     - `REGEXES`: Common regex patterns (email, password, phone, etc.)
     - `STORAGE_KEYS`: Local storage keys
     - `COOKIE_KEYS`: Cookie storage keys
     - `BREAKPOINTS`: Responsive breakpoint values

2. **Types & Interfaces** (`definitions/types/` & `definitions/interfaces/`)

   - `auth.type.ts`: Authentication-related types
   - `shared.type.ts`: Common shared types
   - `auth.interface.ts`: Authentication interfaces
   - `shared.interface.ts`: Common shared interfaces

3. **Enums** (`definitions/enums/`)

   - `shared.enum.ts`: Common enumerations

4. **Declarations** (`definitions/declarations/`)
   - `forge.d.ts`: Forge build tool declarations
   - `vite.d.ts`: Vite build tool declarations

#### Utils (`utils/`)

- `amount.util.ts`: Currency and amount formatting utilities
- `convert.util.ts`: Data conversion helpers
- `format.util.ts`: Formatting utilities including:
  - `cleanQueryString`: Clean undefined/empty query parameters
  - `formatDateUTC`: UTC date formatting
  - `formatQueryString`: Query string formatting
- `notification.util.ts`: Notification system utilities
- `shared.util.ts`: Common utility functions

### Assets

- **Fonts**: Roboto variable font family
- **Icons**: SVG icons organized by category (shared, auth, etc.)
- **Images**: Image assets with organized structure
- **Styles**:
  - Component-specific SCSS modules
  - Global styles and themes
  - Ant Design customizations
  - Tailwind CSS integration

## Key Features

### Authentication

- Complete authentication flow
- Role-based access control
- Protected routes
- Session management

### Internationalization

- Multi-language support (en, ja, vi)
- Language detection
- Translation management

### Theming

- Light/Dark mode support
- Custom theme configuration
- Ant Design theme customization

### Form Handling

- Form validation with Yup
- React Hook Form integration
- Custom form components

### Base Components System

The application implements a comprehensive Base Components system that wraps Ant Design components with consistent styling and behavior:

- **Consistent Styling**: All base components inherit from Ant Design with predefined themes
- **Type Safety**: Full TypeScript support with proper prop interfaces
- **Reusability**: Components are designed to be reused across the application
- **Customization**: Easy to extend and customize for specific use cases

### Shared Utilities

The shared utilities provide common functionality across the application:

- **Formatting**: Date, currency, and string formatting utilities
- **Validation**: Common regex patterns and validation helpers
- **Storage**: Local storage and cookie management
- **Error Handling**: Centralized error handling utilities
- **Responsive Design**: Breakpoint utilities for responsive layouts

## Development Workflow

### Setup

```bash
pnpm install
```

### Scripts

- `pnpm start`: Start development server
- `pnpm package`: Package application
- `pnpm make`: Create installers
- `pnpm check-all`: Run all checks (format, lint, type-check)

### Code Quality

- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Husky pre-commit hooks
- Branch naming conventions

### Code Style Rules

- **NO COMMENTS**: Do not add any comments (`//` or `/* */`) in code
- **NO DOCBLOCKS**: Do not use JSDoc-style comments (`/** ... */`) for functions, classes, or methods

## Architecture Decisions

### Why Electron?

- Cross-platform desktop application
- Web technologies for UI
- Native system integration

### Why React?

- Component-based architecture
- Rich ecosystem
- Strong developer tools
- Performance optimizations

### Why Zustand?

- Simple and lightweight
- TypeScript support
- No boilerplate
- Easy integration with React

### Why Ant Design?

- Comprehensive component library
- Enterprise-ready components
- Customization options
- TypeScript support

### Why Base Components?

- **Consistency**: Ensures consistent UI across the application
- **Maintainability**: Centralized styling and behavior
- **Developer Experience**: Simplified component usage
- **Type Safety**: Full TypeScript integration
- **Performance**: Optimized component implementations

## Contributing

1. Follow branch naming convention: `feature/`, `bugfix/`, `hotfix/`, `release/`
2. Ensure all checks pass before committing
3. Follow TypeScript strict mode
4. Write meaningful commit messages
5. Keep components focused and reusable
6. Use Base Components for new UI elements
7. Follow the established patterns for shared utilities
