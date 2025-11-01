import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

export default function LoginUsername(props: PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>) {
  const { kcContext, i18n, Template } = props;
  const { social, realm, url, usernameHidden, login, registrationDisabled, messagesPerField } = kcContext;
  const { msg, msgStr } = i18n;
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

  return (
    <Template
      {...props}
      displayMessage={!messagesPerField.existsError("username")}
      displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
      infoNode={
        <span>
          {msg("noAccount")}{" "}
          <a className="text-primary hover:underline" tabIndex={6} href={url.registrationUrl}>
            {msg("doRegister")}
          </a>
        </span>
      }
      headerNode={msg("doLogIn")}
      socialProvidersNode={
        <>
          {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
            <div id="kc-social-providers" className="mt-6">
              <hr className="my-6" />
              <h2 className="text-xl font-semibold mb-4">{msg("identity-provider-login-label")}</h2>
              <ul className={`grid ${social.providers.length > 3 ? "grid-cols-2 gap-4" : "grid-cols-1 gap-2"}`}>
                {social.providers.map((p) => (
                  <li key={p.alias}>
                    <a
                      id={`social-${p.alias}`}
                      className="flex items-center justify-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-accent"
                      href={p.loginUrl}
                    >
                      {p.iconClasses && <i className={`mr-2 ${p.iconClasses}`} aria-hidden="true"></i>}
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
        <div className="py-2 px-4 sm:rounded-lg sm:px-6">
          {realm.password && (
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
              {!usernameHidden && (
                <div className="space-y-2">
                  <Label htmlFor="username">
                    {!realm.loginWithEmailAllowed ? msg("username") : !realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")}
                  </Label>
                  <Input
                    tabIndex={2}
                    id="username"
                    name="username"
                    defaultValue={login.username ?? ""}
                    type="text"
                    autoFocus
                    autoComplete="off"
                    className="h-10"
                    aria-invalid={messagesPerField.existsError("username")}
                  />
                  {messagesPerField.existsError("username") && (
                    <Alert variant="destructive">
                      <AlertDescription
                        id="input-error"
                        aria-live="polite"
                        dangerouslySetInnerHTML={{
                          __html: kcSanitize(messagesPerField.getFirstError("username"))
                        }}
                      />
                    </Alert>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {realm.rememberMe && !usernameHidden && (
                  <div className="flex items-center space-x-2">
                    <Checkbox id="rememberMe" name="rememberMe" defaultChecked={!!login.rememberMe} tabIndex={3} />
                    <Label
                      htmlFor="rememberMe"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {msg("rememberMe")}
                    </Label>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoginButtonDisabled} tabIndex={4}>
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
