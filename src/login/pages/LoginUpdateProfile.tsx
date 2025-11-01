import type { JSX } from "keycloakify/tools/JSX";
import { useState } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";

type LoginUpdateProfileProps = PageProps<Extract<KcContext, { pageId: "login-update-profile.ftl" }>, I18n> & {
  UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
  doMakeUserConfirmPassword: boolean;
};

export default function LoginUpdateProfile(props: LoginUpdateProfileProps) {
  const { kcContext, i18n, Template, UserProfileFormFields, doMakeUserConfirmPassword } = props;
  const { messagesPerField, url, isAppInitiatedAction } = kcContext;
  const { msg, msgStr } = i18n;
  const [isFormSubmittable, setIsFormSubmittable] = useState(false);

  return (
    <Template {...props} displayRequiredFields headerNode={msg("loginProfileTitle")} displayMessage={messagesPerField.exists("global")}>
      <div className="w-full max-w-md">
        <div className="py-2 px-4 sm:rounded-lg sm:px-6">
          <form id="kc-update-profile-form" className="space-y-6" action={url.loginAction} method="post">
            <UserProfileFormFields
              kcContext={kcContext}
              i18n={i18n}
              kcClsx={() => ""}
              onIsFormSubmittableValueChange={setIsFormSubmittable}
              doMakeUserConfirmPassword={doMakeUserConfirmPassword}
            />

            <div className="flex gap-4">
              {isAppInitiatedAction ? (
                <>
                  <Button type="submit" className="flex-1" disabled={!isFormSubmittable}>
                    {msgStr("doSubmit")}
                  </Button>
                  <Button type="submit" name="cancel-aia" value="true" variant="outline" className="flex-1" formNoValidate>
                    {msg("doCancel")}
                  </Button>
                </>
              ) : (
                <Button type="submit" className="w-full" disabled={!isFormSubmittable}>
                  {msgStr("doSubmit")}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Template>
  );
}
