import { useState, useEffect, useReducer } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { assert } from "keycloakify/tools/assert";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPassword(props: PageProps<Extract<KcContext, { pageId: "login-password.ftl" }>, I18n>) {
  const { kcContext, i18n, Template } = props;
  const { realm, url, messagesPerField } = kcContext;
  const { msg, msgStr } = i18n;
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

  return (
    <Template {...props} headerNode={msg("doLogIn")} displayMessage={!messagesPerField.existsError("password")}>
      <div className="w-full max-w-md">
        <div className="py-2 px-4 sm:rounded-lg sm:px-6">
          <form
            id="kc-form-login"
            onSubmit={() => {
              setIsLoginButtonDisabled(true);
              return true;
            }}
            action={url.loginAction}
            method="post"
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="password">{msg("password")}</Label>

              <PasswordWrapper i18n={i18n} passwordInputId="password">
                <Input
                  tabIndex={2}
                  id="password"
                  name="password"
                  type="password"
                  autoFocus
                  autoComplete="on"
                  className="h-10"
                  aria-invalid={messagesPerField.existsError("username", "password")}
                />
              </PasswordWrapper>

              {messagesPerField.existsError("password") && (
                <Alert variant="destructive">
                  <AlertDescription
                    id="input-error-password"
                    aria-live="polite"
                    dangerouslySetInnerHTML={{
                      __html: kcSanitize(messagesPerField.get("password"))
                    }}
                  />
                </Alert>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-end">
                {realm.resetPasswordAllowed && (
                  <a className="text-sm font-medium text-primary hover:text-primary/80" tabIndex={5} href={url.loginResetCredentialsUrl}>
                    {msg("doForgotPassword")}
                  </a>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoginButtonDisabled} tabIndex={4}>
                {msgStr("doLogIn")}
              </Button>
            </div>
          </form>
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
    <div className="relative">
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
