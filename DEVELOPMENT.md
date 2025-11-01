# Development Guide

This guide covers everything you need to know to develop, customize, and contribute to the Shadcn Keycloak Theme.

## 📑 Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Architecture](#project-architecture)
- [Available Scripts](#available-scripts)
- [Development Workflow](#development-workflow)
- [Component Development](#component-development)
- [Docker Development Environment](#docker-development-environment)
- [Theme Customization](#theme-customization)
- [Building & Deployment](#building--deployment)
- [Configuration](#configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: ^18.0.0 || >=20.0.0
- **pnpm**: Latest version (recommended package manager)
  ```bash
  npm install -g pnpm
  ```
- **Docker & Docker Compose**: For local Keycloak testing
- **Java 17+**: Required for Keycloak theme building
- **Git**: For version control

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ThilinaTLM/keycloak-shadcn-theme.git
cd keycloak-shadcn-theme
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Environment

Choose based on your workflow:

```bash
# Option 1: Component development with Storybook (Recommended)
pnpm storybook
# Opens http://localhost:6006

# Option 2: Vite development server
pnpm dev
# Opens http://localhost:3000

# Option 3: Full Keycloak environment with Docker
docker compose up -d
# Opens http://localhost:8090
```

### 4. Build the Theme

```bash
pnpm build-keycloak-theme
```

The built theme JAR will be available at `dist_keycloak/shadcn-theme.jar`.

## Project Architecture

```
keycloak-shadcn-theme/
├── src/
│   ├── components/ui/          # shadcn/ui components (auto-generated, don't edit)
│   ├── login/                  # Keycloak theme implementation
│   │   ├── pages/             # Individual authentication page components
│   │   │   ├── Login.tsx
│   │   │   ├── Login.stories.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Register.stories.tsx
│   │   │   └── ...
│   │   ├── assets/            # Fonts, images, and static assets
│   │   ├── KcPage.tsx         # Main page router (maps pageId to components)
│   │   ├── Template.tsx       # Base template wrapper for all pages
│   │   └── i18n.ts           # Internationalization setup
│   ├── lib/                   # Utility functions
│   └── global.css            # Global styles and Tailwind imports
├── .storybook/                # Storybook configuration
├── compose.yaml               # Docker Compose for local Keycloak
├── vite.config.ts            # Vite + Keycloakify configuration
└── dist_keycloak/            # Output directory for built theme JAR

```

### Key Files

- **`src/login/KcPage.tsx`**: Router that maps Keycloak page IDs (`login.ftl`, `register.ftl`, etc.) to React components
- **`src/login/Template.tsx`**: Shared layout wrapper providing consistent UI across all pages
- **`vite.config.ts`**: Build configuration for Keycloakify and Tailwind CSS v4
- **`compose.yaml`**: Local Keycloak development environment with PostgreSQL

## Available Scripts

| Command                     | Description                                         |
| --------------------------- | --------------------------------------------------- |
| `pnpm dev`                  | Start Vite development server for component testing |
| `pnpm build`                | Build TypeScript and bundle assets                  |
| `pnpm build-keycloak-theme` | Build complete Keycloak theme JAR                   |
| `pnpm storybook`            | Start Storybook for component development           |
| `pnpm format`               | Format code with Prettier                           |
| `pnpm lint:fix`             | Fix ESLint issues automatically                     |

## Development Workflow

### Recommended Workflow

1. **Develop in Isolation**: Use Storybook to develop and test individual pages
2. **Test Integrations**: Use the Docker environment to test complete authentication flows
3. **Build & Deploy**: Generate the JAR file for production deployment

### Quick Iteration Cycle

```bash
# Terminal 1: Run Storybook for component development
pnpm storybook

# Terminal 2: Make changes to components
# ... edit files in src/login/pages/ ...

# Terminal 3: Build and test in real Keycloak when ready
pnpm build-keycloak-theme
docker compose restart keycloak
```

## Component Development

### Working with Pages

Each login page consists of two files:

- **`PageName.tsx`**: The React component implementation
- **`PageName.stories.tsx`**: Storybook story for isolated development and testing

### Creating a New Page

1. **Create the component** in `src/login/pages/`:

```typescript
// src/login/pages/MyNewPage.tsx
import type { PageProps } from "keycloakify/login";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function MyNewPage(
  props: PageProps<Extract<KcContext, { pageId: "my-new-page.ftl" }>, I18n>
) {
  const { kcContext, i18n } = props;
  const { msg } = i18n;

  return (
    <div>
      <h1>{msg("myNewPageTitle")}</h1>
      {/* Your page implementation */}
    </div>
  );
}
```

2. **Create the Storybook story**:

```typescript
// src/login/pages/MyNewPage.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "my-new-page.ftl" });

const meta = {
  title: "login/MyNewPage",
  component: KcPageStory,
} satisfies Meta<typeof KcPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  render: () => (
    <KcPageStory
      kcContext={{
        message: { type: "error", summary: "Something went wrong" },
      }}
    />
  ),
};
```

3. **Register the page** in `src/login/KcPage.tsx`:

```typescript
case "my-new-page.ftl":
  return <MyNewPage {...props} />;
```

### Using shadcn/ui Components

All shadcn/ui components are available in `src/components/ui/`. To add new components:

```bash
npx shadcn@latest add tooltip
```

Components are automatically configured with the project's Tailwind setup.

## Docker Development Environment

The project includes a complete Docker Compose setup for local Keycloak testing.

### Starting the Environment

```bash
# Start all services in background
docker compose up -d

# View logs
docker compose logs -f keycloak

# Stop services
docker compose down

# Reset everything (including database)
docker compose down -v
```

### Services Included

- **Keycloak**: Available at http://localhost:8090
  - Admin Console: http://localhost:8090/admin
  - Default admin credentials: `admin` / `admin`
- **PostgreSQL**: Database backend (port 5432)
- **Pre-configured Realm**: Test realm with sample users

### Default Test Credentials

- **Admin User**: `admin` / `admin`
- **Test User**: `test` / `test`

### Using Your Custom Theme

The Docker Compose setup automatically mounts `dist_keycloak/shadcn-theme.jar` into Keycloak.

```bash
# Build theme
pnpm build-keycloak-theme

# Restart Keycloak to load the new theme
docker compose restart keycloak

# Access Keycloak and configure realm to use 'shadcn-theme'
```

## Theme Customization

### Customizing Styles

#### Global Styles

Edit `src/global.css` for global styling:

```css
@theme {
  /* Customize CSS variables */
  --color-primary: #000000;
  --radius-md: 0.5rem;
}
```

#### Component Styles

Use Tailwind classes and CSS variables in your components:

```tsx
<Button className="bg-primary text-primary-foreground">Click Me</Button>
```

#### Theme Colors

Modify CSS custom properties in `src/global.css`:

```css
@theme {
  --color-background: 0 0% 100%;
  --color-foreground: 222.2 47.4% 11.2%;
  --color-primary: 222.2 47.4% 11.2%;
  /* ... more color definitions */
}
```

### Font Customization

The theme uses the Geist font family. To use a different font:

1. **Add font files** to `src/login/assets/fonts/your-font/`

2. **Create font CSS**:

```css
/* src/login/assets/fonts/your-font/index.css */
@font-face {
  font-family: "YourFont";
  src: url("./YourFont-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

3. **Import in global.css**:

```css
@import "./login/assets/fonts/your-font/index.css";

@theme {
  --font-sans: "YourFont", sans-serif;
}
```

### Customizing Messages (i18n)

1. **Add new translations** in `src/login/i18n.ts`:

```typescript
export const { useI18n } = createUseI18n({
  en: {
    myCustomMessage: "Welcome to our platform!"
  }
  // ... other languages
});
```

2. **Use in components**:

```typescript
const { msg } = i18n;
<h1>{msg("myCustomMessage")}</h1>;
```

## Building & Deployment

### Building for Production

```bash
# Build the complete Keycloak theme
pnpm build-keycloak-theme

# The JAR file will be created at:
# dist_keycloak/shadcn-theme.jar
```

### Manual Keycloak Installation

1. **Copy the JAR file** to your Keycloak providers directory:

```bash
cp dist_keycloak/shadcn-theme.jar $KEYCLOAK_HOME/providers/
```

2. **Restart Keycloak** to load the new theme:

```bash
$KEYCLOAK_HOME/bin/kc.sh start
```

3. **Configure your realm** to use the theme:
   - Navigate to Realm Settings → Themes
   - Set Login Theme to `shadcn-theme`
   - Save changes

### Docker Deployment

Create a Dockerfile that includes the theme:

```dockerfile
FROM quay.io/keycloak/keycloak:26.0

# Copy the theme JAR
COPY dist_keycloak/shadcn-theme.jar /opt/keycloak/providers/

# Build Keycloak with the theme
RUN /opt/keycloak/bin/kc.sh build

# Set environment variables
ENV KC_HOSTNAME=your-domain.com
ENV KC_DB=postgres

# Start Keycloak
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start"]
```

Build and run:

```bash
docker build -t my-keycloak-with-theme .
docker run -p 8080:8080 my-keycloak-with-theme
```

## Configuration

### Keycloak Version Compatibility

The theme targets Keycloak versions 22-25+ and is configured in `vite.config.ts`:

```typescript
keycloakify({
  keycloakVersionTargets: {
    "all-other-versions": "shadcn-theme.jar",
    "22-to-25": false
  },
  themeName: "shadcn-theme",
  themeVersion: "1.0.0"
});
```

To target different Keycloak versions, modify this configuration.

### Environment Variables

Docker Compose environment variables:

| Variable                   | Description       | Default                                    |
| -------------------------- | ----------------- | ------------------------------------------ |
| `KEYCLOAK_ADMIN`           | Admin username    | `admin`                                    |
| `KEYCLOAK_ADMIN_PASSWORD`  | Admin password    | `admin`                                    |
| `KC_DB`                    | Database type     | `postgres`                                 |
| `KC_DB_URL`                | Database URL      | `jdbc:postgresql://postgres:5432/keycloak` |
| `KC_DB_USERNAME`           | Database username | `keycloak`                                 |
| `KC_DB_PASSWORD`           | Database password | `password`                                 |
| `KC_HOSTNAME`              | Keycloak hostname | `localhost`                                |
| `KC_HTTP_ENABLED`          | Enable HTTP       | `true`                                     |
| `KC_HOSTNAME_STRICT`       | Strict hostname   | `false`                                    |
| `KC_HOSTNAME_STRICT_HTTPS` | Strict HTTPS      | `false`                                    |

## Testing

### Storybook Testing

Storybook provides isolated testing for each authentication page:

```bash
pnpm storybook
# Opens http://localhost:6006
```

Each page component has comprehensive stories covering:

- **Default states**: Normal rendering
- **Error conditions**: Validation errors, server errors
- **Different form configurations**: Various field combinations
- **Message scenarios**: Info, success, warning, and error messages
- **Edge cases**: Missing data, special characters, long text

### Integration Testing with Docker

Use the Docker environment to test complete authentication flows:

```bash
# 1. Build the theme
pnpm build-keycloak-theme

# 2. Start Keycloak
docker compose up -d

# 3. Access Keycloak
open http://localhost:8090

# 4. Test various flows:
# - User registration
# - Login with username/password
# - Password reset
# - Email verification
# - Social login setup
# - MFA configuration
```

### Manual Testing Checklist

- [ ] Login page renders correctly
- [ ] Registration form validation works
- [ ] Password reset flow completes
- [ ] Email verification displays properly
- [ ] Error messages are clear and visible
- [ ] Responsive design works on mobile
- [ ] Language switching functions
- [ ] Social login buttons appear
- [ ] Multi-factor authentication pages work
- [ ] Theme loads without console errors

## Troubleshooting

### Common Issues

#### Build Failures

**Problem**: Build fails with cryptic errors

**Solution**:

```bash
# Clear all caches and rebuild
rm -rf node_modules dist dist_keycloak .vite
pnpm install
pnpm build-keycloak-theme
```

#### Docker Issues

**Problem**: Keycloak won't start or shows errors

**Solution**:

```bash
# Reset Docker environment completely
docker compose down -v
docker compose up -d

# Check logs for errors
docker compose logs -f keycloak
```

#### Theme Not Loading in Keycloak

**Problem**: Theme doesn't appear in Keycloak theme dropdown

**Solutions**:

1. Verify JAR file is in correct location:

   ```bash
   ls $KEYCLOAK_HOME/providers/shadcn-theme.jar
   ```

2. Ensure Keycloak was restarted after theme installation:

   ```bash
   docker compose restart keycloak
   ```

3. Check Keycloak logs for theme loading errors:

   ```bash
   docker compose logs keycloak | grep -i theme
   ```

4. Verify the theme name matches in both `vite.config.ts` and Keycloak admin console

#### Development Server Issues

**Problem**: Port already in use

**Solution**:

```bash
# Check if ports are available
lsof -i :3000  # Vite dev server
lsof -i :6006  # Storybook
lsof -i :8090  # Keycloak

# Kill processes if needed
kill -9 <PID>
```

#### Storybook Not Showing Components

**Problem**: Storybook shows blank pages or errors

**Solution**:

```bash
# Clear Storybook cache
rm -rf node_modules/.cache/storybook
pnpm storybook
```

### Getting Help

If you're stuck:

1. Check the [Keycloakify documentation](https://docs.keycloakify.dev/)
2. Review [shadcn/ui documentation](https://ui.shadcn.com/)
3. Search [GitHub Issues](https://github.com/ThilinaTLM/keycloak-shadcn-theme/issues)
4. Open a new issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Relevant logs or error messages

## Contributing

We welcome contributions! Here's how to get started:

### Getting Started

1. **Fork the repository** on GitHub

2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/keycloak-shadcn-theme.git
   cd keycloak-shadcn-theme
   ```

3. **Add upstream remote**:

   ```bash
   git remote add upstream https://github.com/ThilinaTLM/keycloak-shadcn-theme.git
   ```

4. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```

### Development Guidelines

#### Code Style

- **TypeScript**: Use strict TypeScript with proper typing
- **React**: Follow React best practices and hooks guidelines
- **Formatting**: Run `pnpm format` before committing
- **Linting**: Ensure `pnpm lint:fix` passes
- **Components**: Use functional components with TypeScript
- **Naming**: Use PascalCase for components, camelCase for functions

#### Component Guidelines

- Each page should have a corresponding `.stories.tsx` file
- Use shadcn/ui components when possible
- Ensure accessibility (ARIA labels, keyboard navigation)
- Follow existing component patterns
- Add JSDoc comments for complex logic

#### Testing Requirements

- Test your changes in Storybook
- Verify in Docker Keycloak environment
- Test different authentication flows
- Check responsive design (mobile, tablet, desktop)
- Verify accessibility with screen readers
- Test in different browsers

#### Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
git commit -m "feat: add dark mode toggle to login page"

# Bug fixes
git commit -m "fix: resolve registration form validation issue"

# Documentation
git commit -m "docs: update installation instructions"

# Styling
git commit -m "style: improve button spacing on mobile"

# Refactoring
git commit -m "refactor: extract form validation logic"
```

### Submitting Changes

1. **Ensure code quality**:

   ```bash
   pnpm format
   pnpm lint:fix
   pnpm build-keycloak-theme
   ```

2. **Test thoroughly** using Storybook and Docker

3. **Commit your changes**:

   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

4. **Push to your fork**:

   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**:
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Provide a clear description of changes
   - Link any related issues

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] All new code has Storybook stories
- [ ] Tested in Docker Keycloak environment
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow conventional commits
- [ ] No console errors or warnings
- [ ] Responsive design tested
- [ ] Accessibility verified

### Areas for Contribution

We especially welcome contributions in:

- **New Pages**: Implementing missing Keycloak pages
- **Accessibility**: Improving WCAG compliance
- **Internationalization**: Adding or improving translations
- **Documentation**: Improving guides and examples
- **Bug Fixes**: Resolving reported issues
- **Performance**: Optimizing bundle size and render performance
- **Testing**: Adding automated tests
- **Design**: UI/UX improvements

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what's best for the project
- Assume good intentions

---

Thank you for contributing to Shadcn Keycloak Theme! 🎉
