# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **For comprehensive developer documentation**, see [DEVELOPMENT.md](DEVELOPMENT.md) which includes detailed setup instructions, customization guides, testing procedures, and contribution guidelines.

## Commands

### Development

- `pnpm dev` - Start Vite development server
- `pnpm storybook` - Start Storybook for component development (port 6006)

### Build

- `pnpm build` - Build TypeScript and Vite bundle
- `pnpm build-keycloak-theme` - Build the complete Keycloak theme (runs build + keycloakify build)
  - Output: `dist_keycloak/shadcn-theme.jar`

### Code Quality

- `pnpm format` - Format code with Prettier
- `pnpm lint:fix` - Fix ESLint issues

### Docker Environment

- `docker compose up -d` - Start full Keycloak development environment
  - Keycloak accessible at http://localhost:8090 (admin/admin)
  - Includes PostgreSQL database and pre-configured realm
  - Automatically mounts the built theme JAR from `dist_keycloak/`

## Architecture

This is a Keycloakify v11 project that creates custom Keycloak login themes using React, TypeScript, and shadcn/ui components.

### Key Components

- **KcPage.tsx** (`src/login/KcPage.tsx`) - Main page router that maps Keycloak page IDs (e.g., "login.ftl", "register.ftl") to React components using a switch statement
- **Template.tsx** (`src/login/Template.tsx`) - Base template wrapper providing consistent layout, language selector, back button, and message display for all login pages
- **Individual Pages** (`src/login/pages/`) - Each Keycloak login page (Login, Register, etc.) with corresponding Storybook stories
- **UserProfileFormFields** (`src/login/UserProfileFormFields.tsx`) - Lazy-loaded component for dynamic user profile forms

### Theme System

- Uses Keycloakify v11 for theme generation
- Targets Keycloak version 22-25+ (configured in vite.config.ts)
- Built with shadcn/ui components in `src/components/ui/` (excluded from ESLint)
- Tailwind CSS v4 for styling with custom fonts (Geist)
- Theme builds to `dist_keycloak/shadcn-theme.jar` for Keycloak deployment

### Project Structure

- `src/login/` - All Keycloak theme-related code
  - `src/login/pages/` - Individual page implementations (each has .tsx and .stories.tsx)
  - `src/login/KcPage.tsx` - Router mapping page IDs to components
  - `src/login/Template.tsx` - Shared layout wrapper
  - `src/login/i18n.ts` - Internationalization setup using Keycloakify's i18n builder
  - `src/login/assets/` - Fonts and images for the theme
- `src/components/ui/` - shadcn/ui components (excluded from ESLint, do not modify manually)
- `src/lib/` - Utility functions
- `.storybook/` - Storybook configuration for component development

### Configuration

- **vite.config.ts** - Vite configuration with:
  - Keycloakify plugin (theme name: "shadcn-theme", targets Keycloak 22-25+)
  - Tailwind CSS v4 plugin
  - Path aliases: `@/*` resolves to `./src/*`
- **eslint.config.js** - ESLint with TypeScript, React, and Storybook rules
  - Ignores: `dist/**`, `public/**`, `src/components/ui/**`
- **tsconfig.json** - TypeScript project references with path mapping
- **compose.yaml** - Docker Compose with Keycloak 26.0, PostgreSQL 17, and realm import

### Development Workflow

1. **Component Development**: Use Storybook for isolated page development and testing
2. **Adding New Pages**:
   - Create page component in `src/login/pages/PageName.tsx`
   - Create Storybook story using `createKcPageStory({ pageId: "page-name.ftl" })`
   - Add case to switch statement in `src/login/KcPage.tsx`
3. **Testing**: Build theme and test with Docker Compose environment
4. **Deployment**: Theme is packaged as `shadcn-theme.jar` for Keycloak deployment

### Storybook Pattern

Each page uses the `createKcPageStory` helper to create Storybook stories:

```typescript
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "page-name.ftl" });

// Stories can override kcContext properties for different scenarios
export const WithError: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        message: { type: "error", summary: "Error message" }
      }}
    />
  )
};
```

## Development Resources

- You have access to all shadcn components, lucide icons, and Tailwind CSS v4
- Use `@/` prefix for imports (e.g., `@/components/ui/button`)
- Path alias resolves `@/*` to `./src/*`
