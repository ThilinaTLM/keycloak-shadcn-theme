import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function LoginPageExpired(props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;
    const { url } = kcContext;
    const { msg } = i18n;

    return (
      <Template {...props} displayMessage={false} headerNode={msg("pageExpiredTitle")}>
          <div className="w-full max-w-md">
              <div className="py-2 px-4 sm:rounded-lg sm:px-6">
                  <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="space-y-4">
                          <p>
                              {msg("pageExpiredMsg1")}{" "}
                              <a href={url.loginRestartFlowUrl} id="loginRestartLink" className="font-medium text-indigo-600 hover:text-indigo-500">
                                  {msg("doClickHere")}
                              </a>
                              .
                          </p>
                          <p>
                              {msg("pageExpiredMsg2")}{" "}
                              <a href={url.loginAction} id="loginContinueLink" className="font-medium text-indigo-600 hover:text-indigo-500">
                                  {msg("doClickHere")}
                              </a>
                              .
                          </p>
                      </AlertDescription>
                  </Alert>
              </div>
          </div>
      </Template>
    );
}
