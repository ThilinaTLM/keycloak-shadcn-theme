import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CircleX } from "lucide-react";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
  const { kcContext, i18n, Template } = props;
  const { otpLogin, url, messagesPerField } = kcContext;
  const { msg, msgStr } = i18n;

  return (
    <Template {...props} displayMessage={!messagesPerField.existsError("totp")} headerNode={msg("doLogIn")}>
      <div className="w-full max-w-md">
        <div className="py-2 px-4 sm:rounded-lg sm:px-6">
          <form id="kc-otp-login-form" className="space-y-6" action={url.loginAction} method="post">
            {otpLogin.userOtpCredentials.length > 1 && (
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">{msg("loginOtpOneTime")}</Label>
                <RadioGroup defaultValue={otpLogin.selectedCredentialId} name="selectedCredentialId" className="grid gap-4">
                  {otpLogin.userOtpCredentials.map((otpCredential, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={otpCredential.id} id={`kc-otp-credential-${index}`} />
                      <Label
                        htmlFor={`kc-otp-credential-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {otpCredential.userLabel}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                {msg("loginOtpOneTime")}
              </Label>
              <Input
                id="otp"
                name="otp"
                autoComplete="off"
                type="text"
                className="h-10"
                autoFocus
                aria-invalid={messagesPerField.existsError("totp")}
              />
              {messagesPerField.existsError("totp") && (
                <Alert variant="destructive">
                  <CircleX className="w-4 h-4" />
                  <AlertDescription
                    id="input-error-otp-code"
                    aria-live="polite"
                    dangerouslySetInnerHTML={{
                      __html: kcSanitize(messagesPerField.get("totp"))
                    }}
                  />
                </Alert>
              )}
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" name="login" id="kc-login">
                {msgStr("doLogIn")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Template>
  );
}
