import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function LoginVerifyEmail(props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>) {
  const { kcContext, i18n, Template } = props;
  const { msg } = i18n;
  const { url, user } = kcContext;

  return (
    <Template {...props} displayInfo headerNode={msg("emailVerifyTitle")}>
      <div className="w-full max-w-md">
        <div className="py-2 px-4 sm:rounded-lg sm:px-6">
          <div className="space-y-6">
            {/* Primary instruction with email */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">{msg("emailVerifyInstruction1", user?.email ?? "")}</AlertDescription>
            </Alert>

            {/* Secondary instructions with link */}
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>{msg("emailVerifyInstruction2")}</p>

              <p>
                <a href={url.loginAction} className="text-primary hover:text-primary/80 font-medium">
                  {msg("doClickHere")}
                </a>
                &nbsp;
                {msg("emailVerifyInstruction3")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Template>
  );
}
