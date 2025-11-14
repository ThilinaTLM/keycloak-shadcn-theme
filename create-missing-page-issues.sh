#!/bin/bash

# Script to create GitHub issues for all missing Keycloak pages
# Run this script from the repository root

set -e

# Define colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Creating GitHub issues for missing Keycloak pages...${NC}\n"

# Counter
count=0

# Common footer for all issues
read -r -d '' COMMON_FOOTER << 'EOF' || true

## Implementation Guidelines

### Follow the shadcn Theme Pattern

This page should follow the same styling patterns as already ported components:

**Reference Components:**
- [`src/login/pages/Login.tsx`](../blob/main/src/login/pages/Login.tsx) - Main login page (best reference)
- [`src/login/pages/Register.tsx`](../blob/main/src/login/pages/Register.tsx) - Registration page
- [`src/login/pages/LoginOtp.tsx`](../blob/main/src/login/pages/LoginOtp.tsx) - OTP input page

**Key Requirements:**

1. **Use shadcn/ui Components** from `src/components/ui/`:
   - `Button` for all buttons
   - `Input` for text inputs
   - `Checkbox` for checkboxes
   - `Separator` for dividers
   - Other components as needed

2. **Follow Global CSS** (`src/global.css`):
   - Use CSS custom properties (e.g., `--color-primary`, `--color-foreground`)
   - Use Tailwind classes with theme colors (e.g., `bg-primary`, `text-foreground`)
   - Support both light and dark modes (`.dark` class)
   - Use consistent spacing: `space-y-6` for form sections, `mt-1` for field spacing

3. **Import Required Dependencies**:
   ```typescript
   import type { PageProps } from "keycloakify/login/pages/PageProps";
   import type { KcContext } from "../KcContext";
   import type { I18n } from "../i18n";
   import { Button } from "@/components/ui/button.tsx";
   import { Input } from "@/components/ui/input.tsx";
   // Add other components as needed
   ```

4. **Component Structure**:
   ```typescript
   export default function PageName(
     props: PageProps<Extract<KcContext, { pageId: "page-name.ftl" }>, I18n>
   ) {
     const { kcContext, i18n, Template } = props;
     const { msg, msgStr } = i18n;
     // Extract needed properties from kcContext

     return (
       <Template {...props} headerNode={msg("pageTitle")}>
         {/* Page content */}
       </Template>
     );
   }
   ```

5. **Error Handling & Validation**:
   - Use `messagesPerField.existsError()` for field-level errors
   - Display errors with `text-destructive` class
   - Use `aria-invalid` for accessibility

6. **Styling Conventions**:
   - Form containers: `w-full max-w-md`
   - Form elements: `space-y-6`
   - Labels: `text-sm font-medium text-foreground`
   - Inputs: `h-10` for consistent height
   - Error messages: `mt-2 text-sm text-destructive`

### Implementation Steps

1. **Review the existing component** in `src/login/pages/` (component already exists but not routed)
2. **Update styling** to match shadcn theme patterns if needed
3. **Import the component** in `src/login/KcPage.tsx`
4. **Add a case** to the switch statement in `KcPage.tsx`:
   ```typescript
   case "page-name.ftl":
     return <PageName {...{ kcContext, i18n, classes }} Template={Template} doUseDefaultCss={true} />;
   ```
5. **Test in Storybook**: Run `pnpm storybook` and verify the page renders correctly
6. **Build and test**: Run `pnpm build-keycloak-theme` and test in Docker environment

### Testing Checklist

- [ ] Component renders without errors in Storybook
- [ ] All form fields are accessible and functional
- [ ] Error states display correctly
- [ ] Dark mode works properly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Follows shadcn theme styling (colors, spacing, typography)
- [ ] Integration with Keycloak works in Docker environment

### Additional Resources

