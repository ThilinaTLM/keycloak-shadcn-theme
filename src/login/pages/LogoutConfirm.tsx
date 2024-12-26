import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function LogoutConfirm(props: PageProps<Extract<KcContext, { pageId: "logout-confirm.ftl" }>, I18n>) {
  const { kcContext, i18n, Template } = props;
  const { url, client, logoutConfirm } = kcContext;
  const { msg, msgStr } = i18n;

  return (
    <Template {...props} headerNode={msg("logoutConfirmTitle")}>
      <div className="w-full max-w-md">
        <div className="py-2 px-4 sm:rounded-lg sm:px-6">
          <div id="kc-logout-confirm" className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>{msg("logoutConfirmHeader")}</AlertDescription>
            </Alert>

            <form action={url.logoutConfirmAction} method="POST" className="space-y-6">
              <input type="hidden" name="session_code" value={logoutConfirm.code} />

              <div className="space-y-4">
                <Button type="submit" name="confirmLogout" id="kc-logout" className="w-full" tabIndex={4}>
                  {msgStr("doLogout")}
                </Button>

                {!logoutConfirm.skipLink && client.baseUrl && (
                  <div className="text-center">
                    <a href={client.baseUrl} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      {msg("backToApplication")}
                    </a>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Template>
  );
}
