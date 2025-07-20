# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `pnpm dev` - Start Vite development server
- `pnpm storybook` - Start Storybook for component development (port 6006)

### Build

- `pnpm build` - Build TypeScript and Vite bundle
- `pnpm build-keycloak-theme` - Build the complete Keycloak theme (runs build + keycloakify build)

### Code Quality

- `pnpm format` - Format code with Prettier

### Docker Environment

- `docker compose up -d` - Start full Keycloak development environment
- Keycloak accessible at http://localhost:8090 (admin/admin)
- Includes PostgreSQL database and realm configuration

## Architecture

This is a Keycloakify project that creates custom Keycloak login themes using React, TypeScript, and shadcn/ui components.

### Key Components

- **KcPage.tsx** (`src/login/KcPage.tsx`) - Main page router that maps Keycloak page IDs to React components
- **Template.tsx** (`src/login/Template.tsx`) - Base template wrapper for all login pages
- **Individual Pages** (`src/login/pages/`) - Each Keycloak login page (Login, Register, etc.) with corresponding Storybook stories

### Theme System

- Uses Keycloakify v11 for theme generation
- Built with shadcn/ui components in `src/components/ui/`
- Tailwind CSS v4 for styling with custom fonts (Geist)
- Theme builds to `shadcn-theme.jar` for Keycloak deployment

### Project Structure

- `src/login/` - All Keycloak theme-related code
- `src/login/pages/` - Individual page implementations (each has .tsx and .stories.tsx)
- `src/components/ui/` - shadcn/ui components (excluded from ESLint)
- `src/login/assets/` - Fonts and images for the theme
- `.storybook/` - Storybook configuration for component development

### Configuration

- **vite.config.ts** - Vite configuration with Keycloakify plugin, Tailwind, and path aliases (@/_ = ./src/_)
- **eslint.config.js** - ESLint with TypeScript, React, and Storybook rules
- **tsconfig.json** - TypeScript project references with path mapping
- **compose.yaml** - Docker Compose for full development environment

### Development Workflow

1. Use Storybook for component development and testing
2. Individual pages can be developed in isolation via their .stories.tsx files
3. Build and test with Docker Compose environment
4. Theme is packaged as a JAR file for Keycloak deployment

## Development Resources

- You have access to all the shadcn components, lucide icons, tailwindcss