- [DEVELOPMENT.md](../blob/main/DEVELOPMENT.md) - Complete development guide
- [CLAUDE.md](../blob/main/CLAUDE.md) - Project architecture overview
- [Keycloakify Documentation](https://docs.keycloakify.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
EOF

# =============================================================================
# Authentication & MFA Pages
# =============================================================================

((count++))
gh issue create \
  --title "Add login-config-totp.ftl page to router" \
  --label "enhancement,good first issue,keycloak-page" \
  --body "$(cat << EOF
## Overview

Port the **TOTP Configuration** page (login-config-totp.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/LoginConfigTotp.tsx\`
✅ Storybook story exists: \`src/login/pages/LoginConfigTotp.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page allows users to configure Time-based One-Time Password (TOTP) authentication. It displays a QR code and manual entry key for setting up 2FA with authenticator apps like Google Authenticator or Authy.

## Page Details

- **Page ID**: \`login-config-totp.ftl\`
- **Component**: \`LoginConfigTotp\`
- **Category**: Multi-Factor Authentication (MFA)
- **Complexity**: Medium (includes QR code display and form)

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: login-config-totp.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add login-reset-otp.ftl page to router" \
  --label "enhancement,good first issue,keycloak-page" \
  --body "$(cat << EOF
## Overview

Port the **Reset OTP** page (login-reset-otp.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/LoginResetOtp.tsx\`
✅ Storybook story exists: \`src/login/pages/LoginResetOtp.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page allows users to reset their OTP (One-Time Password) configuration. Users can choose which OTP credential to remove or reconfigure.

## Page Details

- **Page ID**: \`login-reset-otp.ftl\`
- **Component**: \`LoginResetOtp\`
- **Category**: Multi-Factor Authentication (MFA)
- **Complexity**: Low

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: login-reset-otp.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add login-recovery-authn-code-config.ftl page to router" \
  --label "enhancement,keycloak-page" \
  --body "$(cat << EOF
## Overview

Port the **Recovery Authentication Code Configuration** page (login-recovery-authn-code-config.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/LoginRecoveryAuthnCodeConfig.tsx\`
✅ Storybook story exists: \`src/login/pages/LoginRecoveryAuthnCodeConfig.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page displays recovery codes that users can use as backup authentication when they lose access to their primary 2FA method. Users must save these codes securely.

## Page Details

- **Page ID**: \`login-recovery-authn-code-config.ftl\`
- **Component**: \`LoginRecoveryAuthnCodeConfig\`
- **Category**: Multi-Factor Authentication (MFA)
- **Complexity**: Medium (displays list of recovery codes)

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: login-recovery-authn-code-config.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add login-recovery-authn-code-input.ftl page to router" \
  --label "enhancement,good first issue,keycloak-page" \
  --body "$(cat << EOF
## Overview

Port the **Recovery Code Input** page (login-recovery-authn-code-input.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/LoginRecoveryAuthnCodeInput.tsx\`
✅ Storybook story exists: \`src/login/pages/LoginRecoveryAuthnCodeInput.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page allows users to enter a recovery authentication code when they cannot access their primary 2FA method.

## Page Details

- **Page ID**: \`login-recovery-authn-code-input.ftl\`
- **Component**: \`LoginRecoveryAuthnCodeInput\`
- **Category**: Multi-Factor Authentication (MFA)
- **Complexity**: Low

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: login-recovery-authn-code-input.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add select-authenticator.ftl page to router" \
  --label "enhancement,keycloak-page" \
  --body "$(cat << EOF
## Overview

Port the **Authenticator Selection** page (select-authenticator.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/SelectAuthenticator.tsx\`
✅ Storybook story exists: \`src/login/pages/SelectAuthenticator.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page allows users to choose between multiple available authentication methods (e.g., password, OTP, recovery code, WebAuthn) when multiple options are configured.

## Page Details

- **Page ID**: \`select-authenticator.ftl\`
- **Component**: \`SelectAuthenticator\`
- **Category**: Multi-Factor Authentication (MFA)
- **Complexity**: Medium (displays list of available authenticators)

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: select-authenticator.ftl"

# =============================================================================
# WebAuthn/Passkeys Pages
# =============================================================================

((count++))
gh issue create \
  --title "Add webauthn-authenticate.ftl page to router" \
  --label "enhancement,keycloak-page,webauthn" \
  --body "$(cat << EOF
## Overview

Port the **WebAuthn Authentication** page (webauthn-authenticate.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/WebauthnAuthenticate.tsx\`
✅ Storybook story exists: \`src/login/pages/WebauthnAuthenticate.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page handles WebAuthn/Passkeys authentication. It prompts users to authenticate using biometric sensors, security keys, or platform authenticators.

## Page Details

- **Page ID**: \`webauthn-authenticate.ftl\`
- **Component**: \`WebauthnAuthenticate\`
- **Category**: WebAuthn/Passkeys
- **Complexity**: Medium (includes WebAuthn API integration)

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: webauthn-authenticate.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add webauthn-register.ftl page to router" \
  --label "enhancement,keycloak-page,webauthn" \
  --body "$(cat << EOF
## Overview

Port the **WebAuthn Registration** page (webauthn-register.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/WebauthnRegister.tsx\`
✅ Storybook story exists: \`src/login/pages/WebauthnRegister.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page allows users to register a new WebAuthn credential (passkey, security key, or biometric authentication).

## Page Details

- **Page ID**: \`webauthn-register.ftl\`
- **Component**: \`WebauthnRegister\`
- **Category**: WebAuthn/Passkeys
- **Complexity**: Medium (includes WebAuthn API integration)

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: webauthn-register.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add webauthn-error.ftl page to router" \
  --label "enhancement,good first issue,keycloak-page,webauthn" \
  --body "$(cat << EOF
## Overview

Port the **WebAuthn Error** page (webauthn-error.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/WebauthnError.tsx\`
✅ Storybook story exists: \`src/login/pages/WebauthnError.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page displays errors that occur during WebAuthn authentication or registration processes.

## Page Details

- **Page ID**: \`webauthn-error.ftl\`
- **Component**: \`WebauthnError\`
- **Category**: WebAuthn/Passkeys
- **Complexity**: Low (error display page)

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: webauthn-error.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add login-passkeys-conditional-authenticate.ftl page to router" \
  --label "enhancement,keycloak-page,webauthn" \
  --body "$(cat << EOF
## Overview

Port the **Conditional Passkeys Authentication** page (login-passkeys-conditional-authenticate.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/LoginPasskeysConditionalAuthenticate.tsx\`
✅ Storybook story exists: \`src/login/pages/LoginPasskeysConditionalAuthenticate.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page provides conditional UI for passkey-based authentication, allowing browser-mediated passkey selection.

## Page Details

- **Page ID**: \`login-passkeys-conditional-authenticate.ftl\`
- **Component**: \`LoginPasskeysConditionalAuthenticate\`
- **Category**: WebAuthn/Passkeys
- **Complexity**: High (advanced WebAuthn feature)

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: login-passkeys-conditional-authenticate.ftl"

# =============================================================================
# Identity Provider Integration Pages
# =============================================================================

((count++))
gh issue create \
  --title "Add login-idp-link-email.ftl page to router" \
  --label "enhancement,keycloak-page,idp" \
  --body "$(cat << EOF
## Overview

Port the **IdP Email Linking** page (login-idp-link-email.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/LoginIdpLinkEmail.tsx\`
✅ Storybook story exists: \`src/login/pages/LoginIdpLinkEmail.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page informs users that an email has been sent to link their identity provider account with their existing account.

## Page Details

- **Page ID**: \`login-idp-link-email.ftl\`
- **Component**: \`LoginIdpLinkEmail\`
- **Category**: Identity Provider (IdP) Integration
- **Complexity**: Low (information page)

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: login-idp-link-email.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add login-idp-link-confirm.ftl page to router" \
  --label "enhancement,good first issue,keycloak-page,idp" \
  --body "$(cat << EOF
## Overview

Port the **IdP Link Confirmation** page (login-idp-link-confirm.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/LoginIdpLinkConfirm.tsx\`
✅ Storybook story exists: \`src/login/pages/LoginIdpLinkConfirm.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page asks users to confirm linking their identity provider account with an existing account.

## Page Details

- **Page ID**: \`login-idp-link-confirm.ftl\`
- **Component**: \`LoginIdpLinkConfirm\`
- **Category**: Identity Provider (IdP) Integration
- **Complexity**: Low

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: login-idp-link-confirm.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add login-idp-link-confirm-override.ftl page to router" \
  --label "enhancement,good first issue,keycloak-page,idp" \
  --body "$(cat << EOF
## Overview

Port the **IdP Link Confirmation Override** page (login-idp-link-confirm-override.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/LoginIdpLinkConfirmOverride.tsx\`
✅ Storybook story exists: \`src/login/pages/LoginIdpLinkConfirmOverride.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page asks users to confirm overriding an existing identity provider link with a new one.

## Page Details

- **Page ID**: \`login-idp-link-confirm-override.ftl\`
- **Component**: \`LoginIdpLinkConfirmOverride\`
- **Category**: Identity Provider (IdP) Integration
- **Complexity**: Low

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: login-idp-link-confirm-override.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add idp-review-user-profile.ftl page to router" \
  --label "enhancement,keycloak-page,idp" \
  --body "$(cat << EOF
## Overview

Port the **Review User Profile from IdP** page (idp-review-user-profile.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/IdpReviewUserProfile.tsx\`
✅ Storybook story exists: \`src/login/pages/IdpReviewUserProfile.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page allows users to review and update their profile information retrieved from an identity provider before completing registration.

## Page Details

- **Page ID**: \`idp-review-user-profile.ftl\`
- **Component**: \`IdpReviewUserProfile\`
- **Category**: Identity Provider (IdP) Integration
- **Complexity**: Medium (includes UserProfileFormFields)

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: idp-review-user-profile.ftl"

# =============================================================================
# OAuth & Device Flow Pages
# =============================================================================

((count++))
gh issue create \
  --title "Add login-oauth-grant.ftl page to router" \
  --label "enhancement,keycloak-page,oauth" \
  --body "$(cat << EOF
## Overview

Port the **OAuth Consent/Grant** page (login-oauth-grant.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/LoginOauthGrant.tsx\`
✅ Storybook story exists: \`src/login/pages/LoginOauthGrant.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page displays the OAuth consent screen where users authorize a client application to access their account with specific scopes.

## Page Details

- **Page ID**: \`login-oauth-grant.ftl\`
- **Component**: \`LoginOauthGrant\`
- **Category**: OAuth & Authorization
- **Complexity**: Medium (displays client info and requested scopes)

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: login-oauth-grant.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add login-oauth2-device-verify-user-code.ftl page to router" \
  --label "enhancement,keycloak-page,oauth" \
  --body "$(cat << EOF
## Overview

Port the **OAuth2 Device Code Verification** page (login-oauth2-device-verify-user-code.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/LoginOauth2DeviceVerifyUserCode.tsx\`
✅ Storybook story exists: \`src/login/pages/LoginOauth2DeviceVerifyUserCode.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page allows users to enter a device code for OAuth2 device authorization flow (e.g., smart TVs, IoT devices).

## Page Details

- **Page ID**: \`login-oauth2-device-verify-user-code.ftl\`
- **Component**: \`LoginOauth2DeviceVerifyUserCode\`
- **Category**: OAuth & Authorization
- **Complexity**: Low

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: login-oauth2-device-verify-user-code.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add code.ftl page to router" \
  --label "enhancement,good first issue,keycloak-page,oauth" \
  --body "$(cat << EOF
## Overview

Port the **Authorization Code** page (code.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/Code.tsx\`
✅ Storybook story exists: \`src/login/pages/Code.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page displays an authorization code or device code that users need to copy and enter into another application or device.

## Page Details

- **Page ID**: \`code.ftl\`
- **Component**: \`Code\`
- **Category**: OAuth & Authorization
- **Complexity**: Low (display code with copy functionality)

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: code.ftl"

# =============================================================================
# Profile & Account Management Pages
# =============================================================================

((count++))
gh issue create \
  --title "Add login-update-profile.ftl page to router" \
  --label "enhancement,keycloak-page,profile" \
  --body "$(cat << EOF
## Overview

Port the **Update Profile** page (login-update-profile.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/LoginUpdateProfile.tsx\`
✅ Storybook story exists: \`src/login/pages/LoginUpdateProfile.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page prompts users to update their profile information (name, email, etc.) when required by the authentication flow.

## Page Details

- **Page ID**: \`login-update-profile.ftl\`
- **Component**: \`LoginUpdateProfile\`
- **Category**: Profile & Account Management
- **Complexity**: Medium (includes UserProfileFormFields)

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: login-update-profile.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add update-email.ftl page to router" \
  --label "enhancement,keycloak-page,profile" \
  --body "$(cat << EOF
## Overview

Port the **Update Email** page (update-email.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/UpdateEmail.tsx\`
✅ Storybook story exists: \`src/login/pages/UpdateEmail.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page allows users to update their email address.

## Page Details

- **Page ID**: \`update-email.ftl\`
- **Component**: \`UpdateEmail\`
- **Category**: Profile & Account Management
- **Complexity**: Low

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: update-email.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add delete-credential.ftl page to router" \
  --label "enhancement,good first issue,keycloak-page,profile" \
  --body "$(cat << EOF
## Overview

Port the **Delete Credential** page (delete-credential.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/DeleteCredential.tsx\`
✅ Storybook story exists: \`src/login/pages/DeleteCredential.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page asks users to confirm deletion of a credential (password, OTP, etc.).

## Page Details

- **Page ID**: \`delete-credential.ftl\`
- **Component**: \`DeleteCredential\`
- **Category**: Profile & Account Management
- **Complexity**: Low (confirmation page)

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: delete-credential.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add delete-account-confirm.ftl page to router" \
  --label "enhancement,good first issue,keycloak-page,profile" \
  --body "$(cat << EOF
## Overview

Port the **Delete Account Confirmation** page (delete-account-confirm.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/DeleteAccountConfirm.tsx\`
✅ Storybook story exists: \`src/login/pages/DeleteAccountConfirm.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page asks users to confirm permanent deletion of their account.

## Page Details

- **Page ID**: \`delete-account-confirm.ftl\`
- **Component**: \`DeleteAccountConfirm\`
- **Category**: Profile & Account Management
- **Complexity**: Low (confirmation page with warning)

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: delete-account-confirm.ftl"

# =============================================================================
# Advanced/Specialized Pages
# =============================================================================

((count++))
gh issue create \
  --title "Add login-x509-info.ftl page to router" \
  --label "enhancement,keycloak-page,advanced" \
  --body "$(cat << EOF
## Overview

Port the **X.509 Certificate Info** page (login-x509-info.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/LoginX509Info.tsx\`
✅ Storybook story exists: \`src/login/pages/LoginX509Info.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page displays information about X.509 client certificate authentication, including certificate details.

## Page Details

- **Page ID**: \`login-x509-info.ftl\`
- **Component**: \`LoginX509Info\`
- **Category**: Advanced Authentication
- **Complexity**: Medium (displays certificate information)

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: login-x509-info.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add terms.ftl page to router" \
  --label "enhancement,good first issue,keycloak-page" \
  --body "$(cat << EOF
## Overview

Port the **Terms and Conditions** page (terms.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/Terms.tsx\`
✅ Storybook story exists: \`src/login/pages/Terms.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page displays terms and conditions that users must accept before proceeding.

## Page Details

- **Page ID**: \`terms.ftl\`
- **Component**: \`Terms\`
- **Category**: Legal/Compliance
- **Complexity**: Low

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: terms.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add saml-post-form.ftl page to router" \
  --label "enhancement,keycloak-page,advanced" \
  --body "$(cat << EOF
## Overview

Port the **SAML POST Form** page (saml-post-form.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/SamlPostForm.tsx\`
✅ Storybook story exists: \`src/login/pages/SamlPostForm.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page auto-submits a SAML POST form to complete SAML authentication flow.

## Page Details

- **Page ID**: \`saml-post-form.ftl\`
- **Component**: \`SamlPostForm\`
- **Category**: SAML/SSO
- **Complexity**: Low (auto-submit form)

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: saml-post-form.ftl"

# -----------------------------------------------------------------------------

((count++))
gh issue create \
  --title "Add frontchannel-logout.ftl page to router" \
  --label "enhancement,good first issue,keycloak-page" \
  --body "$(cat << EOF
## Overview

Port the **Front-channel Logout** page (frontchannel-logout.ftl) to use the shadcn theme by adding it to the router in \`KcPage.tsx\`.

## Current Status

✅ Component exists: \`src/login/pages/FrontchannelLogout.tsx\`
✅ Storybook story exists: \`src/login/pages/FrontchannelLogout.stories.tsx\`
❌ Not added to router in \`KcPage.tsx\`

## Description

This page handles front-channel logout, triggering logout across all applications in a session.

## Page Details

- **Page ID**: \`frontchannel-logout.ftl\`
- **Component**: \`FrontchannelLogout\`
- **Category**: Session Management
- **Complexity**: Low

$COMMON_FOOTER
EOF
)"

echo -e "${GREEN}[$count/24]${NC} Created issue: frontchannel-logout.ftl"

# =============================================================================
# Summary
# =============================================================================

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Successfully created $count GitHub issues!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "All issues have been created with:"
echo "  - Detailed descriptions"
echo "  - Implementation guidelines"
echo "  - References to existing components"
echo "  - Testing checklists"
echo "  - Appropriate labels"
echo ""
echo "View all issues at: https://github.com/ThilinaTLM/keycloak-shadcn-theme/issues"
echo ""
