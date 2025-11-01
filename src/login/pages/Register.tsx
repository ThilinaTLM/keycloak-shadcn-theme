import { useState } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
  UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
  doMakeUserConfirmPassword: boolean;
};

export default function Register(props: RegisterProps) {
  const { kcContext, i18n, Template, UserProfileFormFields, doMakeUserConfirmPassword } = props;

  const { messageHeader, url, messagesPerField, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction, termsAcceptanceRequired } =
    kcContext;

  const { msg, msgStr, advancedMsg } = i18n;

  const [isFormSubmittable, setIsFormSubmittable] = useState(false);
  const [areTermsAccepted, setAreTermsAccepted] = useState(false);

  return (
    <Template
      {...props}
      headerNode={messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
      displayMessage={messagesPerField.exists("global")}
    >
      <div className="w-full max-w-md">
        <div className="py-2 px-4 sm:rounded-lg sm:px-6">
          <form id="kc-register-form" className="space-y-6" action={url.registrationAction} method="post">
            <UserProfileFormFields
              kcContext={kcContext}
              i18n={i18n}
              onIsFormSubmittableValueChange={setIsFormSubmittable}
              doMakeUserConfirmPassword={doMakeUserConfirmPassword}
              kcClsx={() => ""}
            />

            {termsAcceptanceRequired && (
              <TermsAcceptance
                i18n={i18n}
                messagesPerField={messagesPerField}
                areTermsAccepted={areTermsAccepted}
                onAreTermsAcceptedValueChange={setAreTermsAccepted}
              />
            )}

            {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
              <div className="mt-4">
                <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction}></div>
              </div>
            )}

            <div className="flex flex-col space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <a href={url.loginUrl} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {msg("backToLogin")}
                </a>
              </div>

              {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                <Button
                  className="w-full g-recaptcha"
                  data-sitekey={recaptchaSiteKey}
                  data-callback={() => {
                    (document.getElementById("kc-register-form") as HTMLFormElement).submit();
                  }}
                  data-action={recaptchaAction}
                  type="submit"
                >
                  {msg("doRegister")}
                </Button>
              ) : (
                <Button type="submit" className="w-full" disabled={!isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)}>
                  {msgStr("doRegister")}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Template>
  );
}

function TermsAcceptance(props: {
  i18n: I18n;
  messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
  areTermsAccepted: boolean;
  onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}) {
  const { i18n, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;
  const { msg } = i18n;

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">{msg("termsTitle")}</h3>
        <div className="text-sm text-gray-700" id="kc-registration-terms-text">
          {msg("termsText")}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="termsAccepted"
          name="termsAccepted"
          checked={areTermsAccepted}
          onCheckedChange={(checked) => onAreTermsAcceptedValueChange(checked as boolean)}
          aria-invalid={messagesPerField.existsError("termsAccepted")}
        />
        <label htmlFor="termsAccepted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {msg("acceptTerms")}
        </label>
      </div>

      {messagesPerField.existsError("termsAccepted") && (
        <Alert variant="destructive">
          <AlertDescription
            id="input-error-terms-accepted"
            aria-live="polite"
            dangerouslySetInnerHTML={{
              __html: kcSanitize(messagesPerField.get("termsAccepted"))
            }}
          />
        </Alert>
      )}
    </div>
  );
}
