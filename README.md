# 📱 codebase-electron

> This template will help you get started with Electron

[![Electron Forge](https://img.shields.io/badge/Electron%20Forge-%5E7.8.1-47848F.svg?logo=electron&logoColor=white)](https://www.electronforge.io/)
[![Vite](https://img.shields.io/badge/Vite-%5E6.4.1-9135FF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)

---

## 📋 Overview

| Property        | Value                                                 |
| --------------- | ----------------------------------------------------- |
| **Name**        | codebase-electron                                     |
| **Description** | This template will help you get started with Electron |
| **Version**     | 0.1.0                                                 |
| **Main**        | .vite/build/main.js                                   |
| **Private**     | True                                                  |

## ⚙️ Requirements

| Requirement | Version           |
| ----------- | ----------------- |
| **Node**    | `>=22`            |
| **pnpm**    | `>=10`            |
| **npm**     | `please-use-pnpm` |
| **Yarn**    | `please-use-pnpm` |
| **Bun**     | `please-use-pnpm` |

## 🛠️ Scripts

This project includes several scripts to assist with development:

### Development Commands

```bash
pnpm start          # Start development mode
pnpm format         # Format code
pnpm lint           # Lint code
pnpm type-check     # Type check
pnpm check-all      # Run all checks
```

### Build & Distribution

```bash
pnpm package        # Package application
pnpm make           # Build distributables
pnpm publish        # Publish application
```

### Testing

```bash
pnpm test                       # Run tests in watch mode
pnpm test:ui                    # Run tests with UI
pnpm test:run                   # Run tests once
pnpm test:coverage              # Run tests with coverage report
pnpm test:run tests/stores      # Run tests in a specific directory
```

## 🚀 Getting Started

To get started with this template, clone the repository and install dependencies:

```bash
# Install dependencies
pnpm install

# Install git hooks
pnpm prepare

# Start development
pnpm start
```

---

<div align="center">

Made with ❤️ using [Electron](https://www.electronjs.org/)

</div>
