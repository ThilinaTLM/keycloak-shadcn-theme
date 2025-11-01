import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function SelectAuthenticator(props: PageProps<Extract<KcContext, { pageId: "select-authenticator.ftl" }>, I18n>) {
  const { kcContext, i18n, Template } = props;
  const { url, auth } = kcContext;
  const { msg, advancedMsg } = i18n;

  return (
    <Template {...props} displayInfo={false} headerNode={msg("loginChooseAuthenticator")}>
      <div className="w-full max-w-md">
        <div className="py-2 px-4 sm:rounded-lg sm:px-6">
          <form id="kc-select-credential-form" action={url.loginAction} method="post" className="space-y-3">
            {auth.authenticationSelections.map((authenticationSelection, i) => (
              <Button
                key={i}
                type="submit"
                name="authenticationExecution"
                value={authenticationSelection.authExecId}
                variant="outline"
                className="w-full h-auto p-4 flex items-center justify-start gap-4 hover:bg-accent"
              >
                {authenticationSelection.iconCssClass && (
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                    <i className={`${authenticationSelection.iconCssClass} text-primary text-xl`} aria-hidden="true" />
                  </div>
                )}
                <div className="flex-1 text-left space-y-1">
                  <div className="font-medium text-foreground">{advancedMsg(authenticationSelection.displayName)}</div>
                  <div className="text-sm text-muted-foreground">{advancedMsg(authenticationSelection.helpText)}</div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </Button>
            ))}
          </form>
        </div>
      </div>
    </Template>
  );
}
