import { useEffect, useReducer, useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { assert } from "keycloakify/tools/assert";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { ProviderIcon } from "../lib/providerIcons";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
  const { kcContext, i18n, Template } = props;
  const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;
  const { msg, msgStr } = i18n;
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

  return (
    <Template
      {...props}
      displayMessage={!messagesPerField.existsError("username", "password")}
      headerNode={msg("loginAccountTitle")}
      displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
      infoNode={
        <span>
          {msg("noAccount")}{" "}
          <a className="text-primary hover:underline" tabIndex={8} href={url.registrationUrl}>
            {msg("doRegister")}
          </a>
        </span>
      }
      socialProvidersNode={
        <>
          {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
            <div id="kc-social-providers" className="mt-2 w-full px-4 sm:px-6">
              <hr className="my-0" />
              <h2 className="text-base mt-2 mb-4 text-center">{msg("identity-provider-login-label")}</h2>
              <ul className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
                {social.providers.map((p) => (
                  <li key={p.alias}>
                    <a
                      id={`social-${p.alias}`}
                      className="flex items-center justify-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-accent"
                      href={p.loginUrl}
                    >
                      <ProviderIcon alias={p.alias} size={20} className="mr-2" />
                      <span dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      }
    >
      <div className="w-full max-w-md">
        <div className="py-8 px-4 sm:rounded-lg sm:px-6">
          {realm.password && (
            <form
              onSubmit={() => {
                setIsLoginButtonDisabled(true);
                return true;
              }}
              action={url.loginAction}
              method="post"
              className="space-y-6"
            >
              {!usernameHidden && (
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-foreground">
                    {!realm.loginWithEmailAllowed ? msg("username") : !realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")}
                  </label>
                  <div className="mt-1">
                    <Input
                      tabIndex={2}
                      id="username"
                      name="username"
                      defaultValue={login.username ?? ""}
                      type="text"
                      autoFocus
                      autoComplete="username"
                      aria-invalid={messagesPerField.existsError("username", "password")}
                      className="h-10"
                    />
                  </div>
                  {messagesPerField.existsError("username", "password") && (
                    <p className="mt-2 text-sm text-destructive" id="input-error" aria-live="polite">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                        }}
                      />
                    </p>
                  )}
                </div>
              )}

              {usernameHidden && auth.showUsername && (
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-foreground">
                    {!realm.loginWithEmailAllowed ? msg("username") : !realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")}
                  </label>
                  <div className="mt-1 relative">
                    <Input
                      tabIndex={2}
                      id="username"
                      name="username"
                      defaultValue={auth.attemptedUsername ?? ""}
                      type="text"
                      disabled
                      className="h-10 bg-muted pr-10"
                    />
                    <a
                      href={url.loginRestartFlowUrl}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      title={msgStr("restartLoginTooltip")}
                    >
                      <RotateCcw size={16} />
                    </a>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  {msg("password")}
                </label>
                <PasswordWrapper i18n={i18n} passwordInputId="password">
                  <Input
                    tabIndex={3}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    aria-invalid={messagesPerField.existsError("username", "password")}
                    className="h-10"
                  />
                </PasswordWrapper>
                {usernameHidden && messagesPerField.existsError("username", "password") && (
                  <p className="mt-2 text-sm text-destructive" id="input-error" aria-live="polite">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                      }}
                    />
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                {realm.rememberMe && !usernameHidden && (
                  <div className="flex items-center space-x-2">
                    <Checkbox id="rememberMe" name="rememberMe" defaultChecked={!!login.rememberMe} />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {msg("rememberMe")}
                    </label>
                  </div>
                )}
                {realm.resetPasswordAllowed && (
                  <div className="text-sm">
                    <a tabIndex={6} href={url.loginResetCredentialsUrl} className="font-medium text-primary hover:text-primary/80">
                      {msg("doForgotPassword")}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                <Button disabled={isLoginButtonDisabled} name="login" type="submit" variant="default" className="w-full">
                  {msgStr("doLogIn")}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Template>
  );
}

function PasswordWrapper(props: { i18n: I18n; passwordInputId: string; children: JSX.Element }) {
  const { i18n, passwordInputId, children } = props;
  const { msgStr } = i18n;
  const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer((state: boolean) => !state, false);

  useEffect(() => {
    const passwordInputElement = document.getElementById(passwordInputId);
    assert(passwordInputElement instanceof HTMLInputElement);
    passwordInputElement.type = isPasswordRevealed ? "text" : "password";
  }, [isPasswordRevealed]);

  return (
    <div className="mt-1 relative">
      {children}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
        onClick={toggleIsPasswordRevealed}
        aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
        aria-controls={passwordInputId}
      >
        {isPasswordRevealed ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
      </Button>
    </div>
  );
}
