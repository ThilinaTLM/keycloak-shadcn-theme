import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
  const { kcContext, i18n, Template } = props;
  const { url, realm, auth, messagesPerField } = kcContext;
  const { msg } = i18n;

  return (
    <Template
      {...props}
      displayInfo
      displayMessage={!messagesPerField.existsError("username")}
      infoNode={realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")}
      headerNode={msg("emailForgotTitle")}
    >
      <div className="w-full max-w-md">
        <div className="py-2 px-4 sm:rounded-lg sm:px-6">
          <form id="kc-reset-password-form" className="space-y-6" action={url.loginAction} method="post">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  {!realm.loginWithEmailAllowed ? msg("username") : !realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")}
                </Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  className="h-10"
                  autoFocus
                  defaultValue={auth?.attemptedUsername ?? ""}
                  aria-invalid={messagesPerField.existsError("username")}
                />
                {messagesPerField.existsError("username") && (
                  <Alert variant="destructive">
                    <AlertDescription
                      id="input-error-username"
                      aria-live="polite"
                      dangerouslySetInnerHTML={{
                        __html: kcSanitize(messagesPerField.get("username"))
                      }}
                    />
                  </Alert>
                )}
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <a href={url.loginUrl} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    {msg("backToLogin")}
                  </a>
                </div>

                <Button type="submit" className="w-full">
                  {msg("doSubmit")}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Template>
  );
}
