# Shadcn Keycloak Theme

> [!WARNING]
> This project is actively in development. Features and APIs may change without notice.

[![Code Quality](https://github.com/ThilinaTLM/keycloakify-shadcn/actions/workflows/code-quality.yml/badge.svg)](https://github.com/ThilinaTLM/keycloakify-shadcn/actions/workflows/code-quality.yml)
[![Release](https://github.com/ThilinaTLM/keycloakify-shadcn/actions/workflows/release.yml/badge.svg)](https://github.com/ThilinaTLM/keycloakify-shadcn/actions/workflows/release.yml)

A modern, beautiful, and fully customizable Keycloak login theme built with [Keycloakify v11](https://www.keycloakify.dev/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [shadcn/ui](https://ui.shadcn.com/), and [Tailwind CSS v4](https://tailwindcss.com/). This theme provides a responsive, accessible, and internationalized user interface for all Keycloak authentication flows.

## ✨ Features

### 🎨 Modern Design System
- **shadcn/ui Components**: Built with high-quality, accessible React components
- **Tailwind CSS v4**: Latest styling with CSS custom properties and improved performance
- **Geist Font**: Modern typography using the Geist font family
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Dark/Light Mode Ready**: Theme structure supports multiple color schemes

### 🔐 Complete Authentication Coverage
This theme supports **all essential Keycloak login pages**:

**Core Authentication:**
- Login (username/password)
- Registration 
- Password Reset & Update
- Email Verification
- Logout Confirmation

**Multi-Factor Authentication:**
- OTP/TOTP Configuration & Input
- Recovery Authentication Codes
- WebAuthn/Passkeys Support
- X.509 Certificate Authentication

**Advanced Flows:**
- OAuth Grant Confirmation
- OAuth Device Authorization
- Identity Provider Linking
- User Profile Management
- Account Deletion Confirmation
- Terms and Conditions
- Error & Info Pages

### 🌐 Internationalization
- **30+ Languages Supported**: Complete message bundles for global deployment
- **RTL Support**: Right-to-left languages fully supported
- **Custom Messages**: Easy to extend with additional languages

### 🛠️ Developer Experience
- **TypeScript**: Full type safety throughout the codebase
- **Storybook**: Interactive component development and testing
- **ESLint + Prettier**: Code quality and consistent formatting
- **Docker Compose**: Full development environment with one command
- **Hot Reload**: Instant feedback during development

## 🚀 Quick Start

### Prerequisites

- **Node.js**: ^18.0.0 || >=20.0.0
- **pnpm**: Latest version (recommended package manager)
- **Docker & Docker Compose**: For local Keycloak testing
- **Java 17+**: Required for Keycloak theme building

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/ThilinaTLM/keycloakify-shadcn.git
cd keycloakify-shadcn
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Start development environment:**
```bash
# Option 1: Component development with Storybook
pnpm storybook

# Option 2: Vite development server
pnpm dev

# Option 3: Full Keycloak environment
docker compose up -d
```

4. **Build the theme:**
```bash
pnpm build-keycloak-theme
```

The built theme will be available as `dist_keycloak/shadcn-theme.jar`.

## 🏗️ Development Guide

### Project Architecture

```
src/
├── components/ui/          # shadcn/ui components
├── login/                  # Keycloak theme implementation
│   ├── pages/             # Individual page components
│   ├── assets/            # Fonts, images, and static assets
│   ├── KcPage.tsx         # Main page router
│   ├── Template.tsx       # Base template wrapper
│   └── i18n.ts           # Internationalization setup
├── lib/                   # Utility functions
└── global.css            # Global styles and Tailwind imports
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite development server for component testing |
| `pnpm build` | Build TypeScript and bundle assets |
| `pnpm build-keycloak-theme` | Build complete Keycloak theme JAR |
| `pnpm storybook` | Start Storybook for component development |
| `pnpm format` | Format code with Prettier |

### Component Development Workflow

1. **Develop in Isolation**: Use Storybook to develop and test individual pages
2. **Test Integrations**: Use the Docker environment to test complete flows
3. **Build & Deploy**: Generate the JAR file for production deployment

#### Working with Individual Pages

Each login page has two files:
- `PageName.tsx` - The React component implementation
- `PageName.stories.tsx` - Storybook story for isolated development

**Example: Creating a new page**
```typescript
// src/login/pages/MyNewPage.tsx
import type { PageProps } from "keycloakify/login";
import { KcPage } from "../KcPage";

export default function MyNewPage(props: PageProps<Extract<KcPage, "my-new-page.ftl">>) {
  // Implementation
}

// src/login/pages/MyNewPage.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "my-new-page.ftl" });

const meta = {
  title: "login/MyNewPage",
  component: KcPageStory,
} satisfies Meta<typeof KcPageStory>;

export default meta;
```

### Docker Development Environment

The project includes a complete Docker Compose setup:

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

**Services included:**
- **Keycloak**: Available at http://localhost:8090
- **PostgreSQL**: Database backend
- **Pre-configured realm**: Ready-to-use test environment

**Default credentials:**
- Admin: `admin` / `admin`
- Test user: `test` / `test`

### Theme Customization

#### Adding New shadcn/ui Components

```bash
# Example: Add a new component
npx shadcn@latest add tooltip
```

Components are automatically configured with the project's Tailwind setup.

#### Customizing Styles

1. **Global styles**: Edit `src/global.css`
2. **Component styles**: Use Tailwind classes and CSS variables
3. **Theme colors**: Modify CSS custom properties in `global.css`

#### Font Customization

The theme uses the Geist font family. To change fonts:

1. Add font files to `src/login/assets/fonts/`
2. Update font CSS in `src/login/assets/fonts/[font-name]/index.css`
3. Import in `src/global.css`

## 📦 Deployment

### Building for Production

```bash
# Build the complete theme
pnpm build-keycloak-theme

# The JAR file will be created at:
# dist_keycloak/shadcn-theme.jar
```

### Keycloak Installation

1. **Copy the JAR file** to your Keycloak providers directory:
```bash
cp dist_keycloak/shadcn-theme.jar $KEYCLOAK_HOME/providers/
```

2. **Restart Keycloak** to load the new theme

3. **Configure your realm** to use the `shadcn-theme`:
   - Go to Realm Settings → Themes
   - Set Login Theme to `shadcn-theme`

### Docker Deployment

```dockerfile
FROM quay.io/keycloak/keycloak:latest
COPY dist_keycloak/shadcn-theme.jar /opt/keycloak/providers/
RUN /opt/keycloak/bin/kc.sh build
```

## 🔧 Configuration

### Keycloak Version Compatibility

The theme is built for Keycloak versions 22-25+ and is configured in `vite.config.ts`:

```typescript
keycloakify({
  keycloakVersionTargets: {
    "all-other-versions": "shadcn-theme.jar",
    "22-to-25": false
  },
  themeName: "shadcn-theme",
  themeVersion: "1.0.0"
})
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `KEYCLOAK_ADMIN` | Admin username | `admin` |
| `KEYCLOAK_ADMIN_PASSWORD` | Admin password | `admin` |
| `KC_DB_URL` | Database URL | `jdbc:postgresql://postgres:5432/keycloak` |

### Customizing Messages

1. **Add new language**: Create `messages_[locale].properties` in the generated theme
2. **Override existing messages**: Modify message files during build
3. **Custom messages**: Extend `src/login/i18n.ts`

## 🧪 Testing

### Storybook Testing

```bash
# Start Storybook
pnpm storybook

# Visit http://localhost:6006
```

Each page component has comprehensive stories covering:
- Default states
- Error conditions  
- Different form configurations
- Various message scenarios

### Integration Testing

Use the Docker environment to test complete authentication flows:

1. Start the environment: `docker compose up -d`
2. Navigate to http://localhost:8090
3. Test various authentication scenarios
4. Check theme rendering across different pages

## 🛠️ Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear all caches and rebuild
rm -rf node_modules dist dist_keycloak
pnpm install
pnpm build-keycloak-theme
```

**Docker Issues:**
```bash
# Reset Docker environment
docker compose down -v
docker compose up -d
```

**Theme Not Loading:**
- Verify JAR file is in correct Keycloak providers directory
- Ensure Keycloak was restarted after theme installation
- Check Keycloak logs for loading errors

**Development Server Issues:**
```bash
# Check if ports are available
lsof -i :3000  # Vite dev server
lsof -i :6006  # Storybook
lsof -i :8090  # Keycloak
```

### Getting Help

1. Check the [Keycloakify documentation](https://docs.keycloakify.dev/)
2. Review [shadcn/ui documentation](https://ui.shadcn.com/)
3. Open an issue on GitHub for bug reports
4. Join the Keycloakify Discord community

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the existing code style
4. **Test thoroughly** using Storybook and Docker environment
5. **Format code**: `pnpm format`
6. **Commit changes**: Use conventional commit messages
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Development Guidelines

- Follow existing TypeScript and React patterns
- Add Storybook stories for new components
- Ensure accessibility compliance
- Test across different Keycloak flows
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Keycloakify](https://www.keycloakify.dev/) - For the amazing Keycloak theme framework
- [shadcn/ui](https://ui.shadcn.com/) - For the beautiful component system  
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework
- [Geist Font](https://vercel.com/font) - For the modern typography

## 🗺️ Roadmap

- [ ] Admin theme implementation
- [ ] Dark mode toggle
- [ ] Additional language support
- [ ] Custom branding system
- [ ] Advanced form validation
- [ ] Performance optimizations
- [ ] Accessibility improvements
- [ ] Additional shadcn/ui components

---

Built with ❤️ using modern web technologies. Star ⭐ the repo if you find it useful!